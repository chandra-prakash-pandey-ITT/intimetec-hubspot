$(document).ready(function() {
  $('.tag-link').on('click', function() {
    var selectedTag = $(this).data('tag');
    if (selectedTag === 'all') {
      $('.itt-blog-listing.all--category-posts-wrapper  .itt-blog-grid-new').show(); // Show all posts
      $('.itt-blog-listing.all--category-posts-wrapper  .itt-blog-grid-new').removeClass('super-active');
      $('.itt-blog-listing.all--category-posts-wrapper  .itt-blog-grid-new:lt(13)').addClass('active');
      $('.itt-blog-listing.all--category-posts-wrapper  .load-more').show(); // Show all posts
    } else {
      $('.itt-blog-listing.all--category-posts-wrapper .itt-blog-grid-new').hide();
      $('.itt-blog-listing.all--category-posts-wrapper  .itt-blog-grid-new').removeClass('active');
      $('.itt-blog-listing.all--category-posts-wrapper  .itt-blog-grid-new').removeClass('super-active');
      $('.itt-blog-listing.all--category-posts-wrapper  .itt-blog-grid-new[data-tags*="' + selectedTag + '"]').show();
      $('.itt-blog-listing.all--category-posts-wrapper  .itt-blog-grid-new[data-tags*="' + selectedTag + '"]').addClass('super-active');
    }
  });

  $('.tag-nav').click(function(){
    $('.itt-blog-listing.all--category-posts-wrapper').show();
    $('.itt-blog-listing.all-posts-wrapper').hide();
    $('.see-more-results').hide();
  });
  
  $('.all-nav').click(function(){
    $('.itt-blog-listing.all--category-posts-wrapper').hide();
    $('.itt-blog-listing.all-posts-wrapper').show();
    $('.see-more-results').show();
    $('.tag-nav').removeClass('active');
    $(this).addClass('active');
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const items = document.querySelectorAll('.all-post-item');
  const loadMoreButton = document.querySelector('.load-more');
  let currentIndex = 13;
  loadMoreButton.addEventListener('click', function () {
    for (let i = currentIndex; i < currentIndex + 13 && i < items.length; i++) {
      items[i].classList.add('active');
    }
    currentIndex += 13;
    if (currentIndex >= items.length) {
      loadMoreButton.style.display = 'none';
    }
  });
});

// Scroll Drag
const container = document.querySelector('#tagList');
 
let startX;
let scrollLeft;
let scrollTop;
let isDown;

container.addEventListener('mousedown',e => mouseIsDown(e));  
container.addEventListener('mouseup',e => mouseUp(e))
container.addEventListener('mouseleave',e=>mouseLeave(e));
container.addEventListener('mousemove',e=>mouseMove(e));

function mouseIsDown(e){
  isDown = true;
  startX = e.pageX - container.offsetLeft;
  scrollLeft = container.scrollLeft;
}
function mouseUp(e){
  isDown = false;
}
function mouseLeave(e){
  isDown = false;
}
function mouseMove(e){
  if(isDown){
    e.preventDefault();   
    //Move Horizontally
    const x = e.pageX - container.offsetLeft;
    const walkX = x - startX;
    container.scrollLeft = scrollLeft - walkX;

  }
}