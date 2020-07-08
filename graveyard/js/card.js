var s,
Card = {

  settings: {
    cards: null,
    infoBtn: null,
    jqueryFlip: {
      shrink: null,
      expand: null
    }
  },

  init: function() {
    s = this.settings;
    this.createCards(function(){
      // Initialize some settings variables
      s.cards = $('.card');
      s.infoBtn = $('.flip-button');

      // jQuery flip setup
      if (!Modernizr.csstransforms3d || !Modernizr.csstransformspreserve3d){
        Card.setJQueryFlipSettings();
        $(".back")
          .css(s.jqueryFlip.shrink)
          .hide();
      }

      Card.bindUIActions();
      Card.resizeCards();
    });
  },

  createCards: function(callback) {
    var template = Handlebars.templates['card'];
    for (var i = 0; i < data.cards.length; i++) {
      var html = template(data.cards[i]);
      $('#grid').append(html);
    }

    callback();
  },

  bindUIActions: function(){
    $(window).resize(function() {
      // Resize the cards if the browser window is resized
      Card.resizeCards();

      // Insert intelligent comment here
      if (!Modernizr.csstransforms3d || !Modernizr.csstransformspreserve3d){
        Card.setJQueryFlipSettings();
      }
    });

    // Animation when a card is clicked
    Card.cardClickedAnimation();

    // Flip card by clicking the info button
    s.infoBtn.click(function(){
      if (Modernizr.csstransforms3d && Modernizr.csstransformspreserve3d){
        Card.flipCardWithCSS($(this));

      } else {
        Card.flipCardWithJQuery($(this));
      }
    });

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

  flipCardWithCSS: function(infoBtn){
    // Display the back of the cards (hidden by default to prevent flashing on load)
    $(".back").show();

    var cardContent = infoBtn.parents('.content');

    // If this card is already flipped, then just flip it back
    if (cardContent.hasClass('flipped')){
      cardContent.removeClass('flipped');
    }
    // Else, flip all cards that have already been flipped, then flip this card
    else {
      $('.flipped').removeClass('flipped');
      cardContent.addClass('flipped');
    }
    return false;
  },

  flipCardWithJQuery: function(infoBtn){
    var cardFace = infoBtn.parent();
    var previouslyFlippedCard = $('.back:visible');

    if (cardFace.hasClass('back')) {
      Card.animateJQueryFlip(previouslyFlippedCard);
    }
    else {
      Card.animateJQueryFlip(previouslyFlippedCard);
      Card.animateJQueryFlip(cardFace);
    }
  },

  animateJQueryFlip: function(cardFace) {
    var otherCardFace = cardFace.siblings('.cardface');

    cardFace.animate(s.jqueryFlip.shrink, 100, function() {

      cardFace.hide();
      otherCardFace.show();

      otherCardFace.animate(s.jqueryFlip.expand, 100, function(){
        $(this).width('');
      });
    });
  },

  setJQueryFlipSettings: function() {
    s.jqueryFlip.shrink = {
      width: 0,
      marginLeft: s.cards.width() / 2 + 'px',
      opacity: 0.4
    };

    s.jqueryFlip.expand = {
      width: s.cards.width() + 'px',
      marginLeft: 0,
      opacity: 1
    };
  }
};
