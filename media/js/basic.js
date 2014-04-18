$(function () {
	var homepage = 'http://forhaus.cz'/*'http://localhost/vinarium-v2'*/,
		language = 'cs',
		temp,
		currentView = '',
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
		aboutUsIndex = 0,
		aboutUsSection = 'videos',
		$feedback = $('#feedback'),
		$feedbackForm = $feedback.find('form'),
		$feedbackScores = $feedbackForm.find('.score'),
		$feedbackHands = $feedbackScores.find('.button'),
		$weeklyList = $('#weekly .list'),
		$stableMenuFButtons = $('#stablemenu .items .type-f'),
		$stableMenuDButtons = $('#stablemenu .items .type-d'),
		$stableMenuDetailTitle = $('#stablemenu .product .title'),
		$stableMenuDetailList = $('#stablemenu .product .list'),
		$specialButton = $('#specialButton'),
		updateTimer = false,
		apiSource = [
			{
				'name': 'events',
				'url': '/cs/api/event/'
			},
			{
				'name': 'videos',
				'url': '/cs/api/videos/'
			},
			{
				'name': 'weekly_offer',
				'url': '/cs/api/weekly_offer/'
			},
			{
				'name': 'vineyards',
				'url': '/api/vineyards/'
			},
			{
				'name': 'wines',
				'url': '/api/wines/'
			},
			{
				'name': 'special',
				'url': '/cs/api/special_offer/'
			},
			{
				'name': 'menu_f',
				'url': '/cs/api/menu_structure/f'
			},
			{
				'name': 'menu_d',
				'url': '/cs/api/menu_structure/d'
			},
			{
				'name': 'feedbackScores',
				'url': '/api/average_feedback'
			}
		],
		apiIndexUpdate = 0,
		ajax = false;
	$.each(apiSource,function(key,val) {
		if (localStorage[val.name] === undefined) {
			localStorage[val.name] = '[]';
		}
	});
	function updateHomeSpecialButton() {
		$specialButton.toggleClass('hide',getFromStorage('special').length === 0);
	}
	function updateData() {
		updateTimer = setTimeout(function(){
			if (apiSource[apiIndexUpdate] === undefined) {
				apiIndexUpdate = 0;
			}
			$.get( homepage + apiSource[apiIndexUpdate].url, function(data) {
				localStorage[apiSource[apiIndexUpdate].name] = JSON.stringify(data);
				if (apiSource[apiIndexUpdate].name === 'special') {
					updateHomeSpecialButton();
				}
			})
			.always(function() {
				apiIndexUpdate++;
				if (updateTimer !== false) {
					updateData();
				}
			});
		},500);
	}
	function getFromStorage(name) {
		return JSON.parse(localStorage[name]);
	}
	function setAboutContent() {
		/*$aboutUsDetail.find('.title').text('Title');
		$aboutUsDetail.find('.content').html('Content');*/
		switch (aboutUsSection) {
			case 'videos':
				var videos = getFromStorage('videos');
				if (videos.length !== 0) {
					if (aboutUsIndex >= videos.length) {
						aboutUsIndex = 0;
					} else if (aboutUsIndex < 0) {
						aboutUsIndex = videos.length-1;
					}
					$aboutUsDetail.find('.title').text(videos[aboutUsIndex]['title_'+language]);
					$aboutUsDetail.find('.content').html('<iframe width="50" height="50" src="http://www.youtube.com/embed/'+videos[aboutUsIndex]['get_code']+'" frameborder="0" allowfullscreen></iframe>');
				}
				break;
			case 'articles':

				break;
			case 'suggestions':

				break;
		}
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
	$feedbackForm.submit(function(event){
		event.preventDefault();
		$.post( homepage+'/api/process_feedback', $feedbackForm.serializeArray(),function(data) {
			action('view','feedback');
		})
		.fail(function() {
			alert(lang[language][40]);
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
	$stableMenuFButtons.on('click','.button',function(){
		$stableMenuDetailTitle.text($(this).text());
	});
	$stableMenuDButtons.on('click','.button',function(){
		$stableMenuDetailTitle.text($(this).text());
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
					$('*[data-trans='+key+']').html(val);
				});
				replaceDots();
				break;
			case 'view':
				if (arguments[2] !== 'noHistory') {
					history.pushState({}, param, "#"+param);
				}
				$goHome.removeClass('show');
				$views.each(function(){
					var $this = $(this);
					$this.toggleClass('show',$this.data('name') === param);
					if ($this.hasClass('show') && $this.hasClass('hasgohome')) {
						$goHome.addClass('show');
					}
				});
				if (currentView === 'events') {
					$eventsListPast.empty();
					$eventsListUpcoming.empty();
				} else if (currentView === 'weekly') {
					$weeklyList.empty();
				} else if (currentView === 'stablemenu') {
					$stableMenuFButtons.empty();
					$stableMenuDButtons.empty();
					$stableMenuDetailTitle.empty();
					$stableMenuDetailList.empty();
				}
				if (param === 'home') {
					updateHomeSpecialButton();
					if (updateTimer === false) {
						updateData();
					}
				} else {
					if (updateTimer !== false) {
						window.clearTimeout(updateTimer);
						updateTimer = false;
					}
					if (param === 'events') {
						$.each(getFromStorage('events'),function(key,val){
							var html = '<div class="button frame" data-action="event-'+val.id+'">'+val['title_'+language]+'</div>';
							if (val.is_past) {
								$eventsListPast.prepend(html);
							} else {
								$eventsListUpcoming.append(html);
							}
						});
						$eventsList.find('.button:first').trigger('click');
					} else if (param === 'aboutus') {
						$aboutUsOptions.first().trigger('click');
					} else if (param === 'feedback') {
						$feedbackHands.removeClass('selected');
						$feedbackScores.removeClass('voted');
						$feedbackForm.trigger('reset');
					} else if (param === 'specials') {
						
					} else if (param === 'weekly') {
						$.each(getFromStorage('weekly_offer'),function(key,val){
							$weeklyList.append('<div class="day">'+lang[language][27+val.day]+'</div>');
							$.each(val.food,function(key,val){
								if (val.is_soup === true) {
									$weeklyList.append('<div class="soup"><strong>'+lang[language][35]+'</strong> '+val.name+'</div>');
								} else {
									$weeklyList.append('<div class="meal">'+val.name+'<span class="price">'+val.price+',-</span></div>');
								}
							});
						});
					} else if (param === 'stablemenu') {
						$.each(getFromStorage('menu_f'),function(key,val){
							$stableMenuFButtons.append('<div class="item button" data-action="stablegroup-'+val.id+'">'+val['name_'+language]+'</div>');
						});
						$.each(getFromStorage('menu_d'),function(key,val){
							$stableMenuDButtons.append('<div class="item button" data-action="stablegroup-'+val.id+'">'+val['name_'+language]+'</div>');
						});
						$stableMenuFButtons.find('.button:first').first().trigger('click');
					}
				}
				currentView = param;
				break;
			case 'event':
				$eventDetailChildren.title.text(lang[language][25]);
				$eventDetailChildren.date.text('');
				$eventDetailChildren.wrapper.html('');
				$eventDetailChildren.photos.html('');
				$eventDetail.removeClass('hasPhotos hasOnePhoto');
				//ajax
				if (ajax) {
					ajax.abort();
				}
				ajax = $.getJSON( homepage + '/api/json_event/'+param, function(data) {
					$eventDetailChildren.title.text(data['title_'+language]);
					$eventDetailChildren.date.text(data['date']+' - '+data['date_to']);
					$eventDetailChildren.wrapper.html(data['content_'+language]);
					var countPhotos = 0;
					for (var i=1;i<=4;i++) {
						if (data['photo_'+i]) {
							countPhotos++;
							$eventDetailChildren.photos.append('<div class="galleryItem img_'+i+'" style="background-image: url('+homepage+'/media/'+data['photo_'+i]+');" data-url="'+homepage+'/media/'+data['photo_'+i]+'" data-title="'+data['title_'+language]+'"></div>');
						}
					}
					$eventDetail.toggleClass('hasPhotos',countPhotos !== 0);
					$eventDetail.toggleClass('hasOnePhoto',countPhotos === 1);
				})
				.fail(function() {
					$eventDetailChildren.title.text(lang[language][26]);
				})
				.always(function() {
					ajax = false;
				});
				break;
			case 'aboutgroup':
				aboutUsIndex = 0;
				setAboutContent();
				aboutUsSection = param;
				break;
			case 'about':
				if (param === 'prev') {
					aboutUsIndex--;
					setAboutContent();
				} else {
					aboutUsIndex++;
					setAboutContent();
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
			case 'stablegroup':
				$stableMenuDetailList.text(lang[language][25]);
				if (ajax) {
					ajax.abort();
				}
				ajax = $.getJSON( homepage + '/cs/api/menu_detail/'+param, function(data) {
					$stableMenuDetailList.empty();
					$.each(data, function(index, val) {
						$stableMenuDetailList.append('<div class="item">'+val['name_'+language]+'<span class="price">'+val.price+',-</span></div>'); 
					});
				})
				.fail(function() {
					$stableMenuDetailList.text(lang[language][26]);
				})
				.always(function() {
					ajax = false;
				});
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

	//slideshow start
	temp = $('#slideshow');
	var $slideshow = {
			this: temp,
			close: temp.children('.close'),
			prev: temp.children('.prev'),
			next: temp.children('.next'),
			swiper: temp.children('.swiper')
		},
		$galleryWrappers = $('.galleryWrapper');
	var gallerySwiper = $('#slideshowSwiper').swiper({
		mode:'horizontal',
		onSlideChangeEnd: function(){
			checkSlideshowArrows();
		}
	});
	function checkSlideshowArrows() {
		var currentSlide = gallerySwiper.getSlide(gallerySwiper.activeIndex);
		$slideshow.next.toggleClass('nomore',currentSlide === gallerySwiper.getLastSlide());
		$slideshow.prev.toggleClass('nomore',currentSlide === gallerySwiper.getFirstSlide());
	}
	$slideshow.close.click(function(){
		gallerySwiper.removeAllSlides();
		gallerySwiper.reInit();
		$slideshow.this.removeClass('show');
	});
	$slideshow.next.click(function(){
		gallerySwiper.swipeNext();
	});
	$slideshow.prev.click(function(){
		gallerySwiper.swipePrev();
	});
	$(document).keyup(function(e) {
		if ($slideshow.this.hasClass('show')) {
			if (e.keyCode === 27) {//escape
				console.log('esc');
				$slideshow.close.trigger('click');
			} else if (e.keyCode === 37) { // left
				gallerySwiper.swipePrev();
			} else if(e.keyCode === 39) { // right
				gallerySwiper.swipeNext();
			}
		}
	});
	$galleryWrappers.on('click','.galleryItem',function(){
		$slideshow.this.addClass('show');
		var $selected = $(this),
			$all = $selected.closest('.galleryWrapper').find('.galleryItem'),
			targetIndex = 0;
		$all.each(function(i){
			var $this = $(this),
				title = '';
			if ($this.is($selected)) {
				targetIndex = i;
			}
			if ($this.data('title')) {
				title = $this.data('title');
			}
			gallerySwiper.appendSlide('<div class="title">'+title+'</div><div class="frame"><div class="wrapper"><img src="'+$this.data('url')+'"></div></div>');
		});
		gallerySwiper.reInit();
		gallerySwiper.swipeTo(targetIndex,0);
		checkSlideshowArrows();
	});

	//slideshow end
});
