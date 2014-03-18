$(function () {
	var homepage = 'http://forhaus.cz',
		language = 'cs',
		$slogans = $('.slogan'),
		$buttons = $('.button'),
		$views = $('#views .view'),
		$goHome = $('#go-home'),
		$languages = $('#languages .button'),
		$window = $(window),
		$liveButtons = $('.live-buttons'),
		$eventsList = $('#events .list'),
		$eventsListUpcoming = $eventsList.find('.upcoming'),
		$eventsListPast = $eventsList.find('.past'),
		$eventDetail = $('#events .detail');
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

	$liveButtons.on('click','.button',function(){
		buttonPress($(this));
	});
	$buttons.click(function(){
		buttonPress($(this));
	});
	function buttonPress($this) {
		var actions = $this.data('action').split(';');
		$.each(actions,function(key,val){
			var data = val.split('-');
			action(data[0],data[1]);
		});
	}
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
				if (param === 'events') {
					$eventsList.find('.button:first').trigger('click');
				}
				$goHome.toggleClass('show',param !== 'home');
				break;
			case 'event':
				$eventDetail.find('.title').text('Nadpis ' + param);
				$eventDetail.find('.date').text('datum');
				$eventDetail.find('.wrapper').html('popis');
				$eventDetail.find('.photos').html('fotky');
				break;
			default:
				alert(name + ' - ' + param);
		}
	}
	action('view','events');
	action('language',language);

});
