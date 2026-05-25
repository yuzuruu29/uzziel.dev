# Claude Handoff: Portfolio Samples QA Results

Scope reviewed: `C:\Portfolio\portfolio-samples`

Files reviewed:
- `portfolio-samples/index.html`
- `portfolio-samples/clearpath/index.html`
- `portfolio-samples/clearpath/style.css`
- `portfolio-samples/clearpath/script.js`
- `portfolio-samples/willow-creek/index.html`
- `portfolio-samples/willow-creek/style.css`
- `portfolio-samples/willow-creek/script.js`
- `portfolio-samples/harvest-table/index.html`
- `portfolio-samples/harvest-table/style.css`
- `portfolio-samples/harvest-table/script.js`

## Key Findings

### Mobile QA

- NEEDS REVIEW: Actual 375px rendered browser pass for horizontal scroll, above-fold CTA, and desktop alignment was not completed.
- PASS: Mobile nav logic is structurally correct.
- PASS: Images/placeholders use containment patterns such as `max-width: 100%` and no obvious absolute asset overflow was found.
- PASS: Form fields are styled full-width and should be usable without zooming.
- FAIL: Multiple text areas use font sizes below `1rem`.
- FAIL: Hamburger touch target is likely under `44x44px`.
- FAIL: Footer disclaimer is present but too low-contrast and too small.

### Desktop QA

- PASS: Multi-column layouts are defined with responsive media queries.
- PASS: Max-width containers are applied.
- NEEDS REVIEW: Rendered 1024px check still needed for visual stretching/misalignment.

### Code Quality

- PASS: No external JS libraries loaded.
- PASS: Input controls have labels via `label for`, wrapping labels, or `fieldset`/`legend`.
- PASS: Heading hierarchy is mostly correct: one `h1`, section `h2`, subsection `h3`.
- PASS: No missing non-empty `alt` issues found because the reviewed pages do not use `<img>` elements.
- FAIL: `portfolio-samples/index.html` uses inline CSS instead of an external stylesheet with shared `:root` custom properties.

## JavaScript Debug Findings

The FAQ accordion and mobile nav logic are mostly correct:

- FAQ: click question opens answer, click again closes, `hidden` and `aria-expanded` stay in sync.
- Mobile nav: hamburger toggles `.is-open`, nav opens/closes, outside click closes nav.

### JS Compatibility Risk

`NodeList.forEach` is used in all three sample scripts. This can fail on older iOS Safari and stop event listeners from attaching.

Broken pattern:

```js
nav.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    closeNav();
  });
});

accordionItems.forEach(function (item) {
  var question = item.querySelector('.accordion-question');
  var answer   = item.querySelector('.accordion-answer');
});
```

Corrected pattern:

```js
Array.prototype.forEach.call(nav.querySelectorAll('a'), function (link) {
  link.addEventListener('click', function () {
    closeNav();
  });
});

Array.prototype.forEach.call(accordionItems, function (item) {
  var question = item.querySelector('.accordion-question');
  var answer   = item.querySelector('.accordion-answer');

  if (!question || !answer) return;

  question.addEventListener('click', function () {
    var isOpen = !answer.hidden;

    if (isOpen) {
      answer.hidden = true;
      question.setAttribute('aria-expanded', 'false');
    } else {
      answer.hidden = false;
      question.setAttribute('aria-expanded', 'true');
    }
  });
});
```

Apply this fix to:
- `portfolio-samples/clearpath/script.js`
- `portfolio-samples/willow-creek/script.js`
- `portfolio-samples/harvest-table/script.js`

## Targeted Fixes To Apply

### 1. Enforce HTML Form Validation

Current form submit handlers prevent default submission and show the thank-you state even when required fields are empty.

Replace submit handler body with:

```js
form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  form.hidden = true;
  thankYou.hidden = false;
  thankYou.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
```

Also remove `novalidate` from:
- `portfolio-samples/clearpath/index.html`
- `portfolio-samples/willow-creek/index.html`
- `portfolio-samples/harvest-table/index.html`

### 2. Add Required Attribute To Required Radio Groups

The visible `*` marks these groups as required, but no radio input has the `required` attribute.

Add `required` to one radio input in each required group:

```html
<input type="radio" name="frequency" value="one-time" required>
```

Groups:
- `clearpath`: `frequency`
- `harvest-table`: `order-type`
- `harvest-table`: `fulfillment`

### 3. Add FAQ Button-To-Panel Relationships

Current FAQ buttons do not declare the controlled panel.

Use unique IDs per FAQ item:

```html
<button class="accordion-question" aria-expanded="false" aria-controls="faq-quote">
  How do I get a quote?
  <span class="accordion-arrow" aria-hidden="true"></span>
</button>
<div class="accordion-answer" id="faq-quote" hidden>
```

Apply across all FAQ items in all three sample pages.

### 4. Fix Footer Disclaimer Readability

Current:

```css
.footer-disclaimer {
  font-size: 0.8125rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.45);
}
```

Corrected:

```css
.footer-disclaimer {
  font-size: 1rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.72);
}
```

Apply to all three sample CSS files.

### 5. Fix Hamburger Touch Target

Current hamburger relies on padding and does not guarantee a `44x44px` target.

Corrected:

```css
.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  border-radius: 4px;
}
```

Apply to all three sample CSS files.

### 6. Raise Sub-16px Body/UI Text

Several content/UI text rules are below `1rem`, including accordion, footer, helper, nav, and some card/body text.

Recommended targeted override:

```css
.accordion-question,
.accordion-answer,
.site-nav a,
.footer-nav a,
.footer-disclaimer,
.footer-credit,
.form-note,
label,
legend {
  font-size: 1rem;
}
```

Check whether this affects layout at 375px after applying.

### 7. Move Portfolio Index Inline CSS

`portfolio-samples/index.html` uses inline `<style>`.

Move the styles into:

```text
portfolio-samples/style.css
```

Then replace the inline style block with:

```html
<link rel="stylesheet" href="style.css">
```

Add custom properties at the top of the new CSS:

```css
:root {
  --color-bg: #F7F6F3;
  --color-text: #1A1917;
  --color-surface: #fff;
  --color-border: #E5E2DC;
  --container-max: 1060px;
}
```

## Final Verification Needed

After fixes, run a real rendered browser pass:

- 375px width:
  - no horizontal scroll
  - CTA visible above fold
  - nav opens/closes and outside click closes
  - form controls usable without zoom
  - footer readable and not clipped

- 1024px width:
  - intended multi-column layouts appear
  - no stretched content
  - max-width containers hold alignment

