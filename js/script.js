// JavaScript Document

$(document).ready(function() {
	var move = function() {
        var st = $(window).scrollTop();
        var ot = $("#header-anchor").offset();
        var s = $(".header");
        if(st > ot) {
            s.css({
                position: "fixed",
                top: "0px"
            });
        } else {
            if(st <= ot) {
                s.css({
                    position: "absolute",
                    top: ""
                });
            }
        }
    };
    $(window).scroll(move);
    move();




	$('.workitem').click(function() {
	  var href = $(this).attr('href');
	  $("" +href+ "").slideDown();
	  $("" +href+ "").removeClass('hidden');
	});


});/*onLoad*/




$(function(){
    $('a[href*=#]').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
      && location.hostname == this.hostname) {
            var $target = $(this.hash);
            $target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
            if ($target.length) {
                var targetOffset = $target.offset().top;
                $('html,body').animate({
					scrollTop: targetOffset-100
				}, 900, 'easeInOutQuint');
                return false;
            }
        }
    });
});




/*-------------Map-------------*/
