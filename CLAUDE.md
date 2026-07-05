# Martin Blume — Memorial Website

Static website for GitHub Pages. No build step, no dependencies — pure HTML/CSS.

## What this is

A memorial site for photographer Martin Blume (* 23. November 1956 † 10. Mai 2015, Landau i.d. Pfalz), rebuilt from four archived websites recovered from the Wayback Machine. The root `index.html` is the primary memorial page; the four subfolders preserve his earlier sites as a historical archive.

---

## Current state (as of 2026-07-05)

**LIVE** at https://yawn9.github.io — GitHub repo: YAWN9/yawn9.github.io

- Web3Forms keys: index.html "Erinnerungen" form → `97ba4895-a00b-43a7-a474-989e70832c21`; friends.html contact form → `c6fb22a2-6822-4c90-9e8a-bc08a3cf68ec`
- index.html has one contact form only (the "Erinnerungen teilen" form) — the upper Kontakt form was removed
- Domain references throughout the project use `yawn9.github.io` (not martinblume.de)
- robots.txt is currently set to `Disallow: /` — intentionally blocking all indexing until ready to launch
- All 40 pages across all four sub-sites have "← Martin Blume" back-navigation to `../index.html`
- Language switcher bugs fixed: feinste-photographien and academia-palatina index pages route correctly
- `friends.html` is committed — password-protected page (see details below)
- `aaronblume_site/index.html` exists locally — draft personal site for Aaron Blume, NOT committed, NOT deployed

---

## Remaining TODO (priority order)

1. **Fix sitemap.xml** — 9 pages are missing:
   - `feinste-photographien/publications.html`
   - `feinste-photographien/references.html`
   - `academia-palatina/ateliers-fr.html`
   - `academia-palatina/actualites-fr.html`
   - `academia-palatina/contact-fr.html`
   - `academia-palatina/mentions-legales-fr.html`
   - `fineart-ultralarge/impressum.html`
   - `fineart-ultralarge/projekte.html`
   - `fineart-ultralarge/galerie.html`

2. **Update robots.txt** when ready to launch:
   - Flip `Disallow: /` to `Allow: /`
   - Add `Disallow: /friends.html`
   - Add `Disallow: /aaronblume_site/`

3. **Fix 404.html** — currently German-only; add an English line

4. **Replace missing images** — only possible with original files from family (all Wayback Machine sources are corrupted HTML, not recoverable):
   - `feinste-photographien/images/philomb.jpg` — portrait of Martin Blume (Philosophie page + memorial hero)
   - `feinste-photographien/images/DLA_Mit_Rand.jpg` — "Das Letzte Abendmahl, 2009"
   - `academia-palatina/images/workhead.jpg` — workshop photo
   - `real-photography/images/schirm.jpg`, `martin_foto.gif`, `martin_foto.jpg` — corrupted
   - `fineart-ultralarge/images/` — gallery/01-04.jpg, ingelheim/blume.jpg, ingelheim/ringelheim.jpg, sedi04_photo.jpg, sedi04_title.jpg, logo.gif — all corrupted

5. **Extend fineart-ultralarge/vita.html** — currently stops at 2000; missing 2000–2007 exhibitions

6. **Fill gallery.html** — 84% placeholder (16/19 items have no photos); placeholders cover: Auschwitz heute, Verdun, Der Dom zu Mainz, Série Populaire, Psychographie, Feinste Photographien. Each placeholder is a `<div class="photo-placeholder">` — replace with `<div class="photo-item"><img src="..."></div>` when images are available.

7. **Update contact email in index.html** — currently `info@feinste-photographien.com`

8. **Deploy aaronblume_site/** — draft minimal personal site for Aaron Blume at `aaronblu.me`; commit and deploy when ready

---

## friends.html — password-protected page

Committed to the repo. Intended for friends of Alissa Gans (@alissas.archive).

- `<meta name="robots" content="noindex, nofollow">` — not indexed
- 3-attempt lockout with 30-minute timeout

**Auth system (as of 2026-07-05):** Two passwords, each unlocking a different content section (persona). The `HASHES` array in the JS holds `sha256(password)` for verification only — the actual AES key is derived separately via PBKDF2 and never stored in the HTML.

| Password | `HASHES` index | Persona | Name | Archive content |
|----------|---------------|---------|------|-----------------|
| Password A | `HASHES[0]` | `#persona-0` | Berge | "Noch keine Links" placeholder |
| Password B | `HASHES[1]` | `#persona-1` | Standesamt | iCloud shared album (live, AES-GCM encrypted link) |

Persona names are used in the Web3Forms contact form subject line (`alissa's archive — Standesamt — Nachricht`) so incoming messages can be identified by source without exposing the password.

> **Critical:** every `data-enc` value inside `#persona-N` **must** be encrypted with the password at `HASHES[N]`. Putting a link encrypted with password B into persona-0 will fail silently — AES-GCM auth tag rejection produces no visible error. Always verify with `node decrypt_test.js` after adding a link.

**Link encryption:** Archive links are stored as AES-256-GCM ciphertext in `data-enc` attributes (base64url-encoded `IV[12] + ciphertext + authTag[16]`). Key is derived with PBKDF2-SHA256, 100 000 iterations, salt `alissas.archive.v1`. Run `node encrypt_link.js` locally to encrypt new links — the script derives the same key from the password and outputs a value ready to paste into `data-enc=""`. Links for persona 0 must be encrypted with password A; links for persona 1 with password B (they cannot cross-decrypt). See [`link-encryption-guide.md`](link-encryption-guide.md) for step-by-step instructions.

**Contact form:** A "Kontakt / Feedback" form sits between the Instagram embed and the archive links (inside `#page`, only visible after login). Name + message required; email optional. Submits to Web3Forms (same key as index.html). Subject line and a `persona` field are stamped dynamically on submit using `PERSONA_NAMES` — e.g. `alissa's archive — Standesamt — Nachricht` — so incoming emails identify which password group sent them. Redirect after submit returns to `friends.html`; sessionStorage keeps the session alive so the lock screen is not shown again.

**Lightbox architecture:** Tiles are `<button>` elements with `data-post="ID"`. Clicking opens an in-page lightbox: blockquote markup lives in inert `<template>` elements, cloned fresh into a visible container on each open, then `instgrm.Embeds.process()` is called. Closing clears the body so the next open gets a fresh clone. Esc key and backdrop click also close. No embed section at the bottom of the page.

**Tile design:** 4:5 portrait tiles, `alissa/new1/2/3.png` as `<img>` with `object-fit: cover`, `alissa/profile.jpg` as real avatar in story ring, display name "Alissa Gans", bio "Munich-based architect and photographer".

**Local-only assets (`alissa/` folder — untracked):**
- `alissa/new1.png`, `new2.png`, `new3.png` — tile background images
- `alissa/profile.jpg` — avatar in story ring
- Commit `alissa/` together with `friends.html` when ready to deploy the tile images

**History note:** Earlier experiments (A–I) explored embedding the IG widget inside the tiles — rejected. Also tried tiles → inline embeds at page bottom, and tiles → direct instagram.com links — both rejected in favour of the lightbox. Earlier password schemes used XOR-with-hash then a two-level L1/L2 gate — replaced by the current single-gate multi-persona AES-GCM system after a JS breakage. Experiments are in `_scratch/`.

---

## File structure

```
/
├── index.html              ← Main memorial page (start here)
├── gallery.html            ← Photo gallery with lightbox (84% placeholder)
├── friends.html            ← Password-protected page for Alissa's friends
├── 404.html                ← Custom not-found page (German only — needs English line)
├── sitemap.xml             ← Missing 9 pages (see TODO above)
├── robots.txt              ← Currently Disallow: / (intentional — pre-launch)
├── profile.gif             ← Silhouette logo — used as favicon + gallery placeholder
├── encrypt_link.js          ← Encrypts a URL for a friends.html data-enc attr (run with correct persona password)
├── decrypt_test.js          ← Verifies a password + data-enc pair decrypts correctly before committing
├── link-encryption-guide.md ← Step-by-step guide for adding encrypted links to friends.html
├── CLAUDE.md               ← This file
│
├── images/
│   └── real_title.jpg      ← real-photography.de header (used on landing archive card)
│
├── aaronblume_site/        ← LOCAL ONLY — not committed, not deployed
│   └── index.html          ← Draft minimal personal site for Aaron Blume (aaronblu.me)
│
├── feinste-photographien/  ← 2014–2015 site — NEWEST, used as memorial baseline
│   ├── style.css
│   ├── index.html          ← Language selector (DE | FR) — fixed to route FR → philosophie-fr.html
│   ├── philosophie.html / philosophie-fr.html
│   ├── projekte.html / projets.html
│   ├── ausstellungen.html / expositions.html
│   ├── publikationen.html / publications.html
│   ├── referenzen.html / references.html
│   ├── vita.html / vita-fr.html
│   ├── kontakt.html / contact.html
│   └── images/
│       ├── feph.png              ✓ valid (header image)
│       ├── philomb.jpg           ✗ CORRUPTED — not in Wayback Machine; replace with real file
│       └── DLA_Mit_Rand.jpg      ✗ CORRUPTED — not in Wayback Machine; replace with real file
│
├── academia-palatina/      ← 1998–2015 site — workshops & photography school
│   ├── style.css
│   ├── index.html          ← Language selector (DE | FR) — fixed to route FR → photographie-fr.html
│   ├── photographie-de.html / photographie-fr.html
│   ├── workshops-de.html / ateliers-fr.html
│   ├── aktuelles-de.html / actualites-fr.html
│   ├── kontakt-de.html / contact-fr.html
│   ├── impressum-de.html / mentions-legales-fr.html
│   └── images/
│       ├── kphed.png             ✓ valid (header image)
│       └── workhead.jpg          ✗ CORRUPTED — not in Wayback Machine; replace with real file
│
├── real-photography/       ← 2004–2009 site — English language
│   ├── style.css
│   ├── index.html
│   ├── photos.html         ← Photography philosophy/statement
│   ├── special.html
│   ├── collections.html
│   ├── exhibitions.html
│   ├── vita.html
│   ├── contact.html
│   └── images/
│       ├── real_title.jpg        ✓ valid (header image)
│       ├── night_views.jpg       ✓ valid — "Vestiges", Burg Trifels 2005
│       ├── schirm.jpg            ✗ CORRUPTED — not in Wayback Machine
│       ├── martin_foto.gif       ✗ CORRUPTED — not in Wayback Machine
│       └── martin_foto.jpg       ✗ CORRUPTED — not in Wayback Machine
│
└── fineart-ultralarge/     ← 2004–2007 site — OLDEST, richest early vita
    ├── style.css
    ├── index.html
    ├── workshops.html       ← Seminar types + 2004 dates
    ├── galerie.html
    ├── sonderditionen.html  ← Quarterly special editions (DE/EN/FR)
    ├── projekte.html        ← Ingelheim 2003, Busch & Blume 1999, Grenze im Kopf 1999
    ├── vita.html            ← MOST COMPLETE vita — exhibitions back to 1991, Vestiges project; stops at 2000
    ├── kontakt.html
    ├── impressum.html
    └── images/
        ├── mbtitle.jpg           ✓ valid — "Three Windows", Special Edition I-2005
        ├── gallery/01-04.jpg     ✗ CORRUPTED — not in Wayback Machine
        ├── ingelheim/blume.jpg   ✗ CORRUPTED — not in Wayback Machine
        ├── ingelheim/ringelheim.jpg ✗ CORRUPTED — not in Wayback Machine
        ├── sedi04_photo.jpg      ✗ CORRUPTED — not in Wayback Machine
        ├── sedi04_title.jpg      ✗ CORRUPTED — not in Wayback Machine
        └── logo.gif              ✗ CORRUPTED — not in Wayback Machine
```

---

## Design system

All pages share the same visual language:

| Token | Value | Use |
|---|---|---|
| Background | `#0e0e0e` | All pages |
| Gold accent | `#897052` | Active nav, dates, headings |
| Body text | `#bfad98` | Main content |
| Dim text | `#7a6a58` | Inactive nav, captions |
| Rule/border | `#1e1e1e` | Section dividers |
| Font body | Georgia, serif | Content |
| Font UI | Helvetica Neue, sans-serif | Nav, labels |

The memorial `index.html` has its own inline `<style>` block. Each archived site has its own `style.css` (identical copies).

---

## Deployment — already live

The site is deployed on GitHub Pages at https://yawn9.github.io via repo YAWN9/yawn9.github.io. No custom domain is configured yet.

### If adding a custom domain later (e.g. martinblume.de)
1. In the GitHub repo Settings → Pages → Custom domain: enter the domain
2. At the registrar, add these DNS records:
   ```
   A     @    185.199.108.153
   A     @    185.199.109.153
   A     @    185.199.110.153
   A     @    185.199.111.153
   CNAME www  yawn9.github.io
   ```
3. Wait ~1 hour for DNS to propagate
4. Enable **Enforce HTTPS** in GitHub Pages settings
5. Update domain references in `index.html` (OG tags, form redirects), `sitemap.xml`, and `robots.txt`

---

## How to continue in a new conversation

Tell Claude:
> "I'm working on the Martin Blume memorial website at C:\Users\Aaron\claude_project. Read CLAUDE.md for full context."

Key things a future Claude session should know:
- The memorial `index.html` is the primary page — everything else is archive
- The site is LIVE at https://yawn9.github.io — repo is YAWN9/yawn9.github.io
- Web3Forms key `c6fb22a2-6822-4c90-9e8a-bc08a3cf68ec` is already set in index.html
- robots.txt blocks all indexing intentionally (`Disallow: /`) — flip when ready to launch
- The French pages for feinste-photographien (other than philosophie-fr.html) and academia-palatina were NOT in the Wayback Machine archive; they were reconstructed by translation
- `fineart-ultralarge/vita.html` has the richest biographical content — early exhibitions back to 1991, photokina appearances, Günter Wallraff collaboration, Vestiges project description — but stops at 2000
- The real-photography.de site is in English; the others are German + French
- The profile.gif (silhouette of photographer with umbrella) is the site logo
- Web3Forms is used for contact (×1) and condolences (×1) on index.html, and a contact form (×1) on friends.html — all use the same key
- `friends.html` has a "Kontakt / Feedback" form (between IG embed and archive links); subject is dynamically set to `alissa's archive — <PersonaName> — Nachricht` so incoming emails are identifiable by persona
- All corrupted image files came from the Wayback Machine as HTML; they cannot be recovered from the archive — only original family files can replace them
- `friends.html` is a single-gate multi-persona page for Alissa Gans's Instagram followers; committed but noindexed. Two passwords → two different archive sections. Links are AES-256-GCM encrypted in `data-enc` attrs; run `node encrypt_link.js` locally to add new ones
- `friends.html` tile/lightbox: 4:5 `<button data-post="ID">` tiles → in-page lightbox (template clone + `instgrm.Embeds.process()`)
- `alissa/` folder exists locally (untracked): `new1/2/3.png` tile images + `profile.jpg` avatar — commit together with friends.html when ready to deploy images
- `aaronblume_site/` is a local-only draft for Aaron Blume's personal site (aaronblu.me) — not committed

---

## Sources

All content recovered from the Internet Archive (Wayback Machine):

| Site | Archive URL |
|---|---|
| feinste-photographien.de | web.archive.org/web/20150131021433/http://www.feinste-photographien.de/ |
| academia-palatina.de | web.archive.org/web/20150131065017/http://www.academia-palatina.de/ |
| real-photography.de | web.archive.org/web/20090131124810/http://real-photography.de/ |
| fineart-ultralarge.com | web.archive.org/web/20050128071817/http://fineart-ultralarge.com/ |
| real-photography.de (2004 vita) | web.archive.org/web/20040314172704/http://www.real-photography.de/mb11.htm |
