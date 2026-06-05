document.addEventListener("DOMContentLoaded", function () {

  const collapseEl = document.getElementById("softwareDevCollapse");
  const softwareBtn = document.getElementById("services-tab-software-btn");
  const softwareTab = new bootstrap.Tab(softwareBtn);
  const bsCollapse = new bootstrap.Collapse(collapseEl, { toggle: false });

  const allTabs = document.querySelectorAll(
    '.home-tabs-accordion .nav-link[data-bs-toggle="pill"]'
  );

  const childTabs = collapseEl.querySelectorAll(
    '.nav-link[data-bs-toggle="pill"]'
  );

  // ===== SOFTWARE CLICK =====
  softwareBtn.addEventListener("click", function () {

    // Always activate software tab content
    softwareTab.show();

    // Toggle collapse
    bsCollapse.toggle();

    // Fix arrow rotation manually
    softwareBtn.classList.toggle("collapsed");
  });


  // ===== WHEN ANY OUTER TAB CLICKED =====
  allTabs.forEach(tab => {
    if (tab !== softwareBtn && !collapseEl.contains(tab)) {

      tab.addEventListener("click", function () {

        // Close collapse
        bsCollapse.hide();

        // Reset arrow state
        softwareBtn.classList.add("collapsed");

        // Remove active from all child tabs
        childTabs.forEach(child => child.classList.remove("active"));
      });
    }
  });


  // ===== WHEN CHILD TAB CLICKED =====
  childTabs.forEach(child => {
    child.addEventListener("click", function () {

      // Keep collapse open
      bsCollapse.show();

      // Ensure parent arrow rotated
      softwareBtn.classList.remove("collapsed");
    });
  });

});