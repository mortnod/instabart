var s,
Card = {

  settings: {
    cards: null
  },

  init: function() {
    s = this.settings;
    this.createCards(function(){
      // Initialize some settings variables
      s.cards = $('.card');

      Card.bindUIActions();
      Card.resizeCards();
    });
  },

  createCards: function(callback) {
    var template = Handlebars.templates['card'];
    for (i = 0; i < data.cards.length; i++) {
      var html = template(data.cards[i]);
      $('#grid').append(html);
    }

    callback();
  },

  bindUIActions: function(){
    $(window).resize(function() {
      Card.resizeCards();
    });

    Card.cardClickedAnimation();
  },

  resizeCards: function(){
    var width = s.cards.outerWidth();
    s.cards.css('height',width);
  },

  cardClickedAnimation: function(){
    // Mouse button clicked
    $(".front a").mousedown(function(){
      $(this).parents('.card').addClass('active');
    });

    // Mouse button released
    s.cards.on('mouseleave mouseup', function(){
      $(this).removeClass('active');
    });
  },
};