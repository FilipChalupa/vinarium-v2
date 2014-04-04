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
		$specialProduct = $('#specials .product'),
		$specialsList = $('#specials .items'),
		$stableMenuProduct = $('#stablemenu .product'),
		$stableMenuList = $('#stablemenu .items'),
		updateTimer = false,
		apiSource = [
			{
				'name': 'events',
				'url': '/events/'
			}
		],
		apiIndexUpdate = 0,
		ajax = false;

	function setProductWrapper($parent, xTitle, xFancy, xText, xGoodWTitle, xGoodWText, xValsTitle, xValsText) {
		var title = $parent.find('.title'),
			fancy = $parent.find('.fancy'),
			text = $parent.find('.text'),
			goodWithText = $parent.find('.good_with .subtext'),
			valsText = $parent.find('.vals .subtext');
		title.text(xTitle);
		fancy.html(xFancy);
		text.html(xText);
		goodWithText.text(xGoodWText);
		valsText.text(xValsText);
	}
	function updateData() {
		updateTimer = setTimeout(function(){
			//apiSource[apiIndexUpdate];
			console.log('update '+apiIndexUpdate);
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
		$.post( homepage+'/post/feedback/', $feedbackForm.serializeArray(),function(data) {
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
				if (arguments[2] !== 'noHistory') {
					history.pushState({}, param, "#"+param);
				}
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
					} else if (param === 'specials') {
						$specialsList.find('.button:first').trigger('click');
					} else if (param === 'stablemenu') {
						$stableMenuList.find('.button:first').trigger('click');
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
				ajax = $.getJSON( homepage + '/api/json_event/'+param, function(data) {
					$eventDetailChildren.title.text(data['title_'+language]);
					$eventDetailChildren.date.text(data['date']+' - '+data['date_to']);
					$eventDetailChildren.wrapper.html(data['content_'+language]);
					var hasPhotos = false;
					for (var i=1;i<=4;i++) {
						if (data['photo_'+i]) {
							hasPhotos = true;
							$eventDetailChildren.photos.append('<div class="button img_'+i+'" style="background-image: url('+homepage+'/media/'+data['photo_'+i]+');" data-url="'+homepage+'/media/'+data['photo_'+i]+'"></div>');
						}
					}
					$eventDetail.toggleClass('hasPhotos',hasPhotos);
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
			case 'special':
				setProductWrapper($specialProduct,
								  'title',
								  'fancy',
								  'Lorem',
								  'čuník',
								  'hodně');
				break;
			case 'stable':
				setProductWrapper($stableMenuProduct,
								  'title',
								  'fancy',
								  'Lorem',
								  'čuník',
								  'hodně');
				break;
			default:
				alert(name + ' - ' + param);
		}
	}
	action('view','home','noHistory');
	function handleHash() {
		var hash = window.location.hash.substring(1),
			notFound = true;
		$views.each(function(){
			if ($(this).data('name') === hash) {
				action('view',hash,'noHistory');
				notFound = false;
				return false;
			}
		});
		if (notFound) {
			action('view','home');
		}
	}
	window.onhashchange = handleHash;
	handleHash();
	action('language',language);

});
