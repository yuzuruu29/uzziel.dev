# Willow Creek Farmstay — Concept Landing Page

> **Concept portfolio sample. Not a real client project.**

A mobile-first static landing page for a farm stay guest inquiry flow. Demonstrates how a rural accommodation host can replace scattered inquiries across Airbnb, Instagram, Facebook, and email with one clear page, form, and lead-capture system.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | Full landing page — 15 sections |
| `style.css` | Mobile-first CSS with custom properties |
| `script.js` | FAQ accordion, mobile nav, form thank-you state |
| `README.md` | This file |

---

## Sections (in order)

1. Header with sticky nav and mobile hamburger
2. Hero — H1, subhead, above-fold CTA at 375px
3. Quick Facts bar — Sleeps 4, Pet-Friendly, Check-in 3PM, From $150/night
4. Best For — 4 cards (Couples, Families, Remote Workers, Small Groups)
5. Stay Details — cabin description + 8-item amenities checklist
6. Farm Experiences — 4 cards (Animal visits, Garden walks, Campfire evenings, Seasonal harvest)
7. Rates — starting rate, inquiry-to-confirm copy, CTA
8. Gallery — 6 placeholder image divs (4:3 ratio, descriptive alt text, captions)
9. Location — map placeholder (300px tall) + location copy
10. House Rules — 6 rules in a card grid
11. FAQ — 8-item accordion (JS-powered, no libraries)
12. Inquiry CTA — centered H2 and CTA button
13. Inquiry Form — 12 fields including date pickers, selects, radio buttons, textarea
14. Thank You State — shown on form submit; form hidden, thank-you div revealed
15. Footer — disclaimer, nav links, credit line

---

## Technical Notes

- **Static only** — GitHub Pages compatible. No server-side code.
- **No external JS libraries** — vanilla JS only.
- **Mobile-first** — base styles at 375px, breakpoints at 480px, 600px, 768px, 900px, 1024px+.
- **CSS custom properties** — all colors and spacing defined in `:root`.
- **Accessible** — semantic HTML5, labeled inputs, alt text on all images, `aria-expanded` on accordion, `aria-live` on thank-you state.
- **Fonts** — Playfair Display (display headings) + Inter (body) via Google Fonts with preconnect.

---

## Target Client Profile

Farm stay hosts, rural cabin owners, and agritourism operators in the US, Canada, Australia, and New Zealand looking to capture guest inquiries directly — without relying solely on Airbnb or social media DMs.
