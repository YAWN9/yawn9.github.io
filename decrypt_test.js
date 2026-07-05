#!/usr/bin/env node
/**
 * Tests whether a given password can decrypt the data-enc value
 * from friends.html, and which persona it maps to.
 *
 * Usage: node decrypt_test.js
 */
'use strict';

const { webcrypto } = require('crypto');
const readline      = require('readline');

const { subtle } = webcrypto;
const KDF_SALT = 'alissas.archive.v1';
const KDF_ITER = 100_000;

/* Must match friends.html exactly */
const HASHES = [
  'ddbe4974ab8ef04f44272369cd77edcec08ddd575bef739a45d4e37baa510aa3', // persona 0
  '711300b864bc7963eb40b2939eadb36ff486f92729c849cb287338f188f7f9de'  // persona 1
];

/* data-enc value from friends.html persona-0 */
const ENC = 'LhAC08K9dVusTFb3fMgUj9HLjdsRw8uW7kLuFYvPHk1YMXF-nInOSAf0j9hcimYzjP05LHxGmSPD27ot0FOcSw1uw15ZVpOhn0hAY5SYE6s9tKL1vw';

async function sha256hex(s) {
  const buf = await subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Buffer.from(buf).toString('hex');
}

function ask(rl, q) {
  return new Promise(resolve => rl.question(q, resolve));
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const password = await ask(rl, 'Password to test: ');
  rl.close();

  if (!password) { console.error('No password entered.'); process.exit(1); }

  /* Step 1: check which persona this password maps to */
  const hash    = await sha256hex(password);
  const persona = HASHES.findIndex(h => h === hash);
  console.log(`\nSHA-256 hash  : ${hash}`);
  if (persona >= 0) {
    console.log(`Persona match : ${persona} ✓`);
  } else {
    console.log('Persona match : none — password does not match HASHES[0] or HASHES[1]');
    console.log('                The link will never open with this password.');
    process.exit(1);
  }

  /* Step 2: derive AES key and attempt decryption */
  const keyMat = await subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']
  );
  const key = await subtle.deriveKey(
    { name: 'PBKDF2', salt: new TextEncoder().encode(KDF_SALT), iterations: KDF_ITER, hash: 'SHA-256' },
    keyMat,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  const b64    = ENC.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - b64.length % 4) % 4);
  const bytes  = Buffer.from(padded, 'base64');

  console.log(`\nEncoded length : ${ENC.length} chars`);
  console.log(`Decoded bytes  : ${bytes.length}  (IV: 12, ciphertext+tag: ${bytes.length - 12})`);

  if (persona !== 0) {
    console.log('\n⚠ This is persona-' + persona + ' password. ENC is from persona-0.');
    console.log('  Decryption will fail — wrong key for this ciphertext.');
  }

  try {
    const plain = await subtle.decrypt(
      { name: 'AES-GCM', iv: bytes.slice(0, 12) },
      key,
      bytes.slice(12)
    );
    console.log('\n✓ Decryption succeeded!');
    console.log('  URL:', new TextDecoder().decode(plain));
  } catch (err) {
    console.error('\n✗ Decryption failed:', err.message);
    if (persona === 0) {
      console.error('  Password matches HASHES[0] but decryption failed.');
      console.error('  The ENC value may have been created with a different password.');
      console.error('  Re-run encrypt_link.js and update data-enc in friends.html.');
    }
  }
}

main().catch(err => { console.error(err); process.exit(1); });
