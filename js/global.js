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

  // Add the class "hover" to the social wells. 
  // This will change the color of the icon.
  $(".social .well").hover(
    function(){
      $(this).addClass("hover");
    },
    function(){
      $(this).removeClass("hover");
    }
  );

  // If the browser doesn't support css filters, switch between normal and black/white versions manually
  $(".no-cssfilters #bartebuss img").attr("src", "img/bartebuss-bw.png");
  $(".no-cssfilters #notifier img").attr("src", "img/online-notifier-bw.png");

  $(".no-cssfilters #bartebuss").hover(
    function(){
      $("#bartebuss img").attr("src", "img/bartebuss.png");
    },
    function(){
      $("#bartebuss img").attr("src", "img/bartebuss-bw.png");
    }
  );

  $(".no-cssfilters #notifier").hover(
    function(){
      $("#notifier img").attr("src", "img/online-notifier.png");
    },
    function(){
      $("#notifier img").attr("src", "img/online-notifier-bw.png");
    }
  );


  // Keep the 1:1 ratio
  var card_width = $('.card').outerWidth();
  $('.card').css({'height':card_width+'px'});

  $(window).resize(function() {
    card_width = $('.card').outerWidth();
    $('.card').css({'height':card_width+'px'});
  });
});