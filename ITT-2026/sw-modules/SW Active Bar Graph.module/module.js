// ===============================
// Smithworks' SW Active Bar Graph module.js
// Master Version: 2026.01.06
// Changelog: ../CHANGELOG.md
// ===============================

(function() {
  'use strict';
  
  // Helper function to interpolate between two hex colors
  function interpolateColor(color1, color2, factor) {
    // Remove # if present
    color1 = color1.replace('#', '');
    color2 = color2.replace('#', '');
    
    // Convert hex to RGB
    const r1 = parseInt(color1.substring(0, 2), 16);
    const g1 = parseInt(color1.substring(2, 4), 16);
    const b1 = parseInt(color1.substring(4, 6), 16);
    
    const r2 = parseInt(color2.substring(0, 2), 16);
    const g2 = parseInt(color2.substring(2, 4), 16);
    const b2 = parseInt(color2.substring(4, 6), 16);
    
    // Interpolate
    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);
    
    // Convert back to hex
    return '#' + [r, g, b].map(function(x) {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
  
  function init() {
    const graphs = document.querySelectorAll('.sw-active-bar-graph');
    if (!graphs.length) return;
    
    graphs.forEach(function(graph) {
      const bars = Array.from(graph.querySelectorAll('.sw-active-bar-graph__bar'));
      const gradientBars = graph.querySelectorAll('.sw-active-bar-graph__bar--gradient');
      
      // Apply gradient colors if gradient is enabled
      if (gradientBars.length > 0 && bars.length > 1) {
        bars.forEach(function(bar, index) {
          if (bar.classList.contains('sw-active-bar-graph__bar--gradient')) {
            const startColor = bar.style.getPropertyValue('--gradient-start') || '#1E3A8A';
            const endColor = bar.style.getPropertyValue('--gradient-end') || '#7DD3FC';
            const position = parseFloat(bar.style.getPropertyValue('--gradient-position')) || 0;
            
            // Calculate interpolated color
            const interpolatedColor = interpolateColor(startColor, endColor, position);
            bar.style.background = 'linear-gradient(to top, ' + interpolatedColor + ' 0%, ' + interpolatedColor + ' 100%)';
          }
        });
      }
      
      // Animate bars on scroll into view
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const height = bar.getAttribute('data-height') || 0;
            // Set initial height to 0 for animation
            bar.style.height = '0%';
            // Trigger reflow
            bar.offsetHeight;
            // Animate to target height
            setTimeout(function() {
              bar.style.height = height + '%';
            }, 50);
            observer.unobserve(bar);
          }
        });
      }, {
        threshold: 0.1
      });
      
      bars.forEach(function(bar) {
        // Set initial height to 0 for animation
        bar.style.height = '0%';
        observer.observe(bar);
      });
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

