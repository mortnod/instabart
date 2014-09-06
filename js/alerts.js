Alerts = {

  init: function() {
    if (Schedule.supportsLocalStorage()) {
      if(this.shouldAlertBeDisplayed()) {
        this.displayAlert();
      }
    }
  },

  shouldAlertBeDisplayed: function() {
    if (localStorage['alert_closed'] === undefined) {
      return true;
    }
    else {
      return !JSON.parse(localStorage['alert_closed']);
    }
  },

  displayAlert: function() {
    $('.alert').show();
    $('#grid').addClass('alert-padding');
    Alerts.bindCloseButton();
  },

  bindCloseButton: function() {
    $('.alert .close').click(function(){
      localStorage['alert_closed'] = 'true';
      $('.alert').fadeOut(function() {
        $('#grid').removeClass('alert-padding');
      });
    });
  },
};