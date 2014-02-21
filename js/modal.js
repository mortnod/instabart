var Modal = {

  init: function() {

  },

  show: function(id) {
    $(id).fadeIn(200);
    $("#lean_overlay").fadeTo(200, 0.7);

    // Close modal when clicking the background or close button
    $(".modal_close, #lean_overlay").click(function() {
      Modal.hide(id);
    });
  },

  hide: function(id) {
    $(id).fadeOut(100);
    $("#lean_overlay").fadeOut(200);
  }
}