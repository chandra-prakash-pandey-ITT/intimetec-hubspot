/* ===============================
   Smithworks' SW Tabs module.js
   Master Version: 2026.01.09
   Changelog: ../CHANGELOG.md
   =============================== */

document.querySelectorAll('.sr-tabs-02').forEach(module => {
    const tabs = module.querySelectorAll('.tab-item');
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            if (window.innerWidth < 993) {
                tab.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'center'});
            }
            const tabChildren = Array.from(tab.parentNode.children);
            const index = tabChildren.indexOf(tab);
            tabChildren.forEach(tabItem => {
                tabItem.setAttribute('aria-selected', 'false');
                tabItem.classList.remove('tab-item--active');
            });
            tab.setAttribute('aria-selected', 'true');
            tab.classList.add('tab-item--active');
            const tabContents = module.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.classList.add('d-none');
                content.setAttribute('aria-hidden', 'true');
            });
            tabContents[index].classList.remove('d-none');
            tabContents[index].setAttribute('aria-hidden', 'false');
        });
    });
});
