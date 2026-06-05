// ===============================
// Smithworks' SW Pillar Section module.js
// SW Category: Sections
// Master version date: 2026.03.06
// Master version number: 2026.03.06.17.38
// Changelog: ../CHANGELOG.md
// ===============================

(function() {
  'use strict';
  
  // oEmbed functionality for external video embeds
  const oembedContainers = document.getElementsByClassName('oembed_container');
  const embedContainers = document.getElementsByClassName('embed_container');

  function loadOEmbed(container, autoplay) {
    const embedContainer = container;
    const iframeWrapper = embedContainer.querySelector('.iframe_wrapper');
    const customThumbnail = embedContainer.querySelector('.oembed_custom-thumbnail');
    const url = iframeWrapper ? (iframeWrapper.dataset.embedUrl || iframeWrapper.getAttribute('data-embed-url')) : null;
    const isBgVideo = embedContainer.closest('.sw-pillar__video-wrap');
    const useAutoplay = autoplay !== undefined ? autoplay : (isBgVideo ? 1 : 0);

    if (url) {
      var request = new XMLHttpRequest();
      var requestUrl = '/_hcms/oembed?url=' + encodeURIComponent(url) + '&autoplay=' + useAutoplay;

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
          if (!iframe || iframe.tagName !== 'IFRAME') return;
          iframe.setAttribute('class', 'oembed_container_iframe');
          if (data.title) iframe.setAttribute('title', data.title);

          if (isBgVideo) {
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
          } else if (customThumbnail) {
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

    if (iframe) {
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
  
})();
