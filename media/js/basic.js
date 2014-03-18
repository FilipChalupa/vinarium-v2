$(function () {
	var homepage = 'http://forhaus.cz',
		language = 'cs',
		$slogans = $('.slogan'),
		$buttons = $('.button'),
		$views = $('#views .view'),
		$goHome = $('#go-home'),
		$languages = $('#languages .button'),
		$window = $(window);
	function onWindowResize() {
		
	}
	$window.resize(function(){
		onWindowResize();
	});
	onWindowResize();
	function replaceDots(){
		$slogans.each(function(){
			var $this = $(this);
			$this.html($this.html().split('∙').join('<span class="dot"></span>'));
		});
	}
	replaceDots();
	$buttons.click(function(){
		var actions = $(this).data('action').split(';');
		$.each(actions,function(key,val){
			var data = val.split('-');
			action(data[0],data[1]);
		});
	});
	function action(name,param) {
		switch (name) {
			case 'language':
				language = param;
				$languages.each(function(){
					var $this = $(this);
					$this.toggleClass('selected',$this.data('value') === language);
				});
				$.each(lang[language], function(key, val) {
					$('*[data-trans='+key+']').text(val);
				});
				replaceDots();
				break;
			case 'view':
				$views.each(function(){
					var $this = $(this);
					$this.toggleClass('show',$this.data('name') === param);
				});
				$goHome.toggleClass('show',param !== 'home');
				break;
			default:
				alert(name + ' - ' + param);
		}
	}
	action('view','home');
	action('language',language);

});
