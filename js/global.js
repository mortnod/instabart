$(function() {
  // Make it look like the cards are pressed down on click
  $(".front a").mousedown(function(){
    $(this).parents('.card').addClass('active');
  });

  // Snap the card back to place. This happens when the mouse is released
  // or when you click and drag outside out of the cards area
  $('.card').mouseleave(function(){
    $('.card').removeClass('active');
  }).mouseup(function(){
    $('.card').removeClass('active');
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