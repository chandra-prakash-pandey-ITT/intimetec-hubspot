/**
 * Smithworks' SW Popup Panel module.js
 * SW Category: Client Action
 * Master version number: 2026.03.24.16.17
 *
 * Phase 5: Thumbnail layout (Top/Left/Right), thumbnail width, narrow-panel stacking.
 */

(function () {
  'use strict';

  var STORAGE_PREFIX = 'sw-popup-panel-';
  var SESSION_SHOWN_KEY = 'sw-popup-panel-shown';

  function sanitizeBodyClass(val) {
    if (!val || typeof val !== 'string') return '';
    return val.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9_-]/g, '');
  }

  function getBodyClasses() {
    var cls = document.body && document.body.className;
    if (!cls || typeof cls !== 'string') return [];
    return cls.trim().split(/\s+/).filter(Boolean);
  }

  function getActiveVariantIndex(panel) {
    var bodyClasses = getBodyClasses();
    var hasHideClass = bodyClasses.indexOf('cta-popup-hide') !== -1;
    var firstItemAnnouncement = panel.getAttribute('data-first-item-announcement') === 'true';
    var defaultBehavior = panel.getAttribute('data-default-behavior') || 'show_first';
    var variants = panel.querySelectorAll('.sw-popup-panel__variant');
    var i;

    if (!variants.length) return -1;

    if (firstItemAnnouncement) {
      for (i = 0; i < variants.length; i++) {
        if (variants[i].getAttribute('data-enabled') === 'true') return i;
      }
      return -1;
    }

    if (hasHideClass) return -1;

    for (i = 0; i < variants.length; i++) {
      if (variants[i].getAttribute('data-enabled') !== 'true') continue;
      var variantClass = variants[i].getAttribute('data-body-class');
      if (variantClass && bodyClasses.indexOf(variantClass) !== -1) return i;
    }

    if (defaultBehavior === 'show_first') {
      for (i = 0; i < variants.length; i++) {
        if (variants[i].getAttribute('data-enabled') === 'true') return i;
      }
    }
    return -1;
  }

  function shouldShowBySession(panel, variant) {
    var oncePerSession = variant.getAttribute('data-once-per-session') === 'true';
    var suppressionDays = parseInt(variant.getAttribute('data-suppression-days')) || 0;
    var uid = panel.getAttribute('data-uid') || panel.id || 'default';
    var storageKey = STORAGE_PREFIX + uid;

    if (oncePerSession) {
      try {
        var shown = sessionStorage.getItem(SESSION_SHOWN_KEY);
        if (shown) return false;
      } catch (e) {}
    }

    if (suppressionDays > 0) {
      try {
        var dismissed = localStorage.getItem(storageKey);
        if (dismissed) {
          var ts = parseInt(dismissed, 10);
          var daysSince = (Date.now() - ts) / (24 * 60 * 60 * 1000);
          if (daysSince < suppressionDays) return false;
        }
      } catch (e) {}
    }

    return true;
  }

  function markShown(panel) {
    try {
      sessionStorage.setItem(SESSION_SHOWN_KEY, '1');
    } catch (e) {}
  }

  function markDismissed(panel) {
    var uid = panel.getAttribute('data-uid') || panel.id || 'default';
    try {
      localStorage.setItem(STORAGE_PREFIX + uid, String(Date.now()));
    } catch (e) {}
  }

  function anyTriggerEnabled(variant) {
    return variant.getAttribute('data-trigger-delay') === 'true' ||
      variant.getAttribute('data-trigger-scroll') === 'true' ||
      variant.getAttribute('data-trigger-exit') === 'true';
  }

  function waitForTrigger(panel, variant, callback) {
    var delayEnabled = variant.getAttribute('data-trigger-delay') === 'true';
    var delaySeconds = parseInt(variant.getAttribute('data-delay-seconds')) || 8;
    var scrollEnabled = variant.getAttribute('data-trigger-scroll') === 'true';
    var scrollPercent = parseInt(variant.getAttribute('data-scroll-percent')) || 50;
    var exitEnabled = variant.getAttribute('data-trigger-exit') === 'true';
    var fired = false;

    function fire() {
      if (fired) return;
      fired = true;
      callback();
    }

    if (delayEnabled) {
      setTimeout(fire, delaySeconds * 1000);
    }

    if (scrollEnabled) {
      var scrollHandler = function () {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        var pct = h > 0 ? (window.scrollY / h) * 100 : 0;
        if (pct >= scrollPercent) {
          fire();
          window.removeEventListener('scroll', scrollHandler);
        }
      };
      window.addEventListener('scroll', scrollHandler);
      scrollHandler();
    }

    if (exitEnabled) {
      document.addEventListener('mouseout', function (e) {
        if (e.clientY <= 0 && !fired) fire();
      });
    }

    if (!delayEnabled && !scrollEnabled && !exitEnabled) {
      fire();
    }
  }

  function setupPanel(panel) {
    var activeIndex = getActiveVariantIndex(panel);
    var variants = panel.querySelectorAll('.sw-popup-panel__variant');
    var i;

    variants.forEach(function (variant, idx) {
      if (activeIndex === idx) {
        variant.setAttribute('aria-hidden', 'false');
        variant.classList.add('sw-popup-panel__variant--active');
      } else {
        variant.setAttribute('aria-hidden', 'true');
        variant.classList.remove('sw-popup-panel__variant--active');
      }
    });

    if (activeIndex === -1) {
      panel.setAttribute('data-active-index', '-1');
      return;
    }

    panel.setAttribute('data-active-index', String(activeIndex));
    var activeVariant = variants[activeIndex];

    if (!shouldShowBySession(panel, activeVariant)) {
      panel.setAttribute('data-active-index', '-1');
      return;
    }

    waitForTrigger(panel, activeVariant, function () {
      if (!shouldShowBySession(panel, activeVariant)) return;
      panel.classList.add('sw-popup-panel--triggered');
      markShown(panel);

      var closeBtn = panel.querySelector('.sw-popup-panel__close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function () {
          panel.classList.remove('sw-popup-panel--triggered');
          markDismissed(panel);
        });
      }
    });
  }

  function init() {
    var panels = document.querySelectorAll('.sw-popup-panel[data-enabled="true"]');
    panels.forEach(setupPanel);
  }

  function setupCopyHints() {
    document.querySelectorAll('.sw-popup-panel__editor-hint-copy').forEach(function (el) {
      if (el.dataset.copySetup) return;
      el.dataset.copySetup = '1';
      el.addEventListener('click', function () {
        var val = el.getAttribute('data-copy');
        if (!val) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(val).then(function () {
            var orig = el.textContent;
            el.textContent = 'Copied!';
            setTimeout(function () { el.textContent = orig; }, 1200);
          }).catch(function () {});
        }
      });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init();
      setupCopyHints();
    });
  } else {
    init();
    setupCopyHints();
  }
})();
