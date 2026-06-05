// ===============================
// Smithworks' SW Simple Footer module.js
// SW Category: Global
// Master version number: 2026.02.27.13.16
// Changelog: ../CHANGELOG.md
// ===============================

(function() {
  'use strict';

  var SCROLL_THRESHOLD_OFF = 20;   /* hide when within 20px of top */

  function initBackToTop() {
    var buttons = document.querySelectorAll('.sw-simple-footer__back-to-top');
    if (buttons.length === 0) return;

    function getThresholdOn() {
      return 600; /* show after 600px scroll */
    }

    function updateVisibility() {
      var top = window.pageYOffset || document.documentElement.scrollTop;
      var thresholdOn = getThresholdOn();
      var show = top > thresholdOn;
      var hide = top <= SCROLL_THRESHOLD_OFF;

      for (var i = 0; i < buttons.length; i++) {
        var btn = buttons[i];
        if (show && !hide) {
          btn.classList.add('is-visible');
        } else {
          btn.classList.remove('is-visible');
        }
      }
    }

    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', scrollToTop);
    }

    window.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility(); /* initial state */
  }

  function runEmbedLogic() {
    var oembedContainers = document.querySelectorAll('.sw-simple-footer--has-bg-video .oembed_container');
    var embedContainers = document.querySelectorAll('.sw-simple-footer--has-bg-video .embed_container');

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
          } catch (e) {}
        }
      };
      request.send();
    }

    for (var i = 0; i < oembedContainers.length; i++) {
      loadOEmbed(oembedContainers[i]);
    }
  }

  function init() {
    runEmbedLogic();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
