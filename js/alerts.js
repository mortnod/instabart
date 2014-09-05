Alerts = {

  init: function() {
    Alerts.bindCloseButton();
  },

  bindCloseButton: function() {
    $('.alert .close').click(function(){
      $('.alert').fadeOut(function() {
        $('#grid').removeClass('alert-padding');
      });
    });
  }
};