class Cookie {
	/* Cookie.get('cookieName'); */
	static get (name) {
		const cookieName = encodeURIComponent(name) + '=';
		const cookie = document.cookie;
		let value = null;

		const startIndex = cookie.indexOf(cookieName);
		if (startIndex > -1) {
			let endIndex = cookie.indexOf(';', startIndex);
			if (endIndex == -1) {
				endIndex = cookie.length;
			}
			value = decodeURIComponent(cookie.substring(startIndex + cookieName.length, endIndex)).replace(/^=/, '');
		}

		if (value === '') {
			value = null;
		}

		return value;
	}

	/* Cookie.set('cookieName', 'cookieValue', expirationDate, '/'); */
	static set (name, value, expires, path, domain, secure) {
		let cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
		if (expires instanceof Date) {
			cookieText += '; expires=' + expires.toUTCString();
		}

		if (path) cookieText += '; path=' + path;
		if (domain) cookieText += '; domain=' + domain;
		if (secure != false) cookieText += '; secure';

		document.cookie = cookieText;
	}

	/* Cookie.remove('cookieName'); */
	static remove (name, path, domain, secure) {
		Cookie.set(name, '', new Date(0), path, domain, secure);
	}
}

if (typeof bootstrap === 'undefined' || typeof bootstrap.Modal === 'undefined') {
    var modalDialogMap = {};
    var modalButtons = document.querySelectorAll('[data-toggle="modal"], [data-dismiss="modal"]');
    var body = document.body;
    var modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'modal-backdrop';
    var modalDialog;

    function cacheModalDialog() {
        modalDialog = modalDialog || document.querySelector('.modal-dialog');
    }

    function showModal(modalId, enabledClose) {
        var modal = document.getElementById(modalId);
        var lastFocusedElement = document.activeElement; // Store the element that opened the modal

        if (modal.classList.contains("modal")) {
            body.appendChild(modalBackdrop);
            modalBackdrop.classList.toggle('show', true);
            modal.classList.toggle('show', true);
            modal.style.display = 'block';
            body.classList.toggle('modal-open', true);

            if (enabledClose !== false) {
                modal.addEventListener('click', handleModalClick);
            }

            var storedModalDialog = modalDialogMap[modalId];
            if (storedModalDialog) {
                modal.innerHTML = '';
                modal.appendChild(storedModalDialog);

                // Re-add video elements
                var videoContainer = storedModalDialog.querySelector('.video-container[data-video-src]');
                if (videoContainer) {
                    var videoElement = document.createElement('video');
                    videoElement.src = videoContainer.dataset.videoSrc;
                    videoElement.controls = true; // Add more attributes as needed
                    videoContainer.appendChild(videoElement);
                }

                // Re-add iframe elements
                var iframeContainer = storedModalDialog.querySelector('.iframe-container[data-iframe-src]');
                if (iframeContainer) {
                    var iframeElement = document.createElement('iframe');
                    iframeElement.src = iframeContainer.dataset.iframeSrc;
                    iframeContainer.appendChild(iframeElement);
                }
            }

            // Focus management
            modal.setAttribute('tabindex', '0');
            modal.setAttribute('aria-hidden', 'false');
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.focus();

            // Trap focus within the modal
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstFocusableElement = focusableElements[0];
            const lastFocusableElement = focusableElements[focusableElements.length - 1];

            modal.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusableElement) {
                            lastFocusableElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusableElement) {
                            firstFocusableElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            });
            modal.dataset.lastFocused = lastFocusedElement.id || lastFocusedElement.dataset.modalTrigger || 'unknown';
        }
    }

    function hideModal(modalId) {
        var modal = document.getElementById(modalId);
        var modalDialog = modal.querySelector('.modal-dialog');

        modalDialogMap[modalId] = modalDialog.cloneNode(true);

        // Remove video elements and store their src
        var videoElements = modalDialog.querySelectorAll('video');
        videoElements.forEach(function (videoElement) {
            var videoContainer = videoElement.parentNode;
            videoContainer.dataset.videoSrc = videoElement.src;
            videoElement.remove();
        });

        // Remove iframe elements and store their src
        var iframeElements = modalDialog.querySelectorAll('iframe');
        iframeElements.forEach(function (iframeElement) {
            var iframeContainer = iframeElement.parentNode;
            iframeContainer.dataset.iframeSrc = iframeElement.src;
            iframeElement.remove();
        });

        modal.classList.toggle('show', false);
        modal.style.display = 'none';
        modalBackdrop.classList.toggle('show', false);
        body.classList.toggle('modal-open', false);

        modal.removeEventListener('click', handleModalClick);

        cacheModalDialog();

        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('aria-hidden', 'true');

        // Return focus to the element that opened the modal
        const lastFocusedElementId = modal.dataset.lastFocused;
        if (lastFocusedElementId && lastFocusedElementId !== 'unknown') {
            const lastFocusedElement = document.getElementById(lastFocusedElementId) || 
                                      document.querySelector(`[data-modal-trigger="${lastFocusedElementId}"]`);
            if (lastFocusedElement) {
                lastFocusedElement.focus();
            }
        }
    }

    function handleModalClick(e) {
        var target = e.target;
        var modal = e.currentTarget;
        if (target.classList.contains('modal') || target.dataset.dismiss === 'modal') {
            hideModal(modal.id);
        }
    }

    modalButtons.forEach(function (button) {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            handleModalButton(button);
        });
        
        // Add keyboard event listener
        button.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleModalButton(button);
            }
        });
    });
}

function handleModalButton(button) {
    if (!button.dataset.modalTrigger) {
        button.dataset.modalTrigger = button.id || 'modal-trigger-' + Math.random().toString(36).substr(2, 9);
    }
    
    if (button.dataset.dismiss === 'modal') {
        var modal = button.closest('.modal');
        hideModal(modal.id);
        return;
    }
    var modalId = button.getAttribute('data-target').replace('#', '');
    showModal(modalId);
}

function equalHeight (elements, minHeight) {
	let maxHeight = 0;
	for (let i = 0; i < elements.length; i++) {
		const elementHeight = elements[i].clientHeight;
		maxHeight = Math.max(maxHeight, elementHeight);
	}
	for (let i = 0; i < elements.length; i++) {
		if (minHeight == false)
			elements[i].style.height = maxHeight + 'px';
		else
			elements[i].style.minHeight = maxHeight + 'px';
	}
}

const tabLinks = document.querySelectorAll('.nav-tabs .nav-link');

tabLinks.forEach(function (tabLink) {
	tabLink.addEventListener('click', function (e) {
		e.preventDefault();

		const target = e.target.closest(".nav-link");
		if (!target) return;

		const siblings = Array.from(target.closest('.nav-tabs').querySelectorAll('.nav-link'));
		siblings.forEach(function (link) {
			link.classList.remove('active');
			link.setAttribute('aria-selected', 'false');
		});

		target.classList.add('active');
		target.setAttribute('aria-selected', 'true');

		const tabContentId = target.dataset.tab

		const tabContents = document.querySelectorAll(`.tab-pane[data-tab="${tabContentId}"]`);

		if (!tabContents.length) return;


		tabContents.forEach(function (tabContent) {

			const tabContainer = tabContent.closest('.tab-content');
			const tabContentSiblings = Array.from(tabContainer.children);

			tabContentSiblings.forEach(function (content) {
				if (!Array.from(tabContents).includes(content)) {
					content.classList.remove('show', 'active');
				}
			});

			tabContent.classList.add('show', 'active');
		});


	});
});



/*
Example usage:
	let details;
	module.querySelectorAll(".details-group").forEach((detail) => {
		details = new Details(detail, {
			one_visible: detail.dataset.one
		});
	})
Recalculate height:
	details.render();
*/
class Details {
	constructor(el, settings) {
		this.group = el;
		this.details = this.group.getElementsByClassName("details");
		this.toggles = this.group.getElementsByClassName("details__summary");
		this.contents = this.group.getElementsByClassName("details__content");

		this.settings = Object.assign({
			speed: 500,
			one_visible: true
		}, settings);

		this.render();

		this.group.addEventListener("click", (e) => {
			const target = e.target.classList.contains("details__summary") ? e.target : e.target.parentNode;
			if (target.classList.contains("details__summary")) {
				e.preventDefault();

				let num = 0;
				for (let i = 0; i < this.toggles.length; i++) {
					if (this.toggles[i] === target) {
						num = i;
						break;
					}
				}

				if (!target.parentNode.hasAttribute("open")) {
					this.open(num);
				} else {
					this.close(num);
				}
			}
		});
	}

	render () {
		for (let i = 0; i < this.details.length; i++) {
			const detail = this.details[i];
			const toggle = this.toggles[i];
			const content = this.contents[i];

			detail.style.transitionDuration = this.settings.speed + "ms";

			if (!detail.hasAttribute("open")) {
				detail.style.height = toggle.offsetHeight + "px";
			} else {
				detail.style.height = toggle.offsetHeight + content.offsetHeight + "px";
			}
		}
	}

	open (i) {
		const detail = this.details[i];
		const toggle = this.toggles[i];
		const content = this.contents[i];

		if (this.settings.one_visible) {
			for (let a = 0; a < this.toggles.length; a++) {
				if (i !== a) this.close(a);
			}
		}

		detail.classList.remove("is-closing");
		const toggle_height = toggle.offsetHeight;
		detail.setAttribute("open", true);
		const content_height = content.offsetHeight;
		detail.removeAttribute("open");
		detail.style.height = toggle_height + content_height + "px";
		detail.setAttribute("open", true);
	}

	close (i) {
		const detail = this.details[i];
		const toggle = this.toggles[i];
		detail.classList.add("is-closing");
		const toggle_height = toggle.offsetHeight;
		detail.style.height = toggle_height + "px";
		setTimeout(() => {

			if (detail.classList.contains("is-closing"))
				detail.removeAttribute("open");
			detail.classList.remove("is-closing");
		}, this.settings.speed);
	}
}

document.querySelectorAll('.sr-video').forEach(container => {
	const video = container.querySelector('.responsive-video-file');
	const playButton = container.querySelector('.sr-play-button');
	if (!video || !playButton) return;

	if (playButton && !video.hasAttribute('autoplay') || playButton || (video.hasAttribute('autoplay') && video.hasAttribute('controls'))) {
		if(!video.hasAttribute('autoplay')) {
			playButton.style.display = 'flex';
		}
		playButton.addEventListener('click', () => {
			video.play();
			video.controls = true;
			playButton.remove();
		});
	}
});

function loadHubSpotForms() {
	// Select all form containers that haven't been marked as loaded or loading
	let unloadedForms = document.querySelectorAll('.form-container:not([data-loaded]), .form-container[data-loaded="loading"]');

	unloadedForms.forEach(formContainer => {
		const rect = formContainer.getBoundingClientRect();
		// Check if the form container is within the viewport
		if (rect.top < window.innerHeight && rect.bottom >= 0) {
			// Set the container as loading to prevent multiple triggers
			if (formContainer.getAttribute('data-loaded') !== 'loading') {
				formContainer.setAttribute('data-loaded', 'loading');

				// Load the HubSpot script if it hasn't been loaded yet
				if (!window.hsScriptLoaded) {
					window.hsScriptLoaded = true; // Indicate that the script has been loaded
					const hsScript = document.createElement('script');
					hsScript.async = true; // Ensure the script loads asynchronously to avoid blocking the page
					hsScript.src = '//js.hsforms.net/forms/embed/v2.js';
					hsScript.onload = function () {
						createHubSpotForm(formContainer); // Create the HubSpot form
					};
					document.body.appendChild(hsScript); // Append the script to the body
				} else {
					// If the HubSpot script is already loaded, create the form immediately
					createHubSpotForm(formContainer);
				}
			}
		}
	});

	function createHubSpotForm(formContainer) {
		// Ensure the form is created only once
		if (formContainer.getAttribute('data-loaded') !== 'loading') return;

		console.log("tst");

		// Retrieve necessary data attributes for the form creation
		const portalId = formContainer.getAttribute('data-portalid');
		const target = formContainer.getAttribute('data-target');
		const formId = formContainer.getAttribute('data-formid');
		// Create the HubSpot form with the specified parameters
		if ((typeof hbspt === 'undefined')) return;
		hbspt.forms.create({
			portalId,
			formId,
			target
		});
		// Mark the container as loaded to avoid reloading
		formContainer.setAttribute('data-loaded', 'true');

		// Update the list of unloaded forms
		unloadedForms = document.querySelectorAll('.form-container:not([data-loaded="true"])');
		// If all forms are loaded, remove the scroll event listener and log a message
		if (unloadedForms.length === 0) {
			window.removeEventListener('scroll', loadHubSpotForms);
			console.log("all forms loaded");
		}
	}
}

// Attach a scroll event listener to load forms when they enter the viewport
window.addEventListener('scroll', loadHubSpotForms);

// Check immediately on page load in case any forms are in view
loadHubSpotForms();