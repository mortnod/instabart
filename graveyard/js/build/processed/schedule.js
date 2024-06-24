var Schedule = {

  init: function() {
    if (this.supportsLocalStorage()) {
      if (this.firstTimeSetupCompleted()) {
        this.setScheduleLink();
      }
      else {
        $("#schedule a").click(Schedule.displaySettingsOnClick);
      }

      this.addSettingsButton();
      this.bindUIActions();
      // Fill in the remembered schedule name
      $('#schedule_name').val(localStorage['schedule_name']);
    }
  },

  supportsLocalStorage: function() {
    return Modernizr.localstorage;
  },

  firstTimeSetupCompleted: function() {
    if (localStorage['schedule_clicked'] === undefined){
      return false;
    }
    else {
      return JSON.parse(localStorage['schedule_clicked']);
    }
  },

  setScheduleLink: function() {
    var scheduleName = localStorage['schedule_name'].toLowerCase();
    var scheduleURL = 'http://ntnu.1024.no/' + scheduleName;
    $('#schedule a').prop('href', scheduleURL);
  },

  addSettingsButton: function() {
    var html = '<i id="schedule-settings-button" class="cogwheel"></i>';
    $('#schedule .front').append(html);
  },

  inputValid: function() {
    return $('#schedule_name').val() !== '';
  },

  saveAndRedirect: function(name) {
    localStorage['schedule_clicked'] = "true";
    localStorage['schedule_name'] = name;
    this.setScheduleLink();

    // Clicking the card takes you to the schedule instead of the settings
    $("#schedule a").unbind('click', Schedule.displaySettingsOnClick);
    Modal.hide('#schedule_settings');

    setTimeout(function() {
      document.location.href = $('#schedule a').prop('href');
    }, 100);
  },

  displaySettingsOnClick: function(e) {
    Modal.show('#schedule_settings');
    $('#schedule_name').removeClass('error');
    e.preventDefault();
  },

  bindUIActions: function() {
    // When 'cogwheel' icon is clicked, open the modal
    $('#schedule-settings-button').click(function(){
      Modal.show('#schedule_settings');
      $('#schedule_name').removeClass('error');
      // Fill in the remembered schedule name
      $('#schedule_name').val(localStorage['schedule_name']);
    });

    // When 'no' button is clicked, forget schedule name and redirect
    $('#schedule-no-button').click(function(){
      Analytics.trackScheduleAnswerNo();
      Schedule.saveAndRedirect('');
    });

    // When 'yes' button is clicked, either save the
    // schedule name and redirect or display an error
    $('#schedule-yes-button').click(function(){
      if (Schedule.inputValid()){
        Analytics.trackScheduleAnswerYes();
        var scheduleName = $('#schedule_name').val();
        Schedule.saveAndRedirect(scheduleName);
      }
      else {
        $('#schedule_name').addClass('error');
      }
    });

    // When 'enter' is pressed, remember schedule name and redirect
    $("#schedule_name").keypress(function(e){
      if (e.which == 13) {
        e.preventDefault();
        if (Schedule.inputValid()){
          Analytics.trackScheduleAnswerYes();
          var scheduleName = $('#schedule_name').val();
          Schedule.saveAndRedirect(scheduleName);
        }
        else {
          $('#schedule_name').addClass('error');
        }
      }
    });
  }
};