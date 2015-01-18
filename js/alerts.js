/*
  ALERT EXAMPLE (First element in #grid):
  <div class="alert">
      <img class="alert-icon" src="img/alert-scissor.svg" alt="Champagne til alle!">
    <i class="close"></i>
    <h3>Høstbarbering 2014</h3>
    <p>Vi har trimmet vekk en del lenker, og fire nye har grodd fram i stedet! De gamle finner du bak <i class="question alert-inline-icon"></i>-knappen øverst til høyre.</p>
    <div style="clear:both;"></div>
  </div> -->
*/

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