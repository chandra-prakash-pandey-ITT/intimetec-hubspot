  $(".slick-slider").slick({
   slidesToShow: 4,
   infinite:true,
   slidesToScroll: 1,
   autoplay: true,
   autoplaySpeed: 3000,
     dots: true,
    // arrows: false, Boolean
    
    responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 680,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ]
  });


// Image Slider Demo:
// https://codepen.io/vone8/pen/gOajmOo