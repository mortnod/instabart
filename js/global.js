$(function() {
  // Add "hover" to the card in focus
  $(".no-touch .front").hover(
    function(){
      $(this).addClass("hover");
      $(this).find(".flip-button").show();
    },
    function(){
      $(this).removeClass("hover");
      $(this).find(".flip-button").hide();
    }
  );

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
});