$(function(){
	$(".method-row").click(function(e) {
		var r = $(this);
		$("div.method-extended", this).slideDown("fast", function() {
			r.addClass("expanded");
		});
	});
	$(".toggler", ".toggle-wrap").click(function(e) {
		e.preventDefault();
		e.stopPropagation();
		var v = $(this).closest(".toggle-wrap");
		$("div.method-extended", v).slideToggle("fast", function() {
			if ($(this).is(":hidden"))
				v.removeClass("expanded");
			else
				v.addClass("expanded");
		});
		$(this).blur();
	});
	
	$("#toggle-column").click(function(e) {
		e.preventDefault();
		e.stopPropagation();
		var m = $("#main-column");
		if (m.hasClass('pure-u-md-2-3')) {
			m.removeClass('pure-u-md-2-3');
			$("#side-column").removeClass('pure-u-md-1-3');
			$("#toggle-column").css('right', '0');
		}
		else {
			m.addClass('pure-u-md-2-3');
			$("#side-column").addClass('pure-u-md-1-3');
			$("#toggle-column").css('right', '-1em');
		}
		$(this).blur();
	});
});
