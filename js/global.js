// Add "hover" to the linkbox in focus
$(".linkbox").hover(
	function(){
		$(this).addClass("hover");
		$(this).find(".info").show();
	},
	function(){
		$(this).removeClass("hover");
		$(this).find(".info").hide();
	}
);

// Puts the F in flip
$('.info').click(function(){
  $(this).parent().parent().addClass('flipped');
  return false;
});

$('.close').click(function(){
  $(this).parent().parent().removeClass('flipped');
  return false;
});