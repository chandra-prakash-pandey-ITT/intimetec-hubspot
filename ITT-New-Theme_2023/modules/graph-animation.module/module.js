document.addEventListener('DOMContentLoaded', function() {
  var target = document.querySelector('.itt-graph');   
  
  var observer = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var bgAnimateElements = document.querySelectorAll('.bg-animate');
        bgAnimateElements.forEach(function(element) {
          element.classList.add('animate');
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(target);
});