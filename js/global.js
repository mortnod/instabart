function css_flip(){
  $('.flip-button').click(function(){
    $(this).parent().parent().toggleClass('flipped');
    return false;
  });
}

function jquery_flip(){
  var box_width = $('.linkbox').width();
  var margin = box_width / 2 + 'px';
  box_width += 'px';
  var compress_css_properties = {
      height: 0,
      marginTop: margin,
      opacity: 0.4
  };
  var decompress_css_properties = {
      height: box_width,
      marginTop: 0,
      opacity: 1
  };

  $(".back").css(compress_css_properties);
  $(".back").hide();

  //animate width to 0 and margin-top to 1/2 width
  $('.flip-button').click(function(){
    $(this).parent().animate(compress_css_properties, 100, function() {
      $(this).hide();
      // animate second card to full width and margin-top to 0
      $(this).siblings('.linkbox').show().animate(decompress_css_properties, 100);
    });
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
  jquery_flip(this);
}