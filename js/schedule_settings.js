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

    $('#schedule .cardface.front').append('<i class="schedule-settings-button cogwheel"></i>')
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
});