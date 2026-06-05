document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.sr-clients-carousel-01 .splide').forEach(el => {
        new Splide(el, {
			pauseOnHover: false,
			pauseOnFocus: false,
            arrows: false,
            pagination: el.dataset.pagination == 'true' ? true : false,
            autoplay: el.dataset.autoplay == 'true' ? true : false,
            interval: +el.dataset.autoplayspeed * 1000,
            type: 'loop',
            focus: 'center',
            gap: '30px',
            perPage: +el.dataset.perpage,
            padding: '0',
            type: el.dataset.fade == 'true' ? "fade" : "loop",
            rewind: el.dataset.fade == 'true' ? true : false,
            snap: el.dataset.scroll == 'true' ? false : true,
            autoScroll: {
                speed: +el.dataset.scrollspeed,
            },

            breakpoints: {
				1200: {
                   perPage: 5,
                },
                993: {
					perPage: 5,
                    arrows: false
                },
				767: {
					perPage: 3,
                    arrows: false
                }
            }
        }).mount(el.dataset.scroll == 'true' ? window.splide.Extensions : null);
    });
})