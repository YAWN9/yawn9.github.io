#!/usr/bin/env node
/**
 * Encrypts a URL for use in friends.html.
 *
 * Uses AES-256-GCM with a key derived from the page password via PBKDF2.
 * The output (base64url string) is safe to paste into  data-enc=""  in the HTML.
 * The page decrypts it in-browser after the visitor enters the correct password.
 *
 * Requirements: Node.js 16+  (uses built-in crypto — no npm install needed)
 *
 * Usage:
 *   node encrypt_link.js
 *
 * Run once per password — each password produces a different key, so links
 * encrypted with password A can only be decrypted by persona 0 visitors, etc.
 */

'use strict';

const { webcrypto } = require('crypto');
const readline      = require('readline');

const { subtle } = webcrypto;
const KDF_SALT = 'alissas.archive.v1';
const KDF_ITER = 100000;

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const password = await ask(rl, 'Password (same as the friends.html gate): ');
  const url      = await ask(rl, 'URL to encrypt: ');
  rl.close();

  if (!password || !url) {
    console.error('Aborted — password and URL are both required.');
    process.exit(1);
  }

  const enc = new TextEncoder();

  /* Derive AES-256-GCM key via PBKDF2 — same parameters as the browser */
  const keyMat = await subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  const key    = await subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode(KDF_SALT), iterations: KDF_ITER, hash: 'SHA-256' },
    keyMat,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  /* Random 12-byte IV — different every run, so the same URL produces different ciphertext */
  const iv = webcrypto.getRandomValues(new Uint8Array(12));

  const ct = new Uint8Array(await subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(url)));

  /* Pack: [12-byte IV][ciphertext + 16-byte auth tag] → base64url */
  const combined = new Uint8Array(12 + ct.length);
  combined.set(iv);
  combined.set(ct, 12);

  const b64 = Buffer.from(combined).toString('base64url');

  console.log('\n── Encrypted value ──────────────────────────────────');
  console.log(b64);
  console.log('\nPaste into  data-enc=""  in friends.html (in the correct persona section), e.g.:');
  console.log(`  <a href="#" class="folder-link" data-enc="${b64}">`);
  console.log('─────────────────────────────────────────────────────\n');
}

main().catch(err => { console.error(err.message); process.exit(1); });
