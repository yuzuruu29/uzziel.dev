/* Harvest Table Kitchen: navigation, FAQ, form state, and image reveal. */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var hamburger = document.getElementById('hamburger');
  var nav = document.getElementById('site-nav');

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

    document.addEventListener('click', function (e) {
      if (
        hamburger.classList.contains('is-open') &&
        !hamburger.contains(e.target) &&
        !nav.contains(e.target)
      ) {
        closeNav();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && hamburger.classList.contains('is-open')) {
        closeNav();
        hamburger.focus();
      }
    });

    Array.prototype.forEach.call(nav.querySelectorAll('a'), function (link) {
      link.addEventListener('click', closeNav);
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('.accordion-item'), function (item, index) {
    var question = item.querySelector('.accordion-question');
    var answer = item.querySelector('.accordion-answer');

    if (!question || !answer) return;

    var questionId = question.id || 'faq-question-' + (index + 1);
    var answerId = answer.id || 'faq-answer-' + (index + 1);

    question.id = questionId;
    question.setAttribute('aria-controls', answerId);
    answer.id = answerId;
    answer.setAttribute('role', 'region');
    answer.setAttribute('aria-labelledby', questionId);

    question.addEventListener('click', function () {
      var isOpen = !answer.hidden;
      answer.hidden = isOpen;
      question.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
  });

  var form = document.getElementById('inquiry-form');
  var thankYou = document.getElementById('thank-you');

  if (form && thankYou) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      form.hidden = true;
      thankYou.hidden = false;
      thankYou.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'center'
      });
    });
  }

  var wraps = document.querySelectorAll('.reveal-wrap');
  if (!wraps.length) return;

  function revealImmediately() {
    Array.prototype.forEach.call(wraps, function (wrap) {
      wrap.classList.add('is-revealed', 'is-done');
    });
  }

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealImmediately();
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      var el = entry.target;
      var siblings = Array.prototype.slice.call(
        el.parentElement.querySelectorAll('.reveal-wrap')
      );
      var parsedDelay = parseInt(el.dataset.revealDelay, 10);
      var delay = Number.isFinite(parsedDelay)
        ? parsedDelay
        : (siblings.indexOf(el) % 4) * 120;

      window.setTimeout(function () {
        el.classList.add('is-revealed');
        var curtain = el.querySelector('.reveal-curtain');
        if (curtain) {
          curtain.addEventListener('animationend', function () {
            el.classList.add('is-done');
          }, { once: true });
        } else {
          el.classList.add('is-done');
        }
      }, delay);

      observer.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  Array.prototype.forEach.call(wraps, function (wrap) {
    observer.observe(wrap);
  });
}());
