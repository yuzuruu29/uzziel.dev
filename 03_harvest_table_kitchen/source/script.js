/* ============================================================
   HARVEST TABLE KITCHEN — script.js
   FAQ accordion + mobile nav + form thank-you state.
   No external JS libraries.
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     MOBILE NAV
     ============================================================ */
  var hamburger = document.getElementById('hamburger');
  var nav       = document.getElementById('site-nav');

  function openNav() {
    hamburger.classList.add('is-open');
    nav.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    hamburger.classList.remove('is-open');
    nav.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      if (hamburger.classList.contains('is-open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    /* Close when clicking outside the header */
    document.addEventListener('click', function (e) {
      if (
        hamburger.classList.contains('is-open') &&
        !hamburger.contains(e.target) &&
        !nav.contains(e.target)
      ) {
        closeNav();
      }
    });

    /* Close when a nav link is clicked */
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeNav();
      });
    });
  }

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  var accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(function (item) {
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

  /* ============================================================
     INQUIRY FORM — THANK YOU STATE
     ============================================================ */
  var form     = document.getElementById('inquiry-form');
  var thankYou = document.getElementById('thank-you');

  if (form && thankYou) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.hidden     = true;
      thankYou.hidden = false;
      thankYou.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

})();
