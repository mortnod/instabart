// Add "hover" to the linkbox in focus
$(".linkbox").hover(
	function(){
		$(this).addClass("hover");
	},
	function(){
		$(this).removeClass("hover");
	}
);