// ===============================
// Smithworks' SW Header module.js
// Master Version: 2025.11.26
// Based On: SR Navigation 01 (Sprocket Rocket)
// Changelog: ../CHANGELOG.md
// ===============================

document.addEventListener('DOMContentLoaded', () => {

	const nav = document.querySelector('.header__container');
	const topbar = document.querySelector('.header__top');
	let heights = {
		nav: nav.offsetHeight,
		topbar: topbar ? topbar.offsetHeight : 0
	};

	function toggleElementVisibility (selector, className) {
		const elements = nav.querySelectorAll(selector);
		elements.forEach(el => el.classList.toggle(className));
	}

	function setAriaExpanded (element, value) {
		element.setAttribute('aria-expanded', value.toString());
	}

	function closeAllDropdowns () {
		if (nav.getAttribute('data-layout') === 'mobile') return;
		const dropdowns = nav.querySelectorAll('.header__menu-item--has-submenu');
		dropdowns.forEach(dropdown => {
			const button = dropdown.querySelector('.no-button');
			dropdown.classList.remove('header__menu-item--open');
			if (button) setAriaExpanded(button, false);
		});
	}

	function updateHeaderHeight () {
		heights = {
			nav: nav.offsetHeight != 0 ? nav.offsetHeight : heights.nav,
			topbar: topbar ? topbar.offsetHeight : 0
		};
	}

	function setHeaderHeight () {
		let top = 0;
		const topbarFixed = nav.dataset.topbarFixed === 'false';
		if (!topbarFixed && nav.classList.contains('header-scroll')) {
			console.log('topbarFixed');
			top = heights.nav - heights.topbar;
		} else {
			top = heights.nav;
		}

		console.log(top);

		document.body.style.setProperty('--navHeight', `${top}px`);
	}

	function handleMenuToggle (toggle, menuSelector, openClass, closeClass) {
		toggle.addEventListener('click', () => {
			setHeaderHeight()
			document.body.classList.toggle('nav-open');
			toggleElementVisibility(menuSelector, 'header__menu--show');
			toggleElementVisibility('.header__menu-toggle--open', openClass);
			toggleElementVisibility('.header__menu-toggle--close', closeClass);
		});
	}

	// Desktop menu hover and focus interactions
	const menuParentItems = nav.querySelectorAll('.header__menu-item--has-submenu');
	
	menuParentItems.forEach(item => {
		const button = item.querySelector('.header__menu-link--toggle');
		
		// All menu items use hover on desktop
		item.addEventListener('mouseover', () => {
			if (nav.getAttribute('data-layout') === 'desktop') {
				item.classList.add('header__menu-item--open');
				if (button) setAriaExpanded(button, true);
			}
		});

		item.addEventListener('mouseout', () => {
			if (nav.getAttribute('data-layout') === 'desktop') {
				item.classList.remove('header__menu-item--open');
				if (button) setAriaExpanded(button, false);
			}
		});
		
		if (button && nav.getAttribute('data-layout') === 'desktop') {
			button.addEventListener('focus', closeAllDropdowns);
		}
	});

	// Mobile menu interactions
	nav.querySelectorAll('.header__menu-toggle').forEach(toggle => {
		handleMenuToggle(toggle, '.header__menu--mobile', 'header__menu-toggle--show', 'header__menu-toggle--show');
	});

	// Mobile menu - toggle submenus
	nav.querySelectorAll('.header__menu-link--toggle').forEach(toggle => {
		toggle.addEventListener('click', () => {
			const parent = toggle.parentNode;
			const isOpen = parent.classList.toggle('header__menu-item--open');
			setAriaExpanded(toggle, isOpen);
		});
	});

	// Mobile menu - back button
	nav.querySelectorAll('.header__menu-back').forEach(toggle => {
		toggle.addEventListener('click', () => {
			const prevButton = toggle.closest('ul').previousElementSibling;
			prevButton.classList.toggle('header__menu-child-toggle--open');
			const parent = prevButton.parentNode;
			parent.classList.remove('header__menu-item--open');
			setAriaExpanded(prevButton, false);
		});
	});

	// Anchor links for mobile nav
	nav.querySelectorAll('.header__menu-link[href*="#"],.cta-button[href*="#"]').forEach(link => {
		link.addEventListener('click', () => {
			document.body.classList.remove('nav-open');
			toggleElementVisibility('.header__menu--mobile', 'header__menu--show');
			toggleElementVisibility('.header__menu-toggle--close', 'header__menu-toggle--show');
			toggleElementVisibility('.header__menu-toggle--open', 'header__menu-toggle--show');
		});
	});

	// Reusable search functionality
	function initializeSearch(searchContainer) {
		if (!searchContainer) return;
		
		const searchBtn = searchContainer.querySelector('.search--icon');
		const searchInput = searchContainer.querySelector('.hs-search-field__input');
		const searchForm = searchContainer.querySelector('.hs-search-field__form');
		
		if (searchBtn) {
			searchBtn.addEventListener('click', function(e) {
				e.preventDefault();
				
				if (searchContainer.classList.contains('closed')) {
					// Open search
					searchContainer.classList.remove('closed');
					if (searchInput) {
						searchInput.focus();
						searchInput.select();
					}
				} else {
					// Submit form if input has value, otherwise close search
					if (searchInput && searchInput.value.trim()) {
						if (searchForm) {
							searchForm.submit();
						}
					} else {
						searchContainer.classList.add('closed');
					}
				}
			});
		}

		// Handle form submission on Enter key
		if (searchForm) {
			searchForm.addEventListener('submit', function(e) {
				// Only prevent default if the form is being submitted via Enter key
				// and we want to handle it differently
				if (searchInput && !searchInput.value.trim()) {
					e.preventDefault();
					return;
				}
				searchContainer.classList.add('closed');
			});
		}

		// Close search when clicking outside
		document.addEventListener('click', function(event) {
			if (!searchContainer.contains(event.target) && !searchBtn?.contains(event.target)) {
				searchContainer.classList.add('closed');
			}
		});

		// Close search on escape key
		document.addEventListener('keydown', function(event) {
			if (event.key === 'Escape') {
				searchContainer.classList.add('closed');
			}
		});
	}

	// Initialize main search
	const search = nav.querySelector('.search');
	initializeSearch(search);

	// Initialize blog search
	const blogWrapper = nav.querySelector('.header__wrapper-blog');
	if (blogWrapper) {
		const blogSearch = blogWrapper.querySelector('.header__search-col');
		initializeSearch(blogSearch);
	}

	// Scrolling behavior for sticky nav
	if (nav.dataset.fixed === 'true') {

		const headerTop = nav.querySelector('.header__top');
		const headerTopHeight = headerTop ? headerTop.offsetHeight : 0;
		let previousScrollPosition = 0;

		const handleNavScroll = () => {
			const st = window.scrollY || document.documentElement.scrollTop;
			const isScrollingDown = st > previousScrollPosition;
			previousScrollPosition = st;

			if (search) {
				search.classList.add('closed');
				header.classList.remove('search-open');
			}

			const hasHeaderScroll = nav.classList.contains('header-scroll');
			const belowTopbar = nav.dataset.topbarFixed === 'true' && st < headerTopHeight;
			const shouldScroll = nav.dataset.scroll !== 'false' && st > heights.nav;

			if (belowTopbar) {
				nav.classList.remove('header-scroll', 'scroll-up', 'scroll-down');
				if (nav.dataset.transparent === 'false' && nav.dataset.float === 'false') {
					document.body.style.paddingTop = '';
				}
			} else if (st < 1) {
				nav.classList.remove('header-scroll', 'scroll-up');
				if (nav.dataset.transparent === 'false' && nav.dataset.float === 'false') {
					document.body.style.paddingTop = '';
				}
			} else if (shouldScroll || (nav.dataset.scroll === 'false' && st > 0)) {
				nav.classList.add('header-scroll');
				if (nav.dataset.transparent === 'false' && nav.dataset.float === 'false') {
					document.body.style.paddingTop = `${heights.nav}px`;
				}
			}

			if (st > 0) {
				nav.classList.toggle('scroll-down', isScrollingDown && hasHeaderScroll);
				nav.classList.toggle('scroll-up', !isScrollingDown && hasHeaderScroll);
			}
		};

		window.addEventListener('scroll', handleNavScroll);
		window.addEventListener('resize', updateHeaderHeight);

	}

	// Blog Tags Dropdown Functionality
	const blogTagsDropdownBtn = nav.querySelector('.blog-tags-dropdown-btn');
	const blogTagsDropdown = nav.querySelector('.blog-tags-dropdown');
	
	if (blogTagsDropdownBtn && blogTagsDropdown) {
		blogTagsDropdownBtn.addEventListener('click', function(e) {
			e.preventDefault();
			blogTagsDropdown.classList.toggle('open');
		});

		// Close dropdown when clicking outside
		document.addEventListener('click', function(event) {
			if (!blogTagsDropdownBtn.contains(event.target) && !blogTagsDropdown.contains(event.target)) {
				blogTagsDropdown.classList.remove('open');
			}
		});

		// Close dropdown on escape key
		document.addEventListener('keydown', function(event) {
			if (event.key === 'Escape') {
				blogTagsDropdown.classList.remove('open');
			}
		});
	}
});