document.addEventListener('DOMContentLoaded', function () {

  if (window.location.href.includes('hs_preview') || window.location.href.includes('hs_inline_edit')) return;

  var root = document.currentScript
    ? document.currentScript.closest('.hs_cos_wrapper')
    : document.querySelector('.filter-bar')?.closest('.hs_cos_wrapper');

  if (!root) return;

  var filterBar = root.querySelector('.filter-bar');
  if (!filterBar) return;

  var searchInput = filterBar.querySelector('[data-filter="search"]');
  var selects = filterBar.querySelectorAll('select[data-filter]');

  function applyServerFilters() {

    if (window.location.href.includes('hs_preview') || window.location.href.includes('hs_inline_edit')) return;

    var url = new URL(window.location.href);
    var params = url.searchParams;

    params.set('page', '1');

    if (searchInput && searchInput.value.trim() !== '') {
      params.set('q', searchInput.value.trim());
    } else {
      params.delete('q');
    }

    selects.forEach(function (sel) {
      var key = sel.getAttribute('data-filter');
      var value = sel.value;

      if (!key) return;

      if (value && value !== '' && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    url.search = params.toString();
    window.location.href = url.toString();
  }