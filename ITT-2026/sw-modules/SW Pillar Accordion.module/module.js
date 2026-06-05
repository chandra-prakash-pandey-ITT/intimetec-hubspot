/* ===============================
   Smithworks' SW Pillar Accordion module.js
   Master Version: 2026.01.10
   Changelog: ../CHANGELOG.md
   =============================== */

(function() {
  'use strict';

  function initPillarAccordions() {
    const accordions = document.querySelectorAll('.sw-pillar-accordion:not([data-initialized])');
    
    if (accordions.length === 0) {
      return;
    }
    
    accordions.forEach(function(accordion) {
      accordion.setAttribute('data-initialized', 'true');
      
      const items = accordion.querySelectorAll('.sw-pillar-accordion__item');
      const headers = accordion.querySelectorAll('.sw-pillar-accordion__header');
      
      // Initialize first active image - ensure only one is active
      const imageItems = accordion.querySelectorAll('.sw-pillar-accordion__image-item');
      const firstActiveItem = accordion.querySelector('.sw-pillar-accordion__item.active');
      
      if (firstActiveItem && imageItems.length > 0) {
        // Remove active from all images first
        imageItems.forEach(function(img) {
          img.classList.remove('active');
        });
        
        // Add active to the image matching the active item
        const firstIndex = firstActiveItem.getAttribute('data-index');
        const matchingImage = accordion.querySelector('.sw-pillar-accordion__image-item[data-index="' + firstIndex + '"]');
        if (matchingImage) {
          matchingImage.classList.add('active');
        } else if (imageItems.length > 0) {
          // Fallback: if no matching image found, activate the first image
          imageItems[0].classList.add('active');
        }
      }
      
      headers.forEach(function(header) {
        const handleClick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          const item = header.closest('.sw-pillar-accordion__item');
          if (!item) return;
          
          const isActive = item.classList.contains('active');
          
          // Close all items
          items.forEach(function(i) {
            i.classList.remove('active');
            const panel = i.querySelector('.sw-pillar-accordion__panel');
            const trigger = i.querySelector('.sw-pillar-accordion__header');
            const bar = i.querySelector('.sw-pillar-accordion__bar');
            
            if (panel) {
              panel.setAttribute('aria-hidden', 'true');
            }
            if (trigger) {
              trigger.setAttribute('aria-expanded', 'false');
            }
            // Change bar to inactive
            if (bar && i !== item) {
              bar.classList.remove('sw-pillar-accordion__bar--active');
              bar.classList.add('sw-pillar-accordion__bar--inactive');
            }
          });
          
          // Open clicked item (if not already active)
          if (!isActive) {
            item.classList.add('active');
            const panel = item.querySelector('.sw-pillar-accordion__panel');
            const trigger = item.querySelector('.sw-pillar-accordion__header');
            let bar = item.querySelector('.sw-pillar-accordion__bar');
            const itemIndex = item.getAttribute('data-index');
            
            if (panel) {
              panel.setAttribute('aria-hidden', 'false');
            }
            if (trigger) {
              trigger.setAttribute('aria-expanded', 'true');
            }
            // Change bar to active
            if (bar) {
              bar.classList.remove('sw-pillar-accordion__bar--inactive');
              bar.classList.add('sw-pillar-accordion__bar--active');
            }
            
            // Update image on right side
            const imageItems = accordion.querySelectorAll('.sw-pillar-accordion__image-item');
            imageItems.forEach(function(img) {
              img.classList.remove('active');
              if (img.getAttribute('data-index') === itemIndex) {
                img.classList.add('active');
              }
            });
          }
        };
        
        header.addEventListener('click', handleClick);
        header.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e);
          }
        });
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPillarAccordions);
  } else {
    initPillarAccordions();
  }
  
  // Also initialize for dynamically loaded content (HubSpot)
  if (typeof window.hsOnReady !== 'undefined') {
    window.hsOnReady.push(initPillarAccordions);
  }
  
  // Re-initialize on window load (for any late-loading content)
  window.addEventListener('load', function() {
    setTimeout(initPillarAccordions, 100);
  });
})();
