(function () {
  var PARAM_KEYS = ['page', 'q', 'topic', 'state', 'event_type', 'date'];

  function hasListingQuery(search) {
    if (!search || search.length < 2) return false;
    var params;
    try {
      params = new URLSearchParams(search);
    } catch (e) {
      return false;
    }
    for (var i = 0; i < PARAM_KEYS.length; i++) {
      if (params.has(PARAM_KEYS[i])) return true;
    }
    return false;
  }

  function applyScroll() {
    if (!hasListingQuery(window.location.search)) return;
    var section = document.querySelector('section[data-sw-events-hubdb-listing="true"]');
    if (!section) return;
    var target = section.querySelector('.sw-events-hubdb__heading') || section;
    target.scrollIntoView({ block: 'start', behavior: 'auto' });
  }

  function runOnceAfterLayoutStable() {
    try {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
    } catch (e) {}
    requestAnimationFrame(function () {
      requestAnimationFrame(applyScroll);
    });
  }

  if (!hasListingQuery(window.location.search)) return;

  if (document.readyState === 'complete') {
    runOnceAfterLayoutStable();
  } else {
    window.addEventListener('load', runOnceAfterLayoutStable, { once: true });
  }
})();
