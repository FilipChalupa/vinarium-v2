$(function () {
	var homepage = 'http://forhaus.cz'/*'http://localhost/vinarium-v2'*/,
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
		$eventDetail = $('#events .detail'),
		$eventDetailChildren = {
			'title': $eventDetail.find('.title'),
			'date': $eventDetail.find('.date'),
			'wrapper': $eventDetail.find('.wrapper'),
			'photos': $eventDetail.find('.photos'),
		},
		$aboutUsOptions = $('#aboutus .options .button'),
		$aboutUsDetail = $('#aboutus .detail'),
		$feedback = $('#feedback'),
		$feedbackForm = $feedback.find('form'),
		$feedbackScores = $feedbackForm.find('.score'),
		$feedbackHands = $feedbackScores.find('.button'),
		updateTimer = false,
		apiSource = [
			{
				'name': 'events',
				'url': '/events/'
			}
		],
		apiIndexUpdate = 0,
		ajax = false;

	function updateData() {
		updateTimer = setTimeout(function(){
			//apiSource[apiIndexUpdate];
			console.log(apiIndexUpdate);
			apiIndexUpdate++;
			//updateData();
		},200);
	}
	function setAboutContent() {
		$aboutUsDetail.find('.title').text('Title');
		$aboutUsDetail.find('.content').html('Content');
		$aboutUsDetail.find('.prev .preview').html('Předchozí');
		$aboutUsDetail.find('.next .preview').html('Další');
	}
	$feedbackHands.click(function(){
		var $hand = $(this);
		$feedbackScores.each(function(){
			var $score = $(this);
			if ($score.data('id') === $hand.data('id')) {
				$score.find('.button').removeClass('selected');
				return false;
			}
		});
		$hand.addClass('selected');
	});
	$aboutUsOptions.click(function(){
		setAboutContent();
	});
	$feedbackForm.submit(function(event){
		event.preventDefault();
		var data = $feedbackForm.serializeArray();
		console.log(data);
		$.post( homepage+'/post/feedback/', function(data) {
			alert( "success" );
			action('view','feedback');
		})
		.fail(function() {
			alert( "error" );
		})
		.always(function() {
			alert( "finished" );
		});
	});
	/*function onWindowResize() {

	}
	$window.resize(function(){
		onWindowResize();
	});
	onWindowResize();*/
	function replaceDots(){
		$slogans.each(function(){
			var $this = $(this);
			$this.html($this.html().split('∙').join('<span class="dot"></span>'));
		});
	}
	replaceDots();
	$aboutUsOptions.click(function(){
		$aboutUsOptions.removeClass('selected');
		$(this).addClass('selected');
	});
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
				if (param === 'home') {
					if (updateTimer === false) {
						updateData();
					}
				} else {
					if (updateTimer !== false) {
						window.clearTimeout(updateTimer);
						updateTimer = false;
					}
					if (param === 'events') {
						$eventsList.find('.button:first').trigger('click');
					} else if (param === 'aboutus') {
						$aboutUsOptions.first().trigger('click');
					} else if (param === 'feedback') {
						$feedbackHands.removeClass('selected');
						$feedbackScores.removeClass('voted');
						$feedbackForm.trigger('reset');
					}
				}
				$goHome.toggleClass('show',param !== 'home');
				break;
			case 'event':
				$eventDetailChildren.title.text(lang[language][25]);
				$eventDetailChildren.date.text('');
				$eventDetailChildren.wrapper.html('');
				$eventDetailChildren.photos.html('');
				//ajax
				if (ajax) {
					ajax.abort();
				}
				ajax = $.getJSON( homepage + '/api/json_event/'+param+'?callback=?', function(data) {
					$eventDetailChildren.title.text(data['title_'+lang]);
					$eventDetailChildren.date.text(data['date']+' - '+data['date_to']);
					$eventDetailChildren.wrapper.html(data['content_'+lang]);
					//photos!!
				})
				.fail(function() {
					$eventDetailChildren.title.text(lang[language][26]);
				})
				.always(function() {
					ajax = false;
				});
				break;
			case 'aboutgroup':

				break;
			case 'about':
				if (param === 'prev') {
					setAboutContent();
					alert('previous');
				} else {
					setAboutContent();
					alert('next');
				}
				break;
			case 'feedbacksubmit':
				$feedbackForm.submit();
				break;
			case 'vote':
				$feedbackScores.each(function(){
					var $this = $(this);
					if ($this.data('id') == param) {
						$this.addClass('voted');
					}
				});
				break;
			default:
				alert(name + ' - ' + param);
		}
	}
	action('view','events');
	action('language',language);

});
