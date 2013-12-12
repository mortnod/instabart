$(function() {
  function css_flip(){
    $('.flip-button').click(function(){
      var card = $(this).parent().parent();
      // If this card is already flipped, then just flip it
      if (card.hasClass('flipped')){
        card.removeClass('flipped');
      }
      // Else, flip all cards that have already been flipped, then flip this card
      else {
        $('.flipped').removeClass('flipped');
        card.addClass('flipped');
      }
      return false;
    });
  }

  function jquery_flip(){
    var box_width = $('.cardface').width();
    var margin = box_width / 2 + 'px';
    box_width += 'px';

    var compress = {
      width: 0,
      marginLeft: margin,
      opacity: 0.4
    };
    var decompress = {
      width: box_width,
      marginLeft: 0,
      opacity: 1
    };

    var css_properties = {
      "compress":compress,
      "decompress":decompress
    };

    $(".back").css(compress);
    $(".back").hide();

    //animate width to 0 and margin-top to 1/2 width
    $('.flip-button').click(function(){
      var card = $(this).parent();
      if (card.hasClass('back')) {
        animate_jquery_flip($('.back:visible'), css_properties);
      }
      else {
        animate_jquery_flip($('.back:visible'), css_properties);
        animate_jquery_flip(card, css_properties);
      }
    });
  }

  function animate_jquery_flip(card, css_properties) {
    card.animate(css_properties.compress, 100, function() {
      $(this).hide();
      // animate second card to full width and margin-top to 0
      $(this).siblings('.cardface').show().animate(css_properties.decompress, 100, function(){
        $(this).css('width', '');
      });
    });
  }

  // Decide whether to use css or jquery to do the card flipping
  if (Modernizr.csstransforms3d && Modernizr.csstransformspreserve3d){
    css_flip();
  }
  else {
    jquery_flip();
  }

  // The back of the cards are hidden on load to prevent flashing the back.
  if (Modernizr.csstransforms3d && Modernizr.csstransformspreserve3d){
    // Only show back in browsers that supports css transforms, as the jquery_flip animation requires the back to be hidden
    $(".back").show();
  }
});