(function () {
  'use strict';
  /* SW Simple Header module.js - SW Category: Global - Master version number: 2026.02.27.10.44 - Changelog: ../CHANGELOG.md */

  var header = document.querySelector('.sw-simple-header');
  if (!header) return;

  /* Sticky: reserve body padding so content doesn't sit under fixed header; clear when static */
  function setStickySpacer() {
    if (header.classList.contains('sw-simple-header--sticky')) {
      document.body.style.paddingTop = header.offsetHeight + 'px';
    } else {
      document.body.style.paddingTop = '';
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setStickySpacer);
  } else {
    setStickySpacer();
  }
  window.addEventListener('resize', setStickySpacer);
  window.addEventListener('resize', syncDrawerHeaderHeight);

  /* Sticky: add class when scrolled so we can show bottom shadow */
  var scrollThreshold = 10;
  function updateStickyScrolled() {
    if (!header.classList.contains('sw-simple-header--sticky')) return;
    if (window.scrollY > scrollThreshold) {
      header.classList.add('sw-simple-header--scrolled');
    } else {
      header.classList.remove('sw-simple-header--scrolled');
    }
  }
  window.addEventListener('scroll', updateStickyScrolled, { passive: true });
  updateStickyScrolled();

  var openBtn = header.querySelector('.sw-simple-header__toggle--open');
  var drawer = header.querySelector('.sw-simple-header__drawer');
  var closeBtns = header.querySelectorAll('.sw-simple-header__toggle--close, [data-sw-close-drawer]');

  var inner = header.querySelector('.sw-simple-header__inner');
  var resizeObserver = null;

  function syncDrawerHeaderHeight() {
    if (!inner || !drawer || drawer.getAttribute('aria-hidden') !== 'false') return;
    /* Use exact subpixel height so drawer row matches closed header (avoids 0.1px → 1px visual drop) */
    var h = inner.getBoundingClientRect().height;
    inner.style.height = h + 'px';
    header.style.setProperty('--sw-simple-header-row-height', h + 'px');
  }

  function clearDrawerHeaderHeight() {
    if (inner) inner.style.height = '';
    header.style.removeProperty('--sw-simple-header-row-height');
  }

  function startObservingHeaderHeight() {
    if (!inner || !window.ResizeObserver) return;
    resizeObserver = new ResizeObserver(function () {
      syncDrawerHeaderHeight();
    });
    resizeObserver.observe(inner);
  }

  function stopObservingHeaderHeight() {
    if (resizeObserver && inner) {
      resizeObserver.unobserve(inner);
      resizeObserver = null;
    }
  }

  function openDrawer() {
    if (!drawer) return;
    drawer.removeAttribute('hidden');
    drawer.setAttribute('aria-hidden', 'false');
    if (openBtn) {
      openBtn.setAttribute('aria-expanded', 'true');
      openBtn.setAttribute('hidden', '');
    }
    closeBtns.forEach(function (btn) {
      btn.removeAttribute('hidden');
      btn.setAttribute('aria-expanded', 'true');
    });
    document.body.classList.add('sw-simple-header-nav-open');
    /* Defer height sync to next frame so layout is stable (scrollbar/overflow applied) */
    requestAnimationFrame(function () { requestAnimationFrame(syncDrawerHeaderHeight); });
    /* Re-sync when header row changes (e.g. different logo/favicon, late-loading images) */
    startObservingHeaderHeight();
  }

  function closeDrawer() {
    if (!drawer) return;
    stopObservingHeaderHeight();
    drawer.setAttribute('hidden', '');
    drawer.setAttribute('aria-hidden', 'true');
    clearDrawerHeaderHeight();
    if (openBtn) {
      openBtn.setAttribute('aria-expanded', 'false');
      openBtn.removeAttribute('hidden');
    }
    closeBtns.forEach(function (btn) {
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('hidden', '');
    });
    document.body.classList.remove('sw-simple-header-nav-open');
  }

  if (openBtn) {
    openBtn.addEventListener('click', openDrawer);
  }
  closeBtns.forEach(function (btn) {
    btn.addEventListener('click', closeDrawer);
  });

  /* Close on Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.getAttribute('aria-hidden') === 'false') {
      closeDrawer();
    }
  });

  /* Close when clicking a drawer link (not the dropdown toggle) */
  if (drawer) {
    drawer.addEventListener('click', function (e) {
      if (e.target.matches('a.sw-simple-header__menu-link') || e.target.closest('.cta-button')) {
        closeDrawer();
      }
    });
  }

  /* Mobile: toggle submenus (dropdown levels) in the drawer */
  header.querySelectorAll('.sw-simple-header__menu-link--toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      var item = toggle.closest('.sw-simple-header__menu-item');
      if (!item) return;
      var isOpen = item.classList.toggle('sw-simple-header__menu-item--open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  /* Announcement bar: user-defined height, no calculation. Start closed, show after delay or keep closed per localStorage */
  var annWrapper = header.querySelector('.sw-site-topper__announcement-wrapper');
  if (annWrapper) {
    var annStorageKey = annWrapper.getAttribute('data-storage-key') || 'sw_site_topper_announcement_expiry';
    var annDelaySec = parseInt(annWrapper.getAttribute('data-delay-seconds'), 10) || 1;
    var annHideHours = parseInt(annWrapper.getAttribute('data-hide-hours'), 10) || 0;
    var annHideMinutes = parseInt(annWrapper.getAttribute('data-hide-minutes'), 10) || 30;
    var annHeight = parseInt(getComputedStyle(annWrapper).getPropertyValue('--sw-site-topper-announcement-height') || '80', 10);

    function annIsClosed() {
      return annWrapper.classList.contains('sw-site-topper__announcement-wrapper--closed');
    }

    function annIsWithinHideDuration() {
      try {
        var expiry = localStorage.getItem(annStorageKey);
        if (!expiry) return false;
        return Date.now() < parseInt(expiry, 10);
      } catch (e) {
        return false;
      }
    }

    var annTotal = annHeight + 10;
    function annSetStickySpacerForAnnouncement(isVisible) {
      if (!header.classList.contains('sw-simple-header--sticky')) return;
      var h = header.offsetHeight;
      document.body.style.paddingTop = (isVisible ? h + annTotal : h - annTotal) + 'px';
    }

    function annShowBar() {
      /* Set padding before removing closed so content gets space; header.offsetHeight is closed state */
      annSetStickySpacerForAnnouncement(true);
      annWrapper.classList.remove('sw-site-topper__announcement-wrapper--closed');
    }

    function annHideBar() {
      try {
        var expiryMs = (annHideHours * 3600 + annHideMinutes * 60) * 1000;
        localStorage.setItem(annStorageKey, String(Date.now() + expiryMs));
      } catch (e) {}
      /* Set padding before adding closed so we read open height; closed height = open - annTotal */
      var openHeight = header.offsetHeight;
      if (header.classList.contains('sw-simple-header--sticky')) {
        document.body.style.paddingTop = (openHeight - annTotal) + 'px';
      }
      annWrapper.classList.add('sw-site-topper__announcement-wrapper--closed');
    }

    var annCloseBtn = annWrapper.querySelector('.sw-site-topper__announcement-close');
    if (annCloseBtn) annCloseBtn.addEventListener('click', annHideBar);

    if (annIsWithinHideDuration()) {
      /* Leave closed, spacer already set */
    } else {
      setTimeout(function () {
        if (!annIsWithinHideDuration()) annShowBar();
      }, annDelaySec * 1000);
    }
  }
})();
