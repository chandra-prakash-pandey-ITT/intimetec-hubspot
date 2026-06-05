$(document).ready(function() {
    $('#blogSearchInput').on('input', function() {
      var searchText = $(this).val().toLowerCase().substring(0, 4);

      // Hide all blog posts
      $('.itt-blog-post').hide();

      // Show blog posts where the first four letters in the name match the search text
      $('.itt-blog-post').filter(function() {
        var firstFourLetters = $(this).find('h2').text().toLowerCase().substring(0, 4);
        return firstFourLetters === searchText;
      }).show();
    });
  });