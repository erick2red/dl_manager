(function($) {
	$.fn.ellipsis = function(options) {
		var settings = {
			'size' : 4,
			'expand' : true,
			'position' : 'middle'
		};

		if(options) {
			$.extend( settings, options );
		}

		return this.each(function(){
			s = $(this).html();
			$(this).attr('title', s);
			if(s.length > settings.size) {
				if(settings.position == 'middle') {
					s1 = s.substring(0, settings.size/2 - 1) + ' ... ';
					s2 = s.substring(s.length - settings.size/2);
					s = s1 + s2;
				} else if(settings.position == 'end'){
					s = s.substring(0, settings.size - 1) + ' ...';
				} else if(settings.position == 'end') {
					s = '... ' + s.substring(s.length - settings.size);
				}
				
				$(this).html(s);
				$(this).attr('short', s);
				if(settings.expand) {
					$(this).hover(function(){
						$(this).html($(this).attr('title'));
					}, function(){
						$(this).html($(this).attr('short'));
					});
				}
			}
		});
	}
})(jQuery);


