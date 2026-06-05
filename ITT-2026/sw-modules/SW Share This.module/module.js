// ===============================
// Smithworks' SW Share This module.js
// Master Version: 2025.11.28
// Changelog: ../CHANGELOG.md
// ===============================

(function() {
  'use strict';
  
  // Initialize copy-to-clipboard functionality
  function initShareModule() {
    // Find all share modules on the page
    const shareModules = document.querySelectorAll('.sw-share-this');
    
    shareModules.forEach(function(module) {
      // Find copy link buttons within this module
      const copyButtons = module.querySelectorAll('.sw-share-this__button--copy_link');
      const toast = module.querySelector('.sw-share-this__toast');
      
      copyButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          
          const shareUrl = button.getAttribute('data-share-url');
          
          if (!shareUrl) {
            return;
          }
          
          // Copy to clipboard
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareUrl).then(function() {
              showToast(toast);
            }).catch(function(err) {
              console.error('Failed to copy to clipboard:', err);
              fallbackCopyToClipboard(shareUrl, toast);
            });
          } else {
            // Fallback for older browsers
            fallbackCopyToClipboard(shareUrl, toast);
          }
        });
      });
    });
  }
  
  // Fallback copy method for older browsers
  function fallbackCopyToClipboard(text, toast) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showToast(toast);
      } else {
        console.error('Fallback copy command failed');
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    
    document.body.removeChild(textArea);
  }
  
  // Show toast notification
  function showToast(toast) {
    if (!toast) {
      return;
    }
    
    toast.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(function() {
      toast.style.display = 'none';
    }, 3000);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShareModule);
  } else {
    initShareModule();
  }
  
})();

