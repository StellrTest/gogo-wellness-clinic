# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static 3-file website for **GoGo Wellness Clinic** (med spa, Thornhill ON). No build step, no framework, no package manager — edit files and open `index.html` directly in a browser.

## Development

```bash
# Preview locally
open index.html

# Push to GitHub Pages (live site)
git add . && git commit -m "..." && git push origin main
```

Live URL: **https://stellrtest.github.io/gogo-wellness-clinic/**

## Architecture

Three files, no dependencies beyond Google Fonts (loaded via CDN):

| File | Role |
|------|------|
| `index.html` | All page content and structure. Also contains the LocalBusiness JSON-LD schema in `<head>` and the popup modal markup before `</body>`. |
| `styles.css` | Full design system. CSS custom properties (tokens) are defined at the top of `:root`. Sections are clearly commented in order: tokens → reset → components → FAQ → popup → animations → responsive. |
| `main.js` | All interactivity: nav scroll effect, mobile menu, FAQ accordion (JS height animation), button press feedback, scroll reveal (IntersectionObserver), contact form validation, popup (exit-intent + timer), smooth scroll. |

## Design tokens (`:root` in styles.css)

Primary brand colour: `#C4836A` (warm terracotta). All colours, shadows, radii, and transitions are CSS variables — change the token, not individual rules.

## FAQ accordion

The accordion uses a JS height animation — **not** CSS `hidden`. On init, `main.js` removes the `hidden` attribute from all `.faq__a` elements and sets `height: 0; opacity: 0` via inline styles. Do not add `hidden` back or the transition will break.

## Popup

Triggered by exit intent (cursor leaves viewport top) or an 8-second timer. Dismissed state is stored in `localStorage` under key `gogo_popup_dismissed` with a 30-day cooldown. The popup image is `popup-woman.png` (local file, committed to repo).

## Images

Hero image pulled directly from the live WordPress site:
`https://gogowellnessclinic.com/wp-content/uploads/2024/09/Front-12.png`

Other clinic images are also served from `gogowellnessclinic.com/wp-content/uploads/`. The about-section images are Unsplash URLs.
