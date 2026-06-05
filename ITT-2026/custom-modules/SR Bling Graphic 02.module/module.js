document.querySelectorAll('.sr-bling-graphic-02 .blaze-slider').forEach(el => {
    new BlazeSlider(el, {
        all: {
            draggable: false,
            enableAutoplay: el.dataset.autoplay == 'true' ? true : false,
            autoplayInterval: +el.dataset.autoplayspeed * 1000,
            transitionDuration: 300,
            slideGap: '0px',
            slidesToShow: 5
        },
        '(max-width: 992px)': {
            slidesToShow: 3
        },
        '(max-width: 767px)': {
            slidesToShow: 2
        }
    })
})