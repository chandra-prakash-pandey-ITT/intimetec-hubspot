  (function() {
    function initScrollSpy() {
      if (typeof bootstrap !== 'undefined' && document.getElementById('privacy-policy-list')) {
        new bootstrap.ScrollSpy(document.body, { target: '#privacy-policy-list' });
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initScrollSpy);
    } else {
      initScrollSpy();
    }
  })();