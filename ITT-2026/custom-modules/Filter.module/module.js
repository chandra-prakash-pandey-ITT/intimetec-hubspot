document.addEventListener('DOMContentLoaded', function () {
  // Don't run redirect behavior inside HubSpot editor
  if (window.hsInEditor) return;

  // Scope to this module instance only
  var root = document.currentScript
    ? document.currentScript.closest('.hs_cos_wrapper')
    : document.querySelector('.filter-bar')?.closest('.hs_cos_wrapper');

  if (!root) return;

  var filterBar = root.querySelector('.filter-bar');
  if (!filterBar) return;

  var searchInput = filterBar.querySelector('[data-filter="search"]');
  var selects = filterBar.querySelectorAll('select[data-filter]');

  function applyServerFilters() {
    var url = new URL(window.location.href);
    var params = url.searchParams;

    // Reset page to 1 when filters change
    params.set('page', '1');

    // Text search
    if (searchInput && searchInput.value.trim() !== '') {
      params.set('q', searchInput.value.trim());
    } else {
      params.delete('q');
    }

    // Dropdown filters
    selects.forEach(function (sel) {
      var key = sel.getAttribute('data-filter');
      var value = sel.value;

      if (!key) return;

      if (value && value !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    url.search = params.toString();
    window.location.href = url.toString();
  }

  selects.forEach(function (sel) {
    sel.addEventListener('change', applyServerFilters);
  });

  if (searchInput) {
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyServerFilters();
      }
    });
  }
});