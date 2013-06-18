$(function() {
  var taglines =
  [
    "Kjekke NTNU-tjenester. Umiddel<strong>bart</strong>.",
    "Favoritt blant bartebyens studenter siden 1917!",
    "NTNU-studenter flest har ikke kjennskap til halvbarten av disse linkene",
    "Hele NTNU samlet under én bart!",
    "Dekker alle dine behov som NTNU-student... bortsett fra kaffe",
    "La barten bane vei i NTNUs frodige IT-jungel!"
  ];

  function random_tagline(){
    id = Math.floor(Math.random()*taglines.length);
    return taglines[id];
  }

  function css_flip(){
    $('.flip-button').click(function(){
      var card = $(this).parent().parent();
      if (card.hasClass('flipped')){
        card.removeClass('flipped');
      }
      else {
        $('.flipped').removeClass('flipped');
        card.addClass('flipped');
      }
      return false;
    });
  }

  function jquery_flip(){
    var box_width = $('.linkbox').width();
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
    card.animate(css_properties["compress"], 100, function() {
      $(this).hide();
      // animate second card to full width and margin-top to 0
      $(this).siblings('.linkbox').show().animate(css_properties["decompress"], 100);
    });
  }

  // Add "hover" to the linkbox in focus
  $(".no-touch .front").hover(
    function(){
      $(this).addClass("hover");
      $(this).find(".flip-button").show();
    },
    function(){
      $(this).removeClass("hover");
      $(this).find(".flip-button").hide();
    }
  );

  // Decide whether to use css or jquery to do the card flipping
  if (Modernizr.csstransforms3d){
    css_flip();
  }
  else {
    jquery_flip();
  }

  $("#tagline").html(random_tagline());

});