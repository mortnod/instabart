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
  $('#schedule a').prop('href', 'http://ntnu.1024.no/' + localStorage['schedule_name']);
}

function hideModal(modal_id){
  $(modal_id).fadeOut(100);
  $("#lean_overlay").fadeOut(200);
}

function displayModal(modal_id){
  $(modal_id).fadeIn(200);
  $('#lean_overlay').fadeTo(200, 0.7);
  $(".modal_close, #lean_overlay").click(function() {
    hideModal(modal_id);
  });
}

function schedule_input_is_valid() {
  return $('#schedule_name').val() !== '';
}

function remember_schedule_and_redirect(){
  localStorage['schedule_clicked'] = "true";
  localStorage['schedule_name'] = $('#schedule_name').val();
  setScheduleLink();
  setTimeout(function() {
      document.location.href = $('#schedule a').prop('href');
    }, 100);
}

function forget_schedule_and_redirect(){
  localStorage['schedule_clicked'] = "true";
  localStorage['schedule_name'] = '';
  setScheduleLink();
  setTimeout(function() {
      document.location.href = $('#schedule a').prop('href');
    }, 100);
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
      $("#schedule a").click(function(e){
        displayModal('#schedule_settings');
        localStorage['schedule_clicked'] = false; // should be true when finished developing
        e.preventDefault();
      });
    }

    $('.schedule-settings-button').click(function(){
      displayModal('#schedule_settings');
    });
    $('#schedule-yes-button').click(function(){
      if (schedule_input_is_valid()){
        remember_schedule_and_redirect();
      }
      else {
        $('#schedule_name').addClass('error');
      }
    });
    $('#schedule-no-button').click(function(){
      forget_schedule_and_redirect();
    });
    $('#schedule_name').val(localStorage['schedule_name']);
  }

});