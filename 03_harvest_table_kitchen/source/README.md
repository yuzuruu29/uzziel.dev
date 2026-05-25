# Harvest Table Kitchen — Concept Landing Page

> **Concept portfolio sample. Not a real client project.**

A mobile-first static landing page for a small food business preorder and catering inquiry flow. Demonstrates how a bakery, catering company, meal prep service, or food truck can replace scattered DMs, comments, and phone calls with one structured page and form.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | Full landing page — 13 sections |
| `style.css` | Mobile-first CSS with custom properties |
| `script.js` | FAQ accordion, mobile nav, form thank-you state |
| `README.md` | This file |

---

## Sections (in order)

1. Header — sticky nav with mobile hamburger
2. Hero — H1, subhead, above-fold CTA at 375px
3. Menu Highlights — 6 cards with category badges (Weekly Meals, Party Trays, Catering, Seasonal)
4. How to Preorder — 3 numbered steps
5. Catering — description + detail table (price, minimum, lead time, capacity)
6. Pickup & Delivery — two-column card layout
7. Lead Times & Cut-offs — info callout with left accent border
8. Dietary Information — info callout with left accent border
9. FAQ — 8-item accordion (JS-powered, no libraries)
10. Inquiry CTA — terracotta centered section with CTA
11. Inquiry Form — full order inquiry form
12. Thank You State — revealed on submit, form hidden
13. Footer — disclaimer, nav links, credit

---

## Form Fields

- Full Name, Email, Phone
- Requested Date
- Order Type (4 radio options: Weekly Meal / Party Tray / Catering / Other)
- Pickup or Delivery (2 radio options)
- Estimated Servings (dropdown: 1–5 / 6–15 / 16–30 / 30+)
- Items Interested In (textarea)
- Allergies / Dietary Notes (text)
- Budget Range (optional text)
- How Did You Hear About Us (select)
- Additional Notes (textarea)

---

## Technical Notes

- Static only — GitHub Pages compatible, no server-side code
- No external JS libraries — vanilla JS only
- Mobile-first — base at 375px, breakpoints at 480px, 600px, 640px, 768px, 900px+
- CSS custom properties — all colors in `:root`
- Accessible — semantic HTML5, labeled inputs, `aria-expanded` on accordion, `aria-live` on thank-you

---

## Target Client Profile

Bakeries, home cooks turned small businesses, meal prep services, caterers, and food trucks in the US, Canada, UK, and Australia who want to accept structured preorders and catering inquiries directly — without losing orders in social media DMs or relying on phone calls.
