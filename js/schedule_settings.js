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
  $('#schedule a').prop('href', 'http://ntnu.1024.no/' + localStorage['schedule_name'].toLowerCase());
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
    $('#schedule_name').removeClass('error');
  });

  // Fill the remembered schedule name into the input field
  $('#schedule_name').val(localStorage['schedule_name']);
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

function create_schedule_settings_event_listeners(){
  // When 'cogwheel' icon is clicked, open the modal
  $('#schedule-settings-button').click(function(){
    displayModal('#schedule_settings');
  });

  // When 'yes' button is clicked, either remember settings and redirect or display an error
  $('#schedule-yes-button').click(function(){
    if (schedule_input_is_valid()){
      remember_schedule_and_redirect();
    }
    else {
      $('#schedule_name').addClass('error');
    }
  });

  // When 'no' button is clicked, forget schedule name and redirect
  $('#schedule-no-button').click(function(){
    forget_schedule_and_redirect();
  });

  // Press enter == remember schedule name and redirect
  $("#schedule_name").keypress(function(event){
    if (event.which == 13) {
      event.preventDefault();
      if (schedule_input_is_valid()){
        remember_schedule_and_redirect();
      }
      else {
        $('#schedule_name').addClass('error');
      }
    }
  });
}

$(function() {
  if (supportsLocalStorage()){
    if (hasClickedScheduleBefore()){
      setScheduleLink();
    }
    else {
      $("#schedule a").click(function(event){
        displayModal('#schedule_settings');
        event.preventDefault();
      });
    }

    // Add the schedule settings button to the HTML
    $('#schedule .cardface.front').append('<i id="schedule-settings-button" class="cogwheel"></i>');

    create_schedule_settings_event_listeners();
  }
});