// Add "hover" to the linkbox in focus
$(".linkbox").hover(
	function(){
		$(this).addClass("hover");
	},
	function(){
		$(this).removeClass("hover");
	}
);

// Puts the F in flip
$('.flip').click(function(){
  $(this).find('.card').addClass('flipped').mouseleave(function(){
    $(this).removeClass('flipped');
  });
  return false;
});