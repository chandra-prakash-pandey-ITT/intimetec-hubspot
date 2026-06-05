// ===============================
// Smithworks' SW Simple Hero module.js
// SW Category: Banners
// Master version number: 2026.03.03.23.47
// Changelog: ../CHANGELOG.md
// ===============================

(function() {
  'use strict';

  function runEmbedLogic() {
    var oembedContainers = document.querySelectorAll('.sw-hero--has-bg-video .oembed_container');
    var embedContainers = document.querySelectorAll('.sw-hero--has-bg-video .embed_container');

    function loadOEmbed(container) {
      var iframeWrapper = container.querySelector('.iframe_wrapper');
      if (!iframeWrapper) return;
      var url = (iframeWrapper.dataset && iframeWrapper.dataset.embedUrl) || iframeWrapper.getAttribute('data-embed-url');
      if (!url) return;

      var request = new XMLHttpRequest();
      var requestUrl = '/_hcms/oembed?url=' + encodeURIComponent(url) + '&autoplay=1';
      request.open('GET', requestUrl, true);
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          try {
            var data = JSON.parse(request.responseText);
            if (!data || !data.html) return;
            var el = document.createElement('div');
            el.innerHTML = data.html;
            var iframe = el.firstChild;
            if (!iframe || iframe.tagName !== 'IFRAME') return;
            if (iframeWrapper.querySelector('iframe')) return;
            iframe.setAttribute('class', 'oembed_container_iframe');
            if (data.title) iframe.setAttribute('title', data.title);
            var src = iframe.getAttribute('src') || '';
            try {
              if (src.indexOf('youtube.com') !== -1 || src.indexOf('youtu.be') !== -1) {
                var sep = src.indexOf('?') !== -1 ? '&' : '?';
                if (src.indexOf('autoplay') === -1) { src += sep + 'autoplay=1'; sep = '&'; }
                if (src.indexOf('mute') === -1) { src += sep + 'mute=1'; }
                iframe.setAttribute('src', src);
              } else if (src.indexOf('vimeo.com') !== -1) {
                sep = src.indexOf('?') !== -1 ? '&' : '?';
                if (src.indexOf('autoplay') === -1) { src += sep + 'autoplay=1'; sep = '&'; }
                if (src.indexOf('muted') === -1) { src += sep + 'muted=1'; }
                iframe.setAttribute('src', src);
              }
            } catch (e) {}
            iframeWrapper.appendChild(iframe);
          } catch (e) {
            console.error('SW Simple Hero oEmbed: parse error', e);
          }
        }
      };
      request.onerror = function() {};
      request.send();
    }

    function loadEmbed(container) {
      var iframe = container.querySelector('.iframe_wrapper iframe');
      if (iframe) {
        iframe.style.height = '100%';
        iframe.style.width = '100%';
      }
    }

    for (var i = 0; i < oembedContainers.length; i++) {
      loadOEmbed(oembedContainers[i]);
    }
    for (var j = 0; j < embedContainers.length; j++) {
      loadEmbed(embedContainers[j]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runEmbedLogic);
  } else {
    runEmbedLogic();
  }
})();
