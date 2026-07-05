# friends.html — Link Encryption Guide

## Current state (2026-07-05)

| Persona | Password (`HASHES` index) | Live links |
|---------|--------------------------|------------|
| 0 (`#persona-0`) | Password A (`HASHES[0]`) | 0 — "Noch keine Links" placeholder |
| 1 (`#persona-1`) | Password B (`HASHES[1]`) | 1 — iCloud shared album (encrypted) |

> **Rule:** every `data-enc` in `#persona-N` must be encrypted with `HASHES[N]`'s password.
> Verify any new link with `node decrypt_test.js` before committing.

---

## How it works

Archive links are stored as **AES-256-GCM ciphertext** in `data-enc` attributes.
No plaintext URL ever appears in the HTML source.

**Encryption scheme:**
- Key derivation: PBKDF2-SHA256, 100 000 iterations, fixed salt `alissas.archive.v1`
- Encryption: AES-256-GCM, random 12-byte IV per link
- Format stored in HTML: `base64url( IV[12] + ciphertext + authTag[16] )`

The AES key is derived from the raw password — it is **never stored in the HTML**.
`HASHES[i]` (the SHA-256 hashes in the JS) are used only to verify the password at
login; they cannot be reversed to recover the key.

After a correct login the browser derives the AES key, stores the raw key bytes in
`sessionStorage` (not the password), and decrypts every `data-enc` attribute in the
matching persona section. The key disappears when the tab closes.

Links encrypted with password A **cannot** be decrypted with password B (different
PBKDF2 keys). Always use the correct password for the target persona.

---

## Adding a link

### Step 1 — Run the local script

```
node encrypt_link.js
```

Enter the **password for the target persona** and the URL when prompted.
The script outputs a base64url string. Run it once per new link.

### Step 2 — Paste into the correct persona section

Find `<div id="persona-N">` in `friends.html` and paste into a card's `data-enc`:

```html
<!-- Before -->
<a href="#" class="folder-link" data-enc="">

<!-- After -->
<a href="#" class="folder-link" data-enc="PASTE_VALUE_HERE">
```

The `href="#"` stays as-is — the browser overwrites it at runtime after decryption.

### Step 3 — Update the card labels

```html
<p class="folder-name">Shooting München · Juli 2025</p>
<p class="folder-meta">2025-07-05 · iCloud</p>
```

### Adding more cards

Copy an existing `<a class="folder-link">` block, update labels, run the script again,
paste the new value into `data-enc=""`.

---

## Security

| Threat | Protection |
|--------|------------|
| Bot / crawler reads the HTML | No plaintext URLs — only ciphertext |
| Visitor views source | Cannot decrypt without the password |
| Attacker sees `HASHES` in source | SHA-256 is one-way; cannot recover password or AES key |
| Brute-force | PBKDF2 with 100 000 iterations slows guessing significantly |
| Password A holder tries persona 1 links | Different PBKDF2 key — AES-GCM auth tag rejects silently |
| Session replay | `sessionStorage` clears on tab close; key bytes only, not the password |

Suitable for a private friends page. For truly sensitive content, use server-side
access control (e.g. a private GitHub repo or a backend with auth).
