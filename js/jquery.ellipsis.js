(function($) {
	// Shell for your plugin code
	$.fn.ellipsis = function(options) {
		var settings = {
			'size' : 4,
			'expand' : true
		};

		if(options) {
			$.extend( settings, options );
		}

		return this.each(function(){
			s = $(this).html();
			$(this).attr('title', s);
			if(s.length > settings.size) {
				s = s.substring(0, settings.size - 1) + ' ...';
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


