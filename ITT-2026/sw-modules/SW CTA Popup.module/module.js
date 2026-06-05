/* ===============================
   Smithworks' SW CTA Popup module.js
   Master version date: 2026.01.15
   Master version number: 2026.01.15.00.00
   Changelog: ../CHANGELOG.md
 
   Optimizations:
   - Added resize handling for responsive behavior
   - Enhanced keyboard navigation (ESC key support)
   - Simplified breakpoint logic; module always available (no hide-on-mobile toggle)
   =============================== */

(function(){
  'use strict';
  
  function daysToMs(days){ return days * 24 * 60 * 60 * 1000; }
  function storageKey(uid){ return 'swSlidein:' + uid; }

  function isSuppressed(uid, days){
    if(!days || days <= 0) return false;
    try {
      var record = JSON.parse(localStorage.getItem(storageKey(uid)) || 'null');
      return record && Date.now() < record.until;
    } catch (err) {
      return false;
    }
  }

  function suppress(uid, days){
    if(!days || days <= 0) return;
    try {
      localStorage.setItem(storageKey(uid), JSON.stringify({ until: Date.now() + daysToMs(days) }));
    } catch (err) {
      /* ignore */
    }
  }

  function attrBool(el, attr){
    var val = el.getAttribute(attr);
    if(typeof val === 'string'){
      return val.toLowerCase() === 'true';
    }
    return !!val;
  }

  function open(el){
    if(!el.classList.contains('sw-open')){
      el.classList.add('sw-open');
      el.setAttribute('aria-modal', 'true');
      el.style.pointerEvents = 'auto';
    }
  }

  function close(el, uid, days){
    el.classList.remove('sw-open');
    el.setAttribute('aria-modal', 'false');
    el.style.pointerEvents = 'none';
    suppress(uid, days);
  }

  function setup(el){
    var uid          = el.getAttribute('data-uid') || 'default';
    var once         = attrBool(el, 'data-once');
    var supDays      = parseInt(el.getAttribute('data-suppress-days') || '0', 10) || 0;
    var delay        = Math.max(0, parseInt(el.getAttribute('data-delay') || '0', 10) || 0);
    var scrollPct    = Math.min(100, Math.max(0, parseInt(el.getAttribute('data-scroll') || '0', 10) || 0));
    var trigDelay    = attrBool(el, 'data-trigger-delay');
    var trigScroll   = attrBool(el, 'data-trigger-scroll');
    var trigExit     = attrBool(el, 'data-trigger-exit');

    if(isSuppressed(uid, supDays)) return;
    if(once && sessionStorage.getItem(storageKey(uid))) return;

    var opened = el.classList.contains('sw-open');
    function markOpened(){
      opened = true;
      sessionStorage.setItem(storageKey(uid), '1');
    }

    function detach(){
      if(delayTimer){ clearTimeout(delayTimer); delayTimer = null; }
      if(onScroll){ window.removeEventListener('scroll', onScroll); onScroll = null; }
      if(onExit){ document.removeEventListener('mouseleave', onExit); onExit = null; }
    }

    function tryOpen(){
      if(!opened){
        open(el);
        markOpened();
        detach();
      }
    }

    var delayTimer = null;
    var onScroll = null;
    var onExit = null;

    if(trigDelay){
      delayTimer = setTimeout(tryOpen, delay * 1000);
    }

    if(trigScroll){
      onScroll = function(){
        var scrolled = window.scrollY || window.pageYOffset || 0;
        var maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
        var percent = Math.round((scrolled / maxScroll) * 100);
        if(percent >= scrollPct) tryOpen();
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    if(trigExit){
      onExit = function(event){
        if(event.clientY <= 0) tryOpen();
      };
      document.addEventListener('mouseleave', onExit);
    }

    if(!trigDelay && !trigScroll && !trigExit){
      // No triggers enabled; display immediately
      tryOpen();
    }

    var closeBtn = el.querySelector('.sw-slidein__close');
    if(closeBtn){
      closeBtn.addEventListener('click', function(){
        close(el, uid, supDays);
      });
      el.addEventListener('keydown', function(evt){
        if(evt.key === 'Escape' && el.classList.contains('sw-open')){
          close(el, uid, supDays);
          closeBtn.focus();
        }
      });
    }

    document.addEventListener('swSlidein:open:' + uid, tryOpen);
  }

  function init(){
    document.querySelectorAll('.sw-slidein').forEach(setup);

    var resizeTimer;
    window.addEventListener('resize', function(){
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function(){
        document.querySelectorAll('.sw-slidein').forEach(function(el){
          if(!el.classList.contains('sw-open')){
            setup(el);
          }
        });
      }, 250);
    }, { passive: true });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
