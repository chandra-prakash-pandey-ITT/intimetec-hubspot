// ===============================
// Smithworks' SW Cards module.js
// SW Category: Sections
// Master version number: 2026.02.19.15.02
// Changelog: ../CHANGELOG.md
// ===============================

(function() {
  'use strict';
  
  // oEmbed functionality for external video embeds
  const oembedContainers = document.getElementsByClassName('oembed_container');
  const embedContainers = document.getElementsByClassName('embed_container');

  function loadOEmbed(container) {
    const embedContainer = container;
    const iframeWrapper = embedContainer.querySelector('.iframe_wrapper');
    const customThumbnail = embedContainer.querySelector('.oembed_custom-thumbnail');
    const url = iframeWrapper ? iframeWrapper.dataset.embedUrl : null;

    if (url) {
      var request = new XMLHttpRequest();
      var requestUrl = '/_hcms/oembed?url=' + url + '&autoplay=0';

      request.open('GET', requestUrl, true);
      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          var data = JSON.parse(request.responseText);

          const maxHeight =
            iframeWrapper.dataset.maxHeight !== undefined &&
            !iframeWrapper.dataset.maxHeight
              ? data.height
              : iframeWrapper.dataset.maxHeight;
          const maxWidth =
            iframeWrapper.dataset.maxWidth !== undefined && !iframeWrapper.dataset.maxWidth
              ? data.width
              : iframeWrapper.dataset.maxWidth;
          const height =
            iframeWrapper.dataset.height !== undefined && !iframeWrapper.dataset.height
              ? data.height
              : iframeWrapper.dataset.height;
          const width =
            iframeWrapper.dataset.width !== undefined && !iframeWrapper.dataset.width
              ? data.width
              : iframeWrapper.dataset.width;

          const el = document.createElement('div');
          el.innerHTML = data.html;
          const iframe = el.firstChild;
          iframe.setAttribute('class', 'oembed_container_iframe');
          iframe.setAttribute('title', data.title);

          if (customThumbnail) {
            customThumbnail.onclick = function () {
              const iframeSrc = new URL(iframe.src);
              iframeSrc.searchParams.append('autoplay', 1);
              iframe.src = iframeSrc.toString();
              this.setAttribute('class', 'oembed_custom-thumbnail--hide');
              iframeWrapper.appendChild(iframe);
            };
          } else {
            iframeWrapper.appendChild(iframe);
          }

          if (maxHeight) {
            const maxHeightStr = maxHeight.toString(10) + 'px';
            embedContainer.style.maxHeight = maxHeightStr;
            iframe.style.maxHeight = maxHeightStr;
            if (customThumbnail) {
              customThumbnail.style.maxHeight = maxHeightStr;
            }
          }

          if (maxWidth) {
            const maxWidthStr = maxWidth.toString(10) + 'px';
            embedContainer.style.maxWidth = maxWidthStr;
            iframe.style.maxWidth = maxWidthStr;
            if (customThumbnail) {
              customThumbnail.style.maxWidth = maxWidthStr;
            }
          }

          if (height) {
            const heightStr = height.toString(10) + 'px';
            embedContainer.style.height = heightStr;
            iframe.style.height = heightStr;
            if (customThumbnail) {
              customThumbnail.style.height = heightStr;
            }
          }

          if (width) {
            const widthStr = width.toString(10) + 'px';
            embedContainer.style.width = widthStr;
            iframe.style.width = widthStr;
            if (customThumbnail) {
              customThumbnail.style.width = widthStr;
            }
          }
        } else {
          console.error('Server reached, error retrieving results.');
        }
      };
      request.onerror = function () {
        console.error('Could not reach the server.');
      };
      request.send();
    }
  }

  function loadEmbed(container) {
    const embedContainer = container;
    const iframe = embedContainer.querySelector('.iframe_wrapper iframe');

    if (!iframe) return;

    // Inside SW Cards: let CSS (iframe_wrapper padding-bottom 56.25%, iframe absolute fill) make embed responsive so it fills the card
    if (embedContainer.closest('.sw-cards')) {
      embedContainer.style.width = '100%';
      embedContainer.style.maxWidth = '100%';
      embedContainer.style.maxHeight = '';
      return;
    }

    const maxHeight = iframe.getAttribute('height');
    const maxWidth = iframe.getAttribute('width');

    if (maxHeight !== null) {
      const heightStr = maxHeight.toString(10) + 'px';
      embedContainer.style.maxHeight = heightStr;
    } else {
      iframe.style.height = '100%';
    }

    if (maxWidth !== null) {
      const widthStr = maxWidth.toString(10) + 'px';
      embedContainer.style.maxWidth = widthStr;
    } else {
      iframe.style.width = '100%';
    }
  }

  if (oembedContainers.length !== 0) {
    Array.prototype.forEach.call(oembedContainers, function (el) {
      loadOEmbed(el);
    });
  }

  if (embedContainers.length !== 0) {
    Array.prototype.forEach.call(embedContainers, function (el) {
      loadEmbed(el);
    });
  }

  function startSlideBounce(sliderEl) {
    if (sliderEl.dataset.autoplay === 'true' || sliderEl.dataset.bounce !== 'true') return;
    var track = sliderEl.querySelector('.blaze-track');
    var container = sliderEl.querySelector('.blaze-track-container');
    if (!container || !track || track.children.length <= 1) return;
    var intervalSec = parseInt(sliderEl.dataset.bounceInterval, 10) || 5;
    var intervalMs = intervalSec * 1000;
    setInterval(function () {
      container.classList.add('sw-cards__bounce');
      setTimeout(function () {
        container.classList.remove('sw-cards__bounce');
      }, 500);
    }, intervalMs);
  }

  // Blaze slider init when SW Cards uses slider mode (or continuous scroll marquee)
  document.addEventListener('DOMContentLoaded', function () {
    const blazeSliders = document.querySelectorAll('.sw-cards .blaze-slider');
    blazeSliders.forEach(function (el) {
      const continuousScroll = el.dataset.continuousScroll === 'true';
      const track = el.querySelector('.blaze-track');

      if (continuousScroll && track && track.children.length > 0) {
        // Continuous scroll: clone slides for seamless marquee, don't init Blaze
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < track.children.length; i++) {
          fragment.appendChild(track.children[i].cloneNode(true));
        }
        track.appendChild(fragment);
        return;
      }

      const slidesToShowXL = parseInt(el.dataset.stsXl, 10) || 1;
      const slidesToShowLG = parseInt(el.dataset.stsLg, 10) || slidesToShowXL;
      const slidesToShowMD = parseInt(el.dataset.stsMd, 10) || slidesToShowLG;
      const slidesToShowSM = parseInt(el.dataset.stsSm, 10) || 1;
      const slideGap = (el.dataset.slideGap && el.dataset.slideGap !== '') ? (el.dataset.slideGap + 'px') : '30px';
      const autoplayIntervalMs = (parseInt(el.dataset.autoplayspeed, 10) || 5) * 1000;
      const smoothScroll = el.dataset.smoothScroll === 'true';
      const transitionDuration = smoothScroll ? autoplayIntervalMs : 300;
      if (typeof BlazeSlider !== 'undefined') {
        new BlazeSlider(el, {
          all: {
            draggable: true,
            enableAutoplay: el.dataset.autoplay === 'true',
            autoplayInterval: autoplayIntervalMs,
            slideGap: slideGap,
            transitionDuration: transitionDuration,
            slidesToShow: slidesToShowXL
          },
          '(max-width: 1199px)': { slidesToShow: slidesToShowLG },
          '(max-width: 991px)': { slidesToShow: slidesToShowMD },
          '(max-width: 767px)': { slidesToShow: slidesToShowSM }
        });
        startSlideBounce(el);
      }
    });

    // Video modal: open on trigger, move content into slot; close on button/overlay, move back and pause
    const videoModalTriggers = document.querySelectorAll('.sw-cards [data-video-open-modal]');
    videoModalTriggers.forEach(function (trigger) {
      const targetId = trigger.getAttribute('data-target');
      const contentId = trigger.getAttribute('data-video-content-id');
      if (!targetId || !contentId) return;
      const modal = document.querySelector(targetId);
      const sourceEl = document.getElementById(contentId);
      if (!modal || !sourceEl) return;
      const slot = modal.querySelector('.sw-cards-video-modal-slot');
      const closeBtn = modal.querySelector('.sw-cards-video-modal-close');
      if (!slot) return;

      function openModal() {
        while (sourceEl.firstChild) {
          slot.appendChild(sourceEl.firstChild);
        }
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        var v = slot.querySelector('video');
        if (v) {
          v.play().catch(function () {});
        }
        var oembed = slot.querySelector('.oembed_container');
        if (oembed && typeof loadOEmbed === 'function') {
          loadOEmbed(oembed);
        } else if (oembed && slot.querySelector('.iframe_wrapper') && !slot.querySelector('.iframe_wrapper iframe')) {
          loadOEmbed(oembed);
        }
      }
      function closeModal() {
        var v = slot.querySelector('video');
        if (v) {
          v.pause();
          v.currentTime = 0;
        }
        while (slot.firstChild) {
          sourceEl.appendChild(slot.firstChild);
        }
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
      }

      trigger.addEventListener('click', openModal);
      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal();
        }
      });
      if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
        closeBtn.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            closeModal();
          }
        });
      }
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
      });
    });
  });

})();


