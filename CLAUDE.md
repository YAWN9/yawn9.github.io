# Martin Blume — Memorial Website

Static website for GitHub Pages. No build step, no dependencies — pure HTML/CSS.

## What this is

A memorial site for photographer Martin Blume (* 23. November 1956 † 10. Mai 2015, Landau i.d. Pfalz), rebuilt from four archived websites recovered from the Wayback Machine. The root `index.html` is the primary memorial page; the four subfolders preserve his earlier sites as a historical archive.

---

## File structure

```
/
├── index.html              ← Main memorial page (start here)
├── gallery.html            ← Photo gallery with lightbox
├── 404.html                ← Custom not-found page
├── sitemap.xml
├── robots.txt
├── profile.gif             ← Silhouette logo — used as favicon + gallery placeholder
├── CLAUDE.md               ← This file
│
├── images/
│   └── real_title.jpg      ← real-photography.de header (used on landing archive card)
│
├── feinste-photographien/  ← 2014–2015 site — NEWEST, used as memorial baseline
│   ├── style.css
│   ├── index.html          ← Language selector (DE | FR)
│   ├── philosophie.html / philosophie-fr.html
│   ├── projekte.html / projets.html
│   ├── ausstellungen.html / expositions.html
│   ├── publikationen.html / publications.html
│   ├── referenzen.html / references.html
│   ├── vita.html / vita-fr.html
│   ├── kontakt.html / contact.html
│   └── images/
│       ├── feph.png              ✓ valid (header image)
│       ├── philomb.jpg           ✗ MISSING — portrait photo for Philosophie page
│       └── DLA_Mit_Rand.jpg      ✗ MISSING — "Das Letzte Abendmahl, 2009"
│
├── academia-palatina/      ← 1998–2015 site — workshops & photography school
│   ├── style.css
│   ├── index.html          ← Language selector (DE | FR)
│   ├── photographie-de.html / photographie-fr.html
│   ├── workshops-de.html / ateliers-fr.html
│   ├── aktuelles-de.html / actualites-fr.html
│   ├── kontakt-de.html / contact-fr.html
│   ├── impressum-de.html / mentions-legales-fr.html
│   └── images/
│       ├── kphed.png             ✓ valid (header image)
│       └── workhead.jpg          ✗ MISSING — workshop photo
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
│       └── night_views.jpg       ✓ valid — "Vestiges", Burg Trifels 2005
│
└── fineart-ultralarge/     ← 2004–2007 site — OLDEST, richest early vita
    ├── style.css
    ├── index.html
    ├── workshops.html       ← Seminar types + 2004 dates
    ├── galerie.html
    ├── sonderditionen.html  ← Quarterly special editions (DE/EN/FR)
    ├── projekte.html        ← Ingelheim 2003, Busch & Blume 1999, Grenze im Kopf 1999
    ├── vita.html            ← MOST COMPLETE vita — exhibitions back to 1991, Vestiges project
    ├── kontakt.html
    ├── impressum.html
    └── images/
        ├── mbtitle.jpg           ✓ valid — "Three Windows", Special Edition I-2005
        └── (others failed to download from archive)
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

## Before going live — checklist

### 1. Web3Forms access key (REQUIRED)
Go to [web3forms.com](https://web3forms.com), create a free account (250 submissions/month), and replace both occurrences of `YOUR_WEB3FORMS_ACCESS_KEY` in `index.html`:
- Line ~440 — contact form
- Line ~475 — condolences/memories form

### 2. Update the domain placeholder (REQUIRED if using a custom domain)
Replace `martinblume.de` with the actual domain in:
- `index.html` — OG tag `og:url`, `og:image`, `twitter:image`, and both form `redirect` values
- `sitemap.xml` — all `<loc>` entries
- `robots.txt` — the `Sitemap:` line

If staying on `yourusername.github.io/repo`, use that URL instead.

### 3. Missing portrait photo (HIGH IMPACT)
`feinste-photographien/images/philomb.jpg` — the portrait of Martin Blume shown on the Philosophie page and the memorial hero. The file exists but may be broken (downloaded as HTML from the archive). Replace with the actual photo if you have it. The memorial page uses `onerror` to hide it silently if broken.

### 4. Missing content images
Add these if you have them:
- `feinste-photographien/images/DLA_Mit_Rand.jpg` — "Das Letzte Abendmahl, 2009"
- `academia-palatina/images/workhead.jpg` — workshop photo
- Any actual gallery images → add to `gallery.html` replacing the placeholder `<div>` blocks

### 5. Gallery placeholders
`gallery.html` has placeholder slots for: Auschwitz heute, Verdun, Der Dom zu Mainz, Série Populaire, Psychographie, Feinste Photographien. Each placeholder is a `<div class="photo-placeholder">` — replace with `<div class="photo-item"><img src="..."></div>` when images are available.

### 6. Verify death location
Currently set to `10. Mai 2015, Landau i.d. Pfalz`. Confirm this is correct in `index.html` hero section.

---

## How to deploy on GitHub Pages

1. Create a GitHub account at github.com if you don't have one
2. Create a new repository — name it `martinblume` (or the domain name)
3. Upload all files (drag & drop in the GitHub web UI, or use Git)
4. Go to the repository **Settings → Pages**
5. Source: **Deploy from a branch** → branch `main`, folder `/ (root)`
6. Save — the site will be live at `https://yourusername.github.io/martinblume/`

### With a custom domain (e.g. martinblume.de)
1. Buy the domain at any registrar (Hetzner, INWX, Namecheap — ~€10–15/year)
2. In the GitHub repo Settings → Pages → Custom domain: enter `martinblume.de`
3. At the registrar, add these DNS records:
   ```
   A     @    185.199.108.153
   A     @    185.199.109.153
   A     @    185.199.110.153
   A     @    185.199.111.153
   CNAME www  yourusername.github.io
   ```
4. Wait ~1 hour for DNS to propagate
5. Enable **Enforce HTTPS** in GitHub Pages settings

---

## How to continue in a new conversation

Tell Claude:
> "I'm working on the Martin Blume memorial website at C:\Users\Aaron\claude_project. Read CLAUDE.md for full context."

Key things a future Claude session should know:
- The memorial `index.html` is the primary page — everything else is archive
- The French pages for feinste-photographien (other than philosophie-fr.html) and academia-palatina were NOT in the Wayback Machine archive; they were reconstructed by translation
- `fineart-ultralarge/vita.html` has the richest biographical content — early exhibitions back to 1991, photokina appearances, Günter Wallraff collaboration, Vestiges project description
- The real-photography.de site is in English; the others are German + French
- The profile.gif (silhouette of photographer with umbrella) is the site logo
- Web3Forms is used for contact (×1) and condolences (×1) — both need the same access key

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
