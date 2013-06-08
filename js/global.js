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
  var box_height = $('.linkbox').height();
  var margin = box_height / 2 + 'px';
  box_height += 'px';

  var compress = {
      height: 0,
      marginTop: margin,
      opacity: 0.4
  };
  var decompress = {
    height: box_height,
    marginTop: 0,
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
$(".front").hover(
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