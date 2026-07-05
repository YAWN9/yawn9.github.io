# Martin Blume — Memorial Website

Static website for GitHub Pages. No build step, no dependencies — pure HTML/CSS.

## What this is

A memorial site for photographer Martin Blume (* 23. November 1956 † 10. Mai 2015, Landau i.d. Pfalz), rebuilt from four archived websites recovered from the Wayback Machine. The root `index.html` is the primary memorial page; the four subfolders preserve his earlier sites as a historical archive.

---

## Current state (as of 2026-07-05)

**LIVE** at https://yawn9.github.io — GitHub repo: YAWN9/yawn9.github.io

- Web3Forms access key is set: `c6fb22a2-6822-4c90-9e8a-bc08a3cf68ec` (index.html lines ~750 and ~788)
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
- Two-level password protection using SHA-256 hashed keys stored in the file
- 3-attempt lockout with 30-minute timeout
- **Level 1:** Shows Instagram profile card + @alissas.archive embed with 3 real posts (DVWLXCOjBzH, DU_NgxEDNj2, DO24N6bDGfw)
- **Level 2:** Shows private folder links (4 placeholder slots)

**Deployed architecture (as of 2026-07-05):** Tiles are `<button>` elements with `data-post="ID"`. Clicking a tile opens an in-page lightbox: the blockquote markup lives in inert `<template>` elements, cloned fresh into a visible container on each open, then `instgrm.Embeds.process()` is called. This avoids the hidden-at-load zero-height bug. Closing the lightbox clears the body so the next open gets a fresh clone. Esc key and backdrop click also close. No embed section at the bottom of the page.

**Local assets ready, not yet committed (`alissa/` folder — gitignored):**
- `alissa/new1.png`, `new2.png`, `new3.png` — post images (current, in use as tile backgrounds)
- `alissa/profile.jpg` — Alissa's profile photo (in use in story-ring circle)
- `alissa/4_5_1.PNG`, `4_5_2.PNG`, `4_5_3.PNG` — older portrait crops (superseded by new1/2/3)

**Current tile design (applied 2026-07-05):** 4:5 portrait tiles, `new1/2/3.png` as `<img>` with `object-fit: cover` (crops to fit, no stretching), `profile.jpg` real avatar in story ring, display name "Alissa Gans", bio "Munich-based architect and photographer". Commit `friends.html` + `alissa/` together when ready.

**History note:** Earlier experiments (A–I, documented 2026-06-07) explored embedding the IG widget *inside* the tiles — rejected because the blockquote's nested `<a>` tags break the outer anchor, and cropped embeds mostly show header chrome. Also explored a "tiles scroll to inline embeds at page bottom" structure and a "tiles link directly to instagram.com" structure — both rejected in favour of the lightbox. All experiments are in `_scratch/` (see `_scratch/index.html` for a clickable overview).

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
- Web3Forms is used for contact (×1) and condolences (×1) — same key for both
- All corrupted image files came from the Wayback Machine as HTML; they cannot be recovered from the archive — only original family files can replace them
- `friends.html` is a two-level password-protected page for Alissa Gans's Instagram followers; committed but noindexed
- The deployed `friends.html` tile architecture: `<button data-post="ID">` → in-page lightbox (template clone + `instgrm.Embeds.process()`) — no embed section at bottom
- `alissa/` folder exists locally (gitignored): `4_5_1.PNG`, `4_5_2.PNG`, `4_5_3.PNG`, `profile.jpg` — ready for tile redesign
- Three tile redesign drafts in `_scratch/`: version_j (4:5, dark avatar), version_k (4:5, real avatar), version_l (3:4, real avatar) — pick one and apply to `friends.html` + commit `alissa/` assets
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
