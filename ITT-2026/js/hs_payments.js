const hsOverlay = (overlay) => {
	const uniqueModuleId = overlay.getAttribute('data-instance');
	const numericModuleId = uniqueModuleId.replace('widget_', '');
	const overlayDisabled = overlay.getAttribute('data-disabled') === 'true';

	// Use the numeric module id to keep the url hash cleaner
	const hash = `#checkout-${numericModuleId}`;

	const openButton = document.querySelector(`.button__open-overlay-${uniqueModuleId}`);
	const closeButton = overlay.querySelector('.hs-overlay__close--top');
	const bottomCloseButton = overlay.querySelector('.hs-overlay__close--bottom');
	const overlayBackground = document.querySelector(
		`.hs-overlay-background[data-instance="${uniqueModuleId}"]`
	);
	const iframe = overlay.querySelector('.payments-iframe-container iframe');

	function handleCloseButtonClick(e) {
		if (e.key === 'Tab' && e.shiftKey) {
			e.preventDefault();
			bottomCloseButton.focus();
		}
	}

	function handleBottomCloseButtonClick(e) {
		if (e.key === 'Tab') {
			e.preventDefault();

			if (e.shiftKey) {
				iframe.focus();
			} else {
				closeButton.focus();
			}
		}
	}

	function handleOverlayBackgroundClick() {
		window.history.back();
	}

	function openOverlay() {
		function endTransition() {
			overlay.removeEventListener('transitionend', endTransition);
			iframe.focus();
		}

		overlay.addEventListener('transitionend', endTransition);
		closeButton.addEventListener('keydown', handleCloseButtonClick);
		bottomCloseButton.addEventListener('keydown', handleBottomCloseButtonClick);
		overlayBackground.addEventListener('click', handleOverlayBackgroundClick);

		document.documentElement.classList.add('hs-payments--overlay-open');
		overlay.classList.add('open');
		overlayBackground.classList.add('open');
	}

	function closeOverlay() {
		function endTransition() {
			document.documentElement.classList.remove('hs-payments--overlay-open');
			overlay.removeEventListener('transitionend', endTransition);
			openButton.focus();
		}

		if (overlay.classList.contains('open')) {
			overlay.addEventListener('transitionend', endTransition);
			closeButton.removeEventListener('keydown', handleCloseButtonClick);
			bottomCloseButton.removeEventListener('keydown', handleBottomCloseButtonClick);
			overlayBackground.removeEventListener('click', handleOverlayBackgroundClick);

			overlay.classList.remove('open');
			overlayBackground.classList.remove('open');
		}
	}

	function initialize() {
		// display:none is applied to the element directly to prevent overlay from flashing when the page first loads
		overlay.removeAttribute('style');
		overlayBackground.removeAttribute('style');

		openButton.addEventListener('click', () => {
			// Do not update the hash using window.location.hash - That works in Chrome but it does not work in Safari
			window.history.pushState(null, '', window.location.href + hash);
			openOverlay();
		});

		closeButton.addEventListener('click', () => {
			window.history.back();
		});

		bottomCloseButton.addEventListener('click', () => {
			window.history.back();
		});

		window.addEventListener('popstate', (e) => {
			if (hash === e.target.location.hash) {
				openOverlay();
			} else {
				closeOverlay();
			}
		});

		// If the hash is already in the URL, open the overlay
		if (window.location.hash && window.location.hash === hash) {
			setTimeout(() => {
				// If a user directly navigates to the URL with a hash, we need to replace the initial state so that the user can dismiss the overlay.
				const originalUrl = window.location.href;
				const originalUrlWithoutHash = originalUrl.replace(window.location.hash, '');

				window.history.replaceState(null, '', originalUrlWithoutHash);
				window.history.pushState(null, '', originalUrl);

				openOverlay();
			}, 500); // delaying automatic opening a bit looks a bit nicer
		}
	}

	// Disable opening the overlay in the editor
	if (!overlayDisabled) {
		initialize();
	}
};

document.addEventListener('DOMContentLoaded', () => {
	Array.from(document.querySelectorAll('.hs-overlay')).forEach((overlay) => hsOverlay(overlay));
});
