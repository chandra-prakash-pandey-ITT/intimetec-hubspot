(function () {
  var root = document.getElementById('sw-event-register');
  if (!root) return;
  var eventId = root.getAttribute('data-event-id') || '';
  var eventName = root.getAttribute('data-event-name') || '';
  var formGuid = (root.getAttribute('data-form-guid') || '').toLowerCase();

  window.addEventListener('message', function (event) {
    var data = event.data;
    if (!data || data.type !== 'hsFormCallback' || data.eventName !== 'onFormReady') return;
    var payload = data.data || {};
    var gd = (payload.formGuid || '').toString().toLowerCase();
    if (formGuid && gd && gd !== formGuid) return;
    var fi = payload.formInstance;
    if (!fi || typeof fi.setFieldValue !== 'function') return;
    try {
      fi.setFieldValue('event_hubdb_row_id', eventId);
      fi.setFieldValue('event_name', eventName);
    } catch (e) {}
  });
})();
