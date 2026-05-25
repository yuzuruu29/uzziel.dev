# ClearPath Lawn Care — Concept Landing Page

> **Concept portfolio sample. Not a real client project.**

A mobile-first static landing page for a local lawn care quote request flow. Demonstrates how a lawn care or home service owner can collect complete, structured quote requests — replacing vague DMs and phone calls with a form that captures address, yard size, service type, and frequency upfront.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | Full landing page — 14 sections |
| `style.css` | Mobile-first CSS with custom properties |
| `script.js` | FAQ accordion, mobile nav, form thank-you state |
| `README.md` | This file |

---

## Sections (in order)

1. Header — sticky nav with mobile hamburger
2. Hero — H1, subhead, above-fold CTA at 375px
3. Services — 6 service cards with icon placeholders
4. Service Area — coverage area notice
5. How It Works — 3 numbered steps
6. Pricing — intro + One-Time vs Recurring columns (dark background)
7. What Affects Your Quote — 4 factor cards with large numbers
8. Before & After — two side-by-side placeholder images
9. Trust Signals — 4-item dark band (Licensed, Fast Response, Clear Quotes, No Hidden Fees)
10. FAQ — 8-item accordion (JS-powered, no libraries)
11. Quote CTA — green centered section with CTA button
12. Quote Form — checkboxes, radio buttons, dropdown, textarea
13. Thank You State — shown on submit; form hidden, div revealed
14. Footer — disclaimer, nav links, credit

---

## Form Fields

- Full Name, Email, Phone, Address/Suburb
- Services Needed (6 checkboxes)
- Service Frequency (One-time / Recurring radio)
- Yard Size Estimate (dropdown: Small / Medium / Large / Not sure)
- Preferred Schedule (text)
- Additional Notes (textarea)
- Static note: "We may request photos once we receive your form."

---

## Technical Notes

- Static only — GitHub Pages compatible, no server-side code
- No external JS libraries — vanilla JS only
- Mobile-first — base at 375px, breakpoints at 480px, 600px, 640px, 768px, 900px+
- CSS custom properties — all colors in `:root`
- Accessible — semantic HTML5, labeled inputs, `aria-expanded` on accordion, `aria-live` on thank-you

---

## Target Client Profile

Lawn care operators, garden maintenance businesses, and home service providers in the US, Canada, UK, and Australia who want to collect structured quote requests directly from their website instead of through incomplete social media messages or phone calls.
