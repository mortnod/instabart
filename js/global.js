// Locale storage for schedule
function supportsLocalStorage(){
  return Modernizr.localstorage;
}

function hasClickedScheduleBefore(){
  if (localStorage['schedule_clicked'] == null){
    return false;
  }
  else {
    return JSON.parse(localStorage['schedule_clicked']);
  }
}

function setScheduleLink(){
  if (localStorage['schedule_name']){
    var link = $('#schedule a').prop('href');
    $('#schedule a').prop('href', link + localStorage['schedule_name']);
  }
}

function closeModal(modal_id){
  $("#lean_overlay").fadeOut(200);
  $(modal_id).css({ 'display' : 'none' });
}

function displayModal(modal_id){
  $('#lean_overlay').css({ 'display' : 'block', opacity : 0 });
  $('#lean_overlay').fadeTo(200,0.7);
  $(modal_id).css({'display': 'block', 'position': 'absolute', 'opacity': 1, 'z-index': 11000, 'top': '0px'});
  $(modal_id).fadeTo(200,1);
  $("#lean_overlay").click(function() {
    closeModal(modal_id);
  });
  $(".modal_close").click(function() {
    closeModal(modal_id);
  });
}

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


  
  if (supportsLocalStorage()){
    if (hasClickedScheduleBefore()){
      setScheduleLink();
    }
    else {
      // localStorage['schedule_clicked'] = true;
      $("#schedule a").click(function(e){
        displayModal('#schedule_settings');
        localStorage['schedule_clicked'] = false;
        e.preventDefault();
      });
    }
  }

  $('#dergen').val(localStorage['schedule_name']);
  $('#dergen').bind('input', function() {
    localStorage['schedule_name'] = $(this).val();
  });
});