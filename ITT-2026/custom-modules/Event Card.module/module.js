// ===============================
// Smithworks' SW Blog Cards module.js
// SW Category: Sections
// Master version date: 2026.02.10
// Master version number: 2026.02.27.09.46
// Changelog: ../CHANGELOG.md
// ===============================

(function() {
  'use strict';

  function runEmbedLogic() {
    var selectorRoot = '.event-cards--has-bg-video';
    var oembedContainers = document.querySelectorAll(selectorRoot + ' .oembed_container');
    var embedContainers = document.querySelectorAll(selectorRoot + ' .embed_container');

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

            iframe.classList.add('oembed_container_iframe');
            if (data.title) {
              iframe.setAttribute('title', data.title);
            }

            var src = iframe.getAttribute('src') || '';
            try {
              if (src.indexOf('youtube.com') !== -1 || src.indexOf('youtu.be') !== -1) {
                var sep = src.indexOf('?') !== -1 ? '&' : '?';
                if (src.indexOf('autoplay') === -1) { src += sep + 'autoplay=1'; sep = '&'; }
                if (src.indexOf('mute') === -1) { src += sep + 'mute=1'; }
                iframe.setAttribute('src', src);
              } else if (src.indexOf('vimeo.com') !== -1) {
                var sepV = src.indexOf('?') !== -1 ? '&' : '?';
                if (src.indexOf('autoplay') === -1) { src += sepV + 'autoplay=1'; sepV = '&'; }
                if (src.indexOf('muted') === -1) { src += sepV + 'muted=1'; }
                iframe.setAttribute('src', src);
              }
            } catch (e) {}

            iframeWrapper.appendChild(iframe);
          } catch (err) {
            console.error('SW Blog Cards oEmbed: parse error', err);
          }
        } else {
          console.error('SW Blog Cards oEmbed: server returned ' + request.status);
        }
      };
      request.onerror = function() {
        console.error('SW Blog Cards oEmbed: network error');
      };
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

  // Blaze slider init when SW Blog Cards uses slider mode
  function initBlazeSliders() {
    var blazeSliders = document.querySelectorAll('.event-cards .blaze-slider');
    if (blazeSliders.length === 0) return;

    function doInit() {
      if (typeof BlazeSlider === 'undefined') return false;
      blazeSliders.forEach(function(el) {
        if (el.dataset.blazeInit === 'true') return;
        var slidesToShowXL = parseInt(el.dataset.stsXl, 10) || 1;
        var slidesToShowLG = parseInt(el.dataset.stsLg, 10) || slidesToShowXL;
        var slidesToShowMD = parseInt(el.dataset.stsMd, 10) || slidesToShowLG;
        var slidesToShowSM = parseInt(el.dataset.stsSm, 10) || 1;
        var slideGap = (el.dataset.slideGap && el.dataset.slideGap !== '') ? (el.dataset.slideGap + 'px') : '30px';
        try {
          new BlazeSlider(el, {
            all: {
              draggable: true,
              enableAutoplay: el.dataset.autoplay === 'true',
              autoplayInterval: (parseInt(el.dataset.autoplayspeed, 10) || 5) * 1000,
              slideGap: slideGap,
              transitionDuration: 300,
              slidesToShow: slidesToShowXL
            },
            '(max-width: 1199px)': { slidesToShow: slidesToShowLG },
            '(max-width: 991px)': { slidesToShow: slidesToShowMD },
            '(max-width: 767px)': { slidesToShow: slidesToShowSM }
          });
          el.dataset.blazeInit = 'true';
          startSlideBounce(el);
        } catch (e) {
          console.warn('SW Blog Cards: BlazeSlider init error', e);
        }
      });
      return true;
    }

    if (!doInit()) {
      setTimeout(function() { doInit(); }, 100);
    }
  }

  // Infinite scroll: Intersection Observer (on_scroll) and Load more button handler
  function initInfiniteScroll() {
    var containers = document.querySelectorAll('.event-cards__infinite-scroll');
    if (containers.length === 0) return;

    containers.forEach(function(container) {
      var trigger = container.dataset.loadTrigger || '';
      var chunks = container.querySelectorAll('.event-cards__chunk');
      var loadMoreBtn = container.querySelector('.event-cards__load-more');
      var sentinel = container.querySelector('.event-cards__sentinel');

      function revealNextChunk() {
        var hidden = container.querySelectorAll('.event-cards__chunk--hidden');
        if (hidden.length > 0) {
          hidden[0].classList.remove('event-cards__chunk--hidden');
          if (hidden.length === 1 && loadMoreBtn) {
            loadMoreBtn.parentElement.style.display = 'none';
          }
        }
      }

      if (trigger === 'on_scroll' && sentinel && typeof IntersectionObserver !== 'undefined') {
        var observer = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) revealNextChunk();
          });
        }, { rootMargin: '100px', threshold: 0 });
        observer.observe(sentinel);
      } else if (trigger === 'load_more_button' && loadMoreBtn) {
        loadMoreBtn.addEventListener('click', revealNextChunk);
      }
    });
  }

  function startSlideBounce(sliderEl) {
    if (sliderEl.dataset.autoplay === 'true' || sliderEl.dataset.bounce !== 'true') return;
    var track = sliderEl.querySelector('.blaze-track');
    var container = sliderEl.querySelector('.blaze-track-container');
    if (!container || !track || track.children.length <= 1) return;
    var intervalSec = parseInt(sliderEl.dataset.bounceInterval, 10) || 5;
    var intervalMs = intervalSec * 1000;
    setInterval(function() {
      container.classList.add('event-cards__bounce');
      setTimeout(function() {
        container.classList.remove('event-cards__bounce');
      }, 500);
    }, intervalMs);
  }

  function runOnReady() {
    runEmbedLogic();
    initBlazeSliders();
    initInfiniteScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runOnReady);
  } else {
    runOnReady();
  }
})();
