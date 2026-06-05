// ===============================
//   Smithworks' SW Magic Accordion module.js
//   Master version date: 2026.01.28
//   Master version number: 2026.02.24.16.30
//   Changelog: ../CHANGELOG.md
// ===============================

(function() {
  'use strict';

  const accordionsNeedingResize = new Set();
  let resizeObserver = null;
  let sharedResizeListenerAttached = false;

  // Initialize all SW Magic Accordion instances
  function initMagicAccordions() {
    const accordions = document.querySelectorAll('.sw-magic-accordion:not([data-initialized])');
    
    if (accordions.length === 0) {
      return;
    }
    
    accordions.forEach(function(accordion) {
      accordion.setAttribute('data-initialized', 'true');
      
      const tabs = Array.from(accordion.querySelectorAll('.sw-magic-accordion__tab'));
      const tabbedPanels = Array.from(accordion.querySelectorAll('.sw-magic-accordion__tabbed-panel'));
      const defaultPanel = accordion.querySelector('.sw-magic-accordion__default-panel-tabbed');
      const triggers = accordion.querySelectorAll('.sw-magic-accordion__trigger');
      const accordionPanels = accordion.querySelectorAll('.sw-magic-accordion__panel');
      const tabsContainer = accordion.querySelector('.sw-magic-accordion__tabs');
      const tabbedContent = accordion.querySelector('.sw-magic-accordion__tabbed-content');
      const tabsClickOnly = accordion.classList.contains('tabs-click-only');
      
      // Set tabbed content height to match tallest panel
      if (tabbedContent && tabbedPanels.length > 0) {
        // Store reference for recalculation
        accordion._tabbedContent = tabbedContent;
        accordion._tabbedPanels = tabbedPanels;

        // Initial calculation
        setTabbedContentHeight(tabbedContent, tabbedPanels, accordion);

        // Register accordion for shared resize monitoring
        registerAccordionForResize(accordion);
        setupFormObservers(accordion);
      }
      
      // Desktop tab functionality - hover activation
      if (tabs.length > 0 && tabbedPanels.length > 0) {
        if (defaultPanel) {
          tabs.forEach(function(tab) {
            if (!tabsClickOnly) {
              tab.addEventListener('mouseenter', function(e) {
                const index = parseInt(this.dataset.index);
                if (!isNaN(index) && index >= 0 && index < tabs.length) {
                  activateAccordionItemTab(index, tabs, tabbedPanels, defaultPanel);
                }
              });
            }

            tab.addEventListener('click', function(e) {
              e.preventDefault();
              const index = parseInt(this.dataset.index);
              if (!isNaN(index) && index >= 0 && index < tabs.length) {
                activateAccordionItemTab(index, tabs, tabbedPanels, defaultPanel);
              }
            });
          });

          if (!tabsClickOnly && tabsContainer) {
            tabsContainer.addEventListener('mouseleave', function(e) {
              const relatedTarget = e.relatedTarget;
              if (!relatedTarget || 
                  (!relatedTarget.closest('.sw-magic-accordion__tabbed-content') && 
                   !relatedTarget.closest('.sw-magic-accordion__tabbed-panel') &&
                   !relatedTarget.closest('.sw-magic-accordion__container'))) {
                activateDefaultPanel(tabs, tabbedPanels, defaultPanel);
              }
            });
          }

          if (!tabsClickOnly && tabbedContent) {
            tabbedContent.addEventListener('mouseleave', function(e) {
              const relatedTarget = e.relatedTarget;
              if (!relatedTarget || 
                  (!relatedTarget.closest('.sw-magic-accordion__tab') && 
                   !relatedTarget.closest('.sw-magic-accordion__tabs') &&
                   !relatedTarget.closest('.sw-magic-accordion__container'))) {
                activateDefaultPanel(tabs, tabbedPanels, defaultPanel);
              }
            });
          }

          if (!tabsClickOnly) {
            const container = accordion.querySelector('.sw-magic-accordion__container');
            if (container) {
              container.addEventListener('mouseleave', function(e) {
                const relatedTarget = e.relatedTarget;
                if (!relatedTarget || !container.contains(relatedTarget)) {
                  activateDefaultPanel(tabs, tabbedPanels, defaultPanel);
                }
              });
            }
          }
        } else {
          tabs.forEach(function(tab) {
            if (!tabsClickOnly) {
              tab.addEventListener('mouseenter', function(e) {
                const index = parseInt(this.dataset.index);
                if (!isNaN(index) && index >= 0 && index < tabs.length) {
                  activateTab(index, tabs, tabbedPanels);
                }
              });
            }

            tab.addEventListener('click', function(e) {
              e.preventDefault();
              const index = parseInt(this.dataset.index);
              if (!isNaN(index) && index >= 0 && index < tabs.length) {
                activateTab(index, tabs, tabbedPanels);
              }
            });
          });
        }
        
        // Keyboard navigation for tabs
        tabs.forEach(function(tab, index) {
          tab.addEventListener('keydown', function(e) {
            let newIndex;
            
            switch(e.key) {
              case 'ArrowLeft':
                e.preventDefault();
                newIndex = index > 0 ? index - 1 : tabs.length - 1;
                tabs[newIndex].focus();
                if (defaultPanel) {
                  activateAccordionItemTab(newIndex, tabs, tabbedPanels, defaultPanel);
                } else {
                  activateTab(newIndex, tabs, tabbedPanels);
                }
                break;
              case 'ArrowRight':
                e.preventDefault();
                newIndex = index < tabs.length - 1 ? index + 1 : 0;
                tabs[newIndex].focus();
                if (defaultPanel) {
                  activateAccordionItemTab(newIndex, tabs, tabbedPanels, defaultPanel);
                } else {
                  activateTab(newIndex, tabs, tabbedPanels);
                }
                break;
              case 'Home':
                e.preventDefault();
                tabs[0].focus();
                if (defaultPanel) {
                  activateAccordionItemTab(0, tabs, tabbedPanels, defaultPanel);
                } else {
                  activateTab(0, tabs, tabbedPanels);
                }
                break;
              case 'End':
                e.preventDefault();
                tabs[tabs.length - 1].focus();
                if (defaultPanel) {
                  activateAccordionItemTab(tabs.length - 1, tabs, tabbedPanels, defaultPanel);
                } else {
                  activateTab(tabs.length - 1, tabs, tabbedPanels);
                }
                break;
              case 'Enter':
              case ' ':
                e.preventDefault();
                if (defaultPanel) {
                  activateAccordionItemTab(index, tabs, tabbedPanels, defaultPanel);
                } else {
                  activateTab(index, tabs, tabbedPanels);
                }
                break;
            }
          });
        });
      }
      
      // Mobile accordion functionality
      if (triggers.length > 0) {
        triggers.forEach(function(trigger) {
          const activateTrigger = function(e) {
            e.preventDefault();
            e.stopPropagation();
            const panel = trigger.closest('.sw-magic-accordion__panel');
            if (!panel) return;
            
            const isActive = panel.classList.contains('active');
            
            // Close all panels first (start closing animation)
            accordionPanels.forEach(function(p) {
              p.classList.remove('active');
              p.setAttribute('aria-expanded', 'false');
              const t = p.querySelector('.sw-magic-accordion__trigger');
              const content = p.querySelector('.sw-magic-accordion__accordion-content');
              if (t) {
                t.setAttribute('aria-expanded', 'false');
              }
              if (content) {
                content.setAttribute('aria-hidden', 'true');
              }
            });
            
            // Toggle clicked panel - delay opening until after closing animation starts
            if (!isActive) {
              // Wait for closing animation to start before opening new panel
              setTimeout(function() {
                panel.classList.add('active');
                panel.setAttribute('aria-expanded', 'true');
                trigger.setAttribute('aria-expanded', 'true');
                const content = panel.querySelector('.sw-magic-accordion__accordion-content');
                if (content) {
                  content.setAttribute('aria-hidden', 'false');
                }
              }, 50); // Small delay to let closing animation start first
            }
          };
          trigger.addEventListener('click', activateTrigger);
          trigger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
              activateTrigger(e);
            }
          });
        });
      }
    });
  }
  
  // Helper function to activate an accordion item tab (on hover) - hides default panel
  function activateAccordionItemTab(index, tabs, panels, defaultPanel) {
    if (!tabs || !panels || tabs.length === 0 || panels.length === 0) {
      return;
    }
    
    if (index < 0 || index >= tabs.length) {
      return;
    }
    
    // Find the panel with matching data-index first
    const matchingPanel = Array.from(panels).find(function(p) {
      return p.dataset.index === String(index) && !p.classList.contains('sw-magic-accordion__default-panel-tabbed');
    });
    
    // Find currently active panel
    const currentActivePanel = Array.from(panels).find(function(p) {
      return p.classList.contains('active') && !p.classList.contains('sw-magic-accordion__default-panel-tabbed');
    });
    
    // Show selected tab
    if (tabs[index]) {
      tabs[index].classList.add('active');
      tabs[index].setAttribute('aria-selected', 'true');
    }
    
    // Remove active class from all other tabs
    tabs.forEach(function(t, i) {
      if (i !== index && t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      }
    });
    
    if (currentActivePanel && currentActivePanel !== matchingPanel) {
      markPanelLeaving(currentActivePanel);
    }
    
    if (defaultPanel && (defaultPanel.classList.contains('active') || defaultPanel.classList.contains('entering')) && defaultPanel !== matchingPanel) {
      markPanelLeaving(defaultPanel);
    }
    
    panels.forEach(function(p) {
      if (!p || p === matchingPanel || p === defaultPanel) {
        return;
      }
      if (p.classList.contains('active') || p.classList.contains('entering')) {
        markPanelLeaving(p);
      }
    });
    
    // Show new panel with entering class (CSS will handle fade in)
    if (matchingPanel) {
      const accordion = matchingPanel.closest('.sw-magic-accordion');
      if (accordion && accordion._tabbedContent && accordion._tabbedPanels) {
        clearPanelTimers(matchingPanel);
        matchingPanel.classList.remove('leaving', 'entering', 'active');
        // CRITICAL: Set height BEFORE showing panel to prevent flash
        // Temporarily make matching panel measurable
        const wasHidden = matchingPanel.style.visibility === 'hidden' || matchingPanel.classList.contains('active') === false;
        if (wasHidden) {
          matchingPanel.style.visibility = 'hidden';
          matchingPanel.style.position = 'relative';
          matchingPanel.style.opacity = '0';
          matchingPanel.style.display = 'flex';
          matchingPanel.style.height = 'auto';
          void matchingPanel.offsetHeight; // Force reflow
        }
        setTabbedContentHeight(accordion._tabbedContent, accordion._tabbedPanels, accordion);
        // Restore if needed
        if (wasHidden) {
          matchingPanel.style.visibility = '';
          matchingPanel.style.position = '';
          matchingPanel.style.opacity = '';
          matchingPanel.style.display = '';
          matchingPanel.style.height = '';
        }
      }
      markPanelEntering(matchingPanel);
    }
  }
  
  // Helper function to activate default panel (on mouseout)
  function activateDefaultPanel(tabs, panels, defaultPanel) {
    if (!defaultPanel) {
      return;
    }
    
    // Remove active class from all tabs
    tabs.forEach(function(t) {
      if (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      }
    });
    
    panels.forEach(function(p) {
      if (p && !p.classList.contains('sw-magic-accordion__default-panel-tabbed')) {
        markPanelLeaving(p);
      }
    });
    
    markPanelEntering(defaultPanel, true);
    
    // Recalculate height after panel change
    const accordion = defaultPanel.closest('.sw-magic-accordion');
    if (accordion && accordion._tabbedContent && accordion._tabbedPanels) {
      setTimeout(function() {
        setTabbedContentHeight(accordion._tabbedContent, accordion._tabbedPanels, accordion);
      }, 50);
    }
  }
  
  // Helper function to activate a tab (standard behavior when no default panel)
  function activateTab(index, tabs, panels) {
    if (!tabs || !panels || tabs.length === 0 || panels.length === 0) {
      return;
    }
    
    if (index < 0 || index >= tabs.length || index >= panels.length) {
      return;
    }
    
    // Find currently active panel
    const currentActivePanel = Array.from(panels).find(function(p, i) {
      return i !== index && p.classList.contains('active');
    });
    
    // Show selected tab
    if (tabs[index]) {
      tabs[index].classList.add('active');
      tabs[index].setAttribute('aria-selected', 'true');
    }
    
    // Remove active class from all other tabs
    tabs.forEach(function(t, i) {
      if (i !== index && t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      }
    });
    
    if (currentActivePanel) {
      markPanelLeaving(currentActivePanel);
    }
    
    panels.forEach(function(p, i) {
      if (i !== index && p && (p.classList.contains('active') || p.classList.contains('entering'))) {
        markPanelLeaving(p);
      }
    });
    
    const newPanel = panels[index];
    if (newPanel) {
      markPanelEntering(newPanel);
    }
  }

  function clearPanelTimers(panel) {
    if (!panel) {
      return;
    }
    if (panel._leaveTimeout) {
      clearTimeout(panel._leaveTimeout);
      panel._leaveTimeout = null;
    }
    if (panel._enterTimeout) {
      clearTimeout(panel._enterTimeout);
      panel._enterTimeout = null;
    }
  }

  function setPanelState(panel, state) {
    if (!panel) {
      return;
    }
    panel._state = state;
  }

  function markPanelLeaving(panel) {
    if (!panel) {
      return;
    }
    clearPanelTimers(panel);
    setPanelState(panel, 'leaving');
    panel.classList.remove('entering');
    panel.classList.remove('active');
    panel.classList.add('leaving');
    panel.setAttribute('aria-hidden', 'true');
    panel._leaveTimeout = setTimeout(function() {
      panel.classList.remove('leaving');
      panel._leaveTimeout = null;
      if (panel._state === 'leaving') {
        setPanelState(panel, null);
      }
    }, 250);
  }

  function markPanelEntering(panel, force) {
    if (!panel) {
      return;
    }
    clearPanelTimers(panel);
    if (!force && panel._state === 'leaving') {
      panel.classList.remove('leaving');
      panel._state = null;
    }
    setPanelState(panel, 'entering');
    panel.classList.remove('leaving');
    panel.classList.add('entering');
    panel.classList.add('active');
    panel.setAttribute('aria-hidden', 'false');
    panel._enterTimeout = setTimeout(function() {
      if (panel._state === 'entering' || force) {
        panel.classList.remove('entering');
        panel.classList.add('active');
        panel._state = 'active';
      }
      panel._enterTimeout = null;
    }, 150);
  }

  // Function to set tabbed content height to match tallest panel
  function setTabbedContentHeight(tabbedContent, panels, accordion) {
    if (!tabbedContent || !panels || panels.length === 0) {
      return;
    }
    
    const minHeight = parseInt(getComputedStyle(accordion).getPropertyValue('--tabbed-min-height')) || 400;
    let maxHeight = minHeight;
    
    panels.forEach(function(panel) {
      if (!panel) return;
      const hadActive = panel.classList.contains('active');
      const hadEntering = panel.classList.contains('entering');
      const hadLeaving = panel.classList.contains('leaving');
      const originalVisibility = panel.style.visibility;
      const originalPosition = panel.style.position;
      const originalOpacity = panel.style.opacity;
      const originalPointerEvents = panel.style.pointerEvents;
      const originalDisplay = panel.style.display;
      const originalHeight = panel.style.height;
      panel.classList.remove('active', 'entering', 'leaving');
      panel.style.visibility = 'hidden';
      panel.style.position = 'relative';
      panel.style.opacity = '0';
      panel.style.pointerEvents = 'none';
      panel.style.display = 'flex';
      panel.style.height = 'auto';
      void panel.offsetHeight;
      const panelHeight = panel.offsetHeight;
      if (panelHeight > maxHeight) {
        maxHeight = panelHeight;
      }
      panel.style.visibility = originalVisibility;
      panel.style.position = originalPosition;
      panel.style.opacity = originalOpacity;
      panel.style.pointerEvents = originalPointerEvents;
      panel.style.display = originalDisplay;
      panel.style.height = originalHeight;
      if (hadActive) panel.classList.add('active');
      if (hadEntering) panel.classList.add('entering');
      if (hadLeaving) panel.classList.add('leaving');
    });
    
    if (accordion.classList.contains('tabs-left')) {
      const tabsContainer = accordion.querySelector('.sw-magic-accordion__tabs');
      if (tabsContainer) {
        const originalDisplay = tabsContainer.style.display;
        const computedDisplay = getComputedStyle(tabsContainer).display;
        if (computedDisplay === 'none') {
          tabsContainer.style.display = 'flex';
        }
        const tabsHeight = tabsContainer.offsetHeight || 0;
        if (computedDisplay === 'none') {
          tabsContainer.style.display = originalDisplay;
        }
        if (tabsHeight > maxHeight) {
          maxHeight = tabsHeight;
        }
      }
    }
    
    const currentHeight = parseInt(tabbedContent.style.height) || tabbedContent.offsetHeight;
    if (Math.abs(currentHeight - maxHeight) > 5) {
      tabbedContent.style.transition = 'height 0.2s ease';
      tabbedContent.style.height = maxHeight + 'px';
      setTimeout(function() {
        tabbedContent.style.transition = '';
      }, 250);
    } else {
      tabbedContent.style.height = maxHeight + 'px';
    }
  }

  function queueTabbedHeightUpdate(accordion) {
    if (!accordion || !accordion._tabbedContent || !accordion._tabbedPanels) {
      return;
    }
    if (accordion._tabbedHeightTimeout) {
      clearTimeout(accordion._tabbedHeightTimeout);
    }
    accordion._tabbedHeightTimeout = setTimeout(function() {
      setTabbedContentHeight(accordion._tabbedContent, accordion._tabbedPanels, accordion);
      accordion._tabbedHeightTimeout = null;
    }, 120);
  }

  // Function to apply button classes to HubSpot form buttons
  // HubSpot buttons need the 'btn btn-{style}' classes like regular SR buttons
  function applyButtonStyles(wrapper) {
    // Check if wrapper has button style classes
    if (!wrapper.classList.contains('btn-wrapper')) {
      return;
    }
    
    // Find the button style class (e.g., btn-primary-wrapper, btn-gradient_one-wrapper)
    let buttonStyleClass = null;
    Array.from(wrapper.classList).forEach(function(className) {
      if (className.startsWith('btn-') && className.endsWith('-wrapper') && className !== 'btn-wrapper') {
        // Extract style from class like "btn-primary-wrapper" -> "primary"
        const styleMatch = className.match(/^btn-(.+)-wrapper$/);
        if (styleMatch) {
          buttonStyleClass = styleMatch[1];
        }
      }
    });
    
    if (!buttonStyleClass) {
      return;
    }
    
    // Find all submit buttons within this wrapper
    const buttons = wrapper.querySelectorAll('button[type="submit"].hsfc-Button, button[type="submit"][data-hsfc-id="Button"]');
    buttons.forEach(function(button) {
      // Add the btn, btn-{style}, and cta-button classes that SR buttons need
      // This matches the pattern: <a class="btn btn-primary cta-button">
      if (!button.classList.contains('btn')) {
        button.classList.add('btn');
      }
      if (!button.classList.contains('btn-' + buttonStyleClass)) {
        button.classList.add('btn-' + buttonStyleClass);
      }
      if (!button.classList.contains('cta-button')) {
        button.classList.add('cta-button');
      }
      
      // Remove HubSpot's inline styles to allow theme CSS to apply
      // HubSpot adds inline styles with !important that override our theme
      // By removing the style attribute, the theme CSS classes can work properly
      if (button.hasAttribute('style')) {
        button.removeAttribute('style');
      }
      
      // Watch for HubSpot re-adding inline styles and remove them
      // Only set up observer once per button
      if (!button._swButtonStyleObserver) {
        const styleObserver = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
              // HubSpot re-added the style attribute, remove it again
              if (button.hasAttribute('style')) {
                button.removeAttribute('style');
              }
            }
          });
        });
        styleObserver.observe(button, { attributes: true, attributeFilter: ['style'] });
        button._swButtonStyleObserver = styleObserver;
      }
    });
  }

  function setupFormObservers(accordion) {
    if (!accordion) {
      return;
    }
    const wrappers = accordion.querySelectorAll('[data-sw-accordion-form]');
    if (!wrappers.length) {
      return;
    }
    wrappers.forEach(function(wrapper) {
      if (wrapper._swAccordionFormObserver) {
        return;
      }
      const observer = new MutationObserver(function(mutations) {
        var shouldUpdate = false;
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(node) {
              if (node && node.nodeType === 1) {
                if (node.tagName === 'IFRAME') {
                  node.addEventListener('load', function() {
                    queueTabbedHeightUpdate(accordion);
                    applyButtonStyles(wrapper);
                  });
                }
                node.querySelectorAll && node.querySelectorAll('iframe').forEach(function(iframe) {
                  iframe.addEventListener('load', function() {
                    queueTabbedHeightUpdate(accordion);
                    applyButtonStyles(wrapper);
                  });
                });
              }
            });
            shouldUpdate = true;
          } else if (mutation.type === 'attributes') {
            shouldUpdate = true;
          }
        });
        if (shouldUpdate) {
          queueTabbedHeightUpdate(accordion);
          // Apply button styles when form content changes
          setTimeout(function() {
            applyButtonStyles(wrapper);
          }, 100);
        }
      });
      observer.observe(wrapper, { childList: true, subtree: true, attributes: true });

      // Listen for iframe load events which HubSpot forms use
      const iframes = wrapper.querySelectorAll('iframe');
      iframes.forEach(function(iframe) {
        iframe.addEventListener('load', function() {
          queueTabbedHeightUpdate(accordion);
          applyButtonStyles(wrapper);
        });
      });
      
      // Apply styles initially in case form is already loaded
      applyButtonStyles(wrapper);
      setTimeout(function() {
        applyButtonStyles(wrapper);
      }, 500);

      wrapper._swAccordionFormObserver = observer;
    });

    // Schedule a follow-up height adjustment in case the form script injects content asynchronously
    queueTabbedHeightUpdate(accordion);
    setTimeout(function() {
      queueTabbedHeightUpdate(accordion);
    }, 600);
  }

  function registerAccordionForResize(accordion) {
    if (!accordion || !accordion._tabbedContent || !accordion._tabbedPanels) {
      return;
    }

    accordionsNeedingResize.add(accordion);

    if (typeof ResizeObserver !== 'undefined') {
      if (!resizeObserver) {
        resizeObserver = new ResizeObserver(function(entries) {
          entries.forEach(function(entry) {
            const rootAccordion = entry.target;
            if (rootAccordion && rootAccordion._tabbedContent && rootAccordion._tabbedPanels) {
              setTabbedContentHeight(rootAccordion._tabbedContent, rootAccordion._tabbedPanels, rootAccordion);
            }
          });
        });
      }
      resizeObserver.observe(accordion);
    } else if (!sharedResizeListenerAttached) {
      sharedResizeListenerAttached = true;
      let resizeTimeout;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
          accordionsNeedingResize.forEach(function(acc) {
            if (acc.isConnected && acc._tabbedContent && acc._tabbedPanels) {
              setTabbedContentHeight(acc._tabbedContent, acc._tabbedPanels, acc);
            }
          });
        }, 250);
      });
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMagicAccordions);
  } else {
    initMagicAccordions();
  }
  
  // Also initialize for dynamically loaded content (HubSpot)
  if (typeof window.hsOnReady !== 'undefined') {
    window.hsOnReady.push(initMagicAccordions);
  }
  
  // Re-initialize on window load (for any late-loading content)
  window.addEventListener('load', function() {
    setTimeout(initMagicAccordions, 100);
  });
})();
