// STACK Tabs Testimonials 01 Module JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize equal heights for tab content elements
    function initializeEqualHeights() {
        const tabContainers = document.querySelectorAll('.sr-tabs-testimonials-01 .tab-content');
        tabContainers.forEach(function(container) {
            const tabPanes = container.querySelectorAll('.tab-pane');
            if (tabPanes.length > 1) {
                // Use the global precalculateEqualHeights function if available
                if (typeof precalculateEqualHeights === 'function') {
                    precalculateEqualHeights(tabPanes);
                } else {
                    // Fallback precalculation implementation
                    precalculateEqualHeightsFallback(tabPanes);
                }
            }
        });
    }

    // Fallback precalculation function
    function precalculateEqualHeightsFallback(tabPanes) {
        // Store original display states
        const originalStates = [];
        tabPanes.forEach(function(pane) {
            originalStates.push({
                element: pane,
                display: pane.style.display,
                visibility: pane.style.visibility,
                position: pane.style.position,
                opacity: pane.style.opacity
            });
        });

        // Temporarily show all tabs to measure their heights
        tabPanes.forEach(function(pane) {
            pane.style.display = 'block';
            pane.style.visibility = 'hidden';
            pane.style.position = 'absolute';
            pane.style.opacity = '0';
        });

        // Calculate the maximum height
        let maxHeight = 0;
        tabPanes.forEach(function(pane) {
            const height = pane.scrollHeight;
            maxHeight = Math.max(maxHeight, height);
        });

        // Restore original states and apply equal height
        originalStates.forEach(function(state) {
            state.element.style.display = state.display;
            state.element.style.visibility = state.visibility;
            state.element.style.position = state.position;
            state.element.style.opacity = state.opacity;
            state.element.style.minHeight = maxHeight + 'px';
        });
    }

    // Initialize on page load
    initializeEqualHeights();

    // Recalculate on window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initializeEqualHeights, 250);
    });

    // Recalculate when images load (in case they affect content height)
    const images = document.querySelectorAll('.sr-tabs-testimonials-01 img');
    images.forEach(function(img) {
        if (img.complete) {
            initializeEqualHeights();
        } else {
            img.addEventListener('load', initializeEqualHeights);
        }
    });
});
