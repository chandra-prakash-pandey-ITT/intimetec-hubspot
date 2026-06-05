

<script>
document.addEventListener("DOMContentLoaded", function(){

  const module = document.querySelector(".itt-featured-blogs");
  if(!module) return;

  const slider = module.querySelector(".itt-blog-listing");
  const next = module.querySelector(".itt-slider-next");
  const prev = module.querySelector(".itt-slider-prev");

  const card = slider.querySelector(".itt-blog-grid");
  const gap = 20;

  const scrollAmount = card.offsetWidth + gap;

  next.addEventListener("click", () => {
    slider.scrollBy({
      left: scrollAmount,
      behavior: "smooth"
    });
  });

  prev.addEventListener("click", () => {
    slider.scrollBy({
      left: -scrollAmount,
      behavior: "smooth"
    });
  });

});
</script>