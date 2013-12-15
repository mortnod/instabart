$(function() {
  // Make it look like the buttons are pressed down on click
  $(".front a").mouseup(function(){
    var flip_box = $(this).parent().parent().parent();
    flip_box.css("top", "0");
    flip_box.css("left", "0");
  }).mousedown(function(){
    var flip_box = $(this).parent().parent().parent();
    flip_box.css("top", "2px");
    flip_box.css("left", "1px");
  });

  // Displays the modal when the question button is clicked
  $('#about-button').leanModal({ top : 0, overlay: 0.7, closeButton: ".modal_close" });

  // Keep the 1:1 ratio
  var card_width = $('.card').outerWidth();
  $('.card').css({'height':card_width+'px'});

  $(window).resize(function() {
    card_width = $('.card').outerWidth();
    $('.card').css({'height':card_width+'px'});
  });
});