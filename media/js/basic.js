$(function () {
	var homepage = 'http://forhaus.cz',
		language = 'cs',
		temp,
		wineIdDelayed,
		currentView = '',
		$body = $('body'),
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
		$suppliersListSuppliers = $('#suppliers .list-suppliers'),
		$suppliersListPartners = $('#suppliers .list-partners'),
		$aboutUsOptions = $('#aboutus .options .button'),
		$aboutUsDetail = $('#aboutus .detail'),
		$aboutUsTitle = $aboutUsDetail.find('.title'),
		$aboutUsContent = $aboutUsDetail.find('.content'),
		aboutUsIndex = 0,
		aboutUsSection = 'videos',
		$feedback = $('#feedback'),
		$feedbackForm = $feedback.find('form'),
		$feedbackScores = $feedbackForm.find('.score'),
		$feedbackHands = $feedbackScores.find('.button'),
		$feedbackStars = $feedbackScores.find('.stars'),
		$weeklyList = $('#weekly .list'),
		$stableMenuWrapper = $('#stablemenu'),
		$stableMenuAllButtons = $('#stablemenu .items'),
		$stableMenuFButtons = $('#stablemenu .items .type-f'),
		$stableMenuDButtons = $('#stablemenu .items .type-d'),
		$stableMenuSecondMenuTitle = $('#stablemenu .second-menu .title'),
		$stableMenuSecondMenuList = $('#stablemenu .second-menu .list'),
		$stableMenuSecondMenuListSelected = false,
		stableMenuData = {},
		$stableMenuProduct = $('#stablemenu .product'),
		$stableMenuProductDetail = {},
		$stableMenuVCenter = $('#stablemenu .items .v_centre'),
		$homeInOpt = $('#home .inOpt'),
		$homeOutOpt = $('#home .outOpt'),
		$winesWrapper = $('#winelist'),
		$winesFirstButtons = $('#winelist .left-menu .items .button'),
		$winesSeconds = $('#winelist .second-menu .s-menu'),
		$winesFirstVCenter = $('#winelist .left-menu .v_centre'),
		$winesSecondVCenter = $('#winelist .second-menu .v_centre'),
		$winesList = $('#winelist .third-menu .list'),
		$vCenter = $('.v_centre'),
		$winesSelectedSecond = false,
		$vineyardsList = $('#vineyards'),
		$specialsTitle = $('#specials .title'),
		$specialsList = $('#specials .list'),
		$homeSlideshow = $('#homeSlideshow'),
		$updated = $('#updated'),
		winesData = {},
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
				'url': '/cs/api/weekly_offer'
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
			},
			{
				'name': 'articles',
				'url': '/cs/api/blogposts/app'
			},
			{
				'name': 'advices',
				'url': '/cs/api/blogposts/advice'
			},
			{
				'name': 'homeslides',
				'url': '/cs/api/intro_images'
			},
			{
				'name': 'suppliers',
				'url': '/api/suppliers'
			}
		],
		apiIndexUpdate = 0,
		ajax = false;
	temp = $window.width();
	if (temp < $window.height()) {
		temp = $window.height();
	}
	if (temp > 1360) {
		$body.addClass('upscale');
	}
	$stableMenuProduct.find('.dynamic').each(function(){
		var $this = $(this);
		$stableMenuProductDetail[$this.data('key')] = $this;
	});
	temp = $('#winelist .detail .wine');
	$wineDetail = {
		title: temp.find('.title'),
		price: temp.find('.price'),
		availability: temp.find('.availability'),
		color: temp.find('.color'),
		category: temp.find('.category'),
		description: temp.find('.description'),
		fit: temp.find('.fit'),
		place_description: temp.find('.place_description'),
		place: temp.find('.place'),
		track: temp.find('.track'),
		residual_sugar: temp.find('.residual_sugar'),
		acids: temp.find('.acids'),
		alcohol: temp.find('.alcohol'),
		bezcukerny_extrakt: temp.find('.bezcukerny_extrakt'),
		image: temp.find('.image')
	}
	$.each(apiSource,function(key,val) {
		if (localStorage[val.name] === undefined) {
			localStorage[val.name] = '[]';
		}
	});
	function updateHomeSpecialButton() {
		temp = getFromStorage('special').length === 0;
		$homeInOpt.toggleClass('hide',temp);
		$homeOutOpt.toggleClass('hide',!temp);
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
				apiSource[apiIndexUpdate].updated = true;
			})
			.always(function() {
				apiIndexUpdate++;
				if (updateTimer !== false) {
					updateData();
				}
			});
		},500);
		var updated = true;
		$.each(apiSource,function(key,val){
			if (val.updated === false) {
				updated = false;
			}
		});
		$updated.toggleClass('hide',updated === false);
	}
	function getFromStorage(name) {
		try {
			var data = JSON.parse(localStorage[name]);
			return data?data:[];
		} catch (e) {
			return [];
		}
	}
	function setAboutContent() {
		var data = getFromStorage(aboutUsSection);
		if (data.length !== 0) {
			if (aboutUsIndex >= data.length) {
				aboutUsIndex = 0;
			} else if (aboutUsIndex < 0) {
				aboutUsIndex = data.length-1;
			}
			switch (aboutUsSection) {
				case 'videos':
					$aboutUsTitle.text(data[aboutUsIndex]['title_'+language]);
					$aboutUsContent.html('<iframe width="50" height="50" src="http://www.youtube.com/embed/'+data[aboutUsIndex]['get_code']+'" frameborder="0" allowfullscreen></iframe>');
					break;
				case 'articles':
				case 'advices':
					$aboutUsTitle.text(data[aboutUsIndex]['title_'+language] + ' ('+data[aboutUsIndex].pub_time+')');
					$aboutUsContent.html('<div class="texty">'+data[aboutUsIndex]['content_'+language]+'</div>');
					break;
			}
		} else {
			$aboutUsTitle.text(lang[language][50]);
			$aboutUsContent.empty();
		}
	}
	$feedbackHands.on('click',function(){
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
			alert(lang[language][49]);
			action('view','feedback');
		})
		.fail(function() {
			alert(lang[language][40]);
		});
	});
	function onWindowResize() {
		VCenter();
		centerImage($wineDetail.image.find('img'));
		$slideshow.this.find('img').load(function(){
			centerImage($(this));
		});
		temp = $window.width();
		$body.toggleClass('current-upscale',$window.width() > 1300);
	}
	$window.resize(function(){
		onWindowResize();
	});
	function replaceDots(){
		$slogans.each(function(){
			var $this = $(this);
			$this.html($this.html().split('∙').join('<span class="dot"></span>'));
		});
	}
	replaceDots();
	function VCenter($wrapper){
		if (arguments.length === 0) {
			$vCenter.each(function(){
				VCenter($(this));
			});
		} else {
			var parentHeight = $wrapper.parent().height(),
				wrapperHeight = $wrapper.height();
			$wrapper.css('margin-top',parentHeight< wrapperHeight?0:(parentHeight-wrapperHeight)/2);
		}
	}
	$winesSeconds.on('click','.button',function(){
		if ($winesSelectedSecond) {
			$winesSelectedSecond.removeClass('selected');
		}
		$winesSelectedSecond = $(this);
		$winesSelectedSecond.addClass('selected');
	});
	$stableMenuSecondMenuList.on('click','.button',function(){
		if ($stableMenuSecondMenuListSelected) {
			$stableMenuSecondMenuListSelected.removeClass('selected');
		}
		$stableMenuSecondMenuListSelected = $(this);
		$stableMenuSecondMenuListSelected.addClass('selected');
	});
	$winesList.on('click','.button',function(){
		$winesWrapper.addClass('collapse');
		$winesList.find('.selected').removeClass('selected');
		$(this).addClass('selected');
	});
	$aboutUsOptions.on('click',function(){
		$aboutUsOptions.removeClass('selected');
		$(this).addClass('selected');
	});
	$stableMenuAllButtons.on('click','.button',function(){
		var $this = $(this);
		$stableMenuAllButtons.find('.button').removeClass('selected');
		$this.addClass('selected');
		$stableMenuSecondMenuTitle.text($this.text());
	});
	$winesFirstButtons.on('click',function(){
		$winesFirstButtons.removeClass('selected');
		$(this).addClass('selected');
		$winesList.find('.button').removeClass('hide');
	});
	$liveButtons.on('click','.button',function(){
		buttonPress($(this));
	});
	$buttons.on('click',function(){
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
					$stableMenuSecondMenuList.empty();
					action('stablemenuexpand');
				} else if (currentView === 'feedback') {
					for (var i=0;i<=5;i++) {
						$feedbackStars.removeClass('star-'+i);
					}
				} else if (currentView === 'winelist') {
					action('winesexpand');
					$winesList.empty();
					$vineyardsList.empty();
				} else if (currentView === 'specials') {
					$specialsTitle.empty();
					$specialsList.empty();
				} else if (currentView === 'aboutus') {
					$aboutUsTitle.empty();
					$aboutUsContent.empty();
				} else if (currentView === 'suppliers') {
					$suppliersListSuppliers.empty();
					$suppliersListPartners.empty();
				}
				if (param === 'home') {
					updateHomeSpecialButton();
					$homeSlideshow.empty();
					temp = getFromStorage('homeslides');
					var set = [];
					if (temp.length <= 4) {
						set = [0,1,2,3];
					} else {
						while (set.length !== 4) {
							var rand = Math.floor(Math.random()*temp.length);
							if (set.indexOf(rand) === -1) {
								set.push(rand);
							}
						}
					}
					var i=0;
					$.each(temp,function(key,val){
						if (set.indexOf(key) !== -1) {
							$homeSlideshow.append('<div class="galleryItem img_'+(i++)+'" data-url="'+homepage+'/media/'+val['photo_file']+'" data-title="'+val['title_'+language]+'"><!--<img src="'+homepage+val['photo_file_thumb']+'" width="250" height="250">--><div style="width: 250px; height: 250px; background-image: url('+homepage+'/media/'+val['photo_file']+'); background-size: cover;"></div></div>');
						}
					});
					if (updateTimer === false) {
						console.log('start');
						$.each(apiSource,function(key,val){
							val.updated = false;
						});
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
								$eventsListPast.append(html);
							} else {
								$eventsListUpcoming.prepend(html);
							}
						});
						$eventsList.find('.button:first').trigger('click');
					} else if (param === 'aboutus') {
						$aboutUsOptions.first().trigger('click');
					} else if (param === 'feedback') {
						$feedbackHands.removeClass('selected');
						$feedbackScores.removeClass('voted');
						$feedbackForm.trigger('reset');
						var data = getFromStorage('feedbackScores');
						$feedbackStars.each(function(key,val){
							var $this = $(this);
							$this.addClass('star-'+Math.round(data[$this.data('name')+'__avg']));
						});
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
						setTimeout(function(){
							VCenter($stableMenuVCenter);
						},20);
						$stableMenuAllButtons.find('.button:first').first().trigger('click');
					} else if (param === 'winelist') {
						var data = getFromStorage('vineyards');
						$.each(data,function(key,val){
							$vineyardsList.append('<div class="button" data-action="winesvineyard-'+val.id+'">'+val['region_'+language]+'<div class="subtitle">'+val['name_'+language]+'</div></div>');
						});
						winesData = getFromStorage('wines');
						$.each(winesData,function(key,val){
							$winesList.append('<div class="button" data-action="winedetail-'+key+'" data-index="'+key+'">'+val['name_'+language]+'</div>');
						});
						setTimeout(function(){
							VCenter($winesFirstVCenter);
							$winesFirstButtons.first().trigger('click');
						},20);
					} else if (param === 'specials') {
						var data = getFromStorage('special')[0];
						$specialsTitle.text(data['title_'+language]);
						$.each(data.get_food,function(key,val){
							$specialsList.append('<div class="item">'+val.name+'<span class="price">'+val.price+',-</span></div>');
						});
					} else if (param === 'suppliers') {
						temp = getFromStorage('suppliers');
						$.each(temp.suppliers,function(key,val){
							$suppliersListSuppliers.append('<div class="item"><div class="image">'+(val.logo_thumb?'<img src="'+homepage+val.logo_thumb+'">':'')+'</div><div class="name">'+val.name+'</div><div class="link"><a href="'+val.url+'" target="_blank">'+val.url+'</a></div></div>');
						});
						$.each(temp.partners,function(key,val){
							$suppliersListPartners.append('<div class="item"><div class="image">'+(val.logo_thumb?'<img src="'+homepage+val.logo_thumb+'">':'')+'</div><div class="name">'+val.name+'</div><div class="link"><a href="'+val.url+'" target="_blank">'+val.url+'</a></div></div>');
						});
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
				aboutUsSection = param;
				setAboutContent();
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
			case 'winesfirst':
				if ($winesSelectedSecond) {
					$winesSelectedSecond.removeClass('selected');
				}
				$winesSeconds.each(function(){
					var $this = $(this);
					$this.toggleClass('show',$this.data('name') == param);
				});
				VCenter($winesSecondVCenter);
				break;
			case 'winedetail':
				$wineDetail.title.text(winesData[param]['name_'+language]);
				$wineDetail.price.text(winesData[param].price);
				if (winesData[param].available) {
					$wineDetail.availability.text(lang[language][46]+' ('+lang[language][61]+': '+winesData[param].bottles+')');
				} else {
					$wineDetail.availability.text(lang[language][47]);
				}
				$wineDetail.color.text(lang[language][winesData[param].color]);
				$wineDetail.category.text(lang[language][winesData[param].category]);
				$wineDetail.description.html(winesData[param]['description_'+language].replace(/\n/g, "<br>"));
				temp = [];
				if (winesData[param].get_recommended_food == '') {
					temp.push(lang[language][48]);
				} else {
					$.each(winesData[param].get_recommended_food,function(key,val){
						temp.push(lang[language][val]);
					});
				}
				$wineDetail.fit.text(temp.join(', '));
				$wineDetail.place_description.html(winesData[param].vineyard['region_description_'+language].replace(/\n/g, "<br>"));
				$wineDetail.place.text(winesData[param].vineyard['region_'+language]);
				$wineDetail.track.text(winesData[param].vineyard['name_'+language]);
				if (winesData[param].bezcukerny_extrakt) {
					$wineDetail.bezcukerny_extrakt.text(winesData[param].bezcukerny_extrakt);
					$wineDetail.bezcukerny_extrakt.parent().removeClass('hide');
				} else {
					$wineDetail.bezcukerny_extrakt.parent().addClass('hide');
				}
				if (winesData[param].residual_sugar) {
					$wineDetail.residual_sugar.text(winesData[param].residual_sugar);
					$wineDetail.residual_sugar.parent().removeClass('hide');
				} else {
					$wineDetail.residual_sugar.parent().addClass('hide');
				}
				if (winesData[param].acids) {
					$wineDetail.acids.text(winesData[param].acids);
					$wineDetail.acids.parent().removeClass('hide');
				} else {
					$wineDetail.acids.parent().addClass('hide');
				}
				if (winesData[param].alcohol) {
					$wineDetail.alcohol.text(winesData[param].alcohol);
					$wineDetail.alcohol.parent().removeClass('hide');
				} else {
					$wineDetail.alcohol.parent().addClass('hide');
				}
				if (winesData[param].main_photo) {
					$wineDetail.image.html('<div class="galleryItem" data-url="'+homepage+winesData[param].main_photo+'" data-title="'+winesData[param]['name_'+language]+'"><img src="'+homepage+winesData[param].main_photo+'"></div>');
					$wineDetail.image.find('img').load(function(){
						centerImage($(this));
					});
				} else {
					$wineDetail.image.empty();
				}
				break;
			case 'vote':
				$feedbackScores.each(function(){
					var $this = $(this);
					if ($this.data('id') == param) {
						$this.addClass('voted');
					}
				});
				break;
			case 'winesexpand':
				$winesWrapper.removeClass('collapse');
				$winesList.find('.selected').removeClass('selected');
				$winesFirstButtons.removeClass('selected');
				$winesList.find('.button').removeClass('hide');
				$winesFirstButtons.first().trigger('click');
				break;
			case 'winesrecommended':
				var $wines = $winesList.find('.button');
				$wines.each(function(){
					var $this = $(this);
					$this.toggleClass('hide',winesData[$this.data('index')].recommended === false);
				});
				break;
			case 'winesopened':
				var $wines = $winesList.find('.button');
				$wines.each(function(){
					var $this = $(this);
					$this.toggleClass('hide',winesData[$this.data('index')].bottle_opened === false);
				});
				break;
			case 'winescolor':
				var $wines = $winesList.find('.button');
				$wines.each(function(){
					var $this = $(this);
					$this.toggleClass('hide',winesData[$this.data('index')].color !== param);
				});
				break;
			case 'winescategory':
				var $wines = $winesList.find('.button');
				$wines.each(function(){
					var $this = $(this);
					$this.toggleClass('hide',winesData[$this.data('index')].category !== param);
				});
				break;
			case 'winesgoodwith':
				var $wines = $winesList.find('.button');
				$wines.each(function(){
					var $this = $(this);
					$this.toggleClass('hide',winesData[$this.data('index')].get_recommended_food.indexOf(param) === -1);
				});
				break;
			case 'winesvineyard':
				var $wines = $winesList.find('.button');
				$wines.each(function(){
					var $this = $(this);
					$this.toggleClass('hide',winesData[$this.data('index')].vineyard.id != param);
				});
				break;
			case 'stablegroup':
				$stableMenuSecondMenuListSelected = false;
				$stableMenuProduct.removeClass('show_detail');
				$stableMenuSecondMenuList.empty();
				$stableMenuSecondMenuList.text(lang[language][25]);
				if (ajax) {
					ajax.abort();
				}
				ajax = $.getJSON( homepage + '/cs/api/menu_detail/'+param, function(data) {
					stableMenuData = data;
					$stableMenuSecondMenuList.empty();
					$.each(data, function(index, val) {
						var image = '';
						if (val.photo_small) {
							image = '<img src="'+homepage+val.photo_small+'" width="65" height="65">';
						}
						$stableMenuSecondMenuList.append('<div class="button" data-action="stablemenuproduct-'+index+'"><div class="image">'+image+'</div><div class="title">'+val['name_'+language]+'</div><div class="description">'+val['description_'+language]+'</div><div class="price">'+val.price+',-</div></div>');
					});
				})
				.fail(function() {
					$stableMenuSecondMenuList.text(lang[language][26]);
				})
				.always(function() {
					ajax = false;
				});
				break;
			case 'stablemenuexpand':
				if ($stableMenuSecondMenuListSelected) {
					$stableMenuSecondMenuListSelected.removeClass('selected');
				}
				$stableMenuSecondMenuListSelected = false;
				$stableMenuProduct.removeClass('show_detail');
				$stableMenuWrapper.removeClass('collapse');
				break;
			case 'stablemenuproduct':
				$stableMenuWrapper.addClass('collapse');
				$stableMenuProduct.addClass('show_detail');
				$stableMenuProductDetail.box.toggleClass('recommended',stableMenuData[param].recommended===true);
				$stableMenuProductDetail.title.text(stableMenuData[param]['name_'+language]);
				$stableMenuProductDetail.price.text(stableMenuData[param].price);
				$stableMenuProductDetail.grammage.text(stableMenuData[param]['grammage_'+language]);
				$stableMenuProductDetail.description.html(stableMenuData[param]['description_'+language].replace(/\n/g, "<br>"));
				$stableMenuProductDetail['good-with'].empty();
				temp = getFromStorage('wines');
				$.each(temp,function(key,val){
					if (stableMenuData[param].recommended_wine.indexOf(val.id) !== -1) {
						$stableMenuProductDetail['good-with'].append('<div class="button" data-action="wineid-'+val.id+'">'+val['name_'+language]+'</div>');
					}
				});
				$stableMenuProductDetail['good-with-title'].toggleClass('hide',stableMenuData[param]['recommended_wine'].length === 0);
				$stableMenuProductDetail['val-diets'].html(stableMenuData[param]['diets_'+language].replace(/\n/g, "<br>"));
				$stableMenuProductDetail['val-diets-title'].toggleClass('hide',!stableMenuData[param]['diets_'+language]);
				if (stableMenuData[param].photo_medium) {
					temp = '<div class="galleryItem" data-url="'+homepage+'/media/'+stableMenuData[param].photo+'" data-title="'+stableMenuData[param]['name_'+language]+'">';
					temp += '<img class="larger" src="'+homepage+stableMenuData[param].photo_large+'" width="460" height="280">';
					temp += '<img class="smaller" src="'+homepage+stableMenuData[param].photo_medium+'" width="290" height="170">';
					$stableMenuProductDetail.image.html(temp +'</div>');
				} else {
					$stableMenuProductDetail.image.empty();
				}
				$stableMenuProductDetail.available.text(lang[language][53+(stableMenuData[param].available?0:1)]);
				break;
			case 'wineid':
				action('view','winelist');
				wineIdDelayed = -1;
				$.each(getFromStorage('wines'),function(key,val){
					if (param == val.id) {
						wineIdDelayed = key;
					}
				});
				if (wineIdDelayed !== -1) {
					setTimeout(function(){
						$winesList.find('.button').each(function(key,val){
							var $this = $(this);
							if ($this.data('index') == wineIdDelayed) {
								$this.trigger('click');
							}
						});
					}, 100);
				}
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
	$slideshow.close.on('click',function(){
		gallerySwiper.removeAllSlides();
		gallerySwiper.reInit();
		$slideshow.this.removeClass('show');
	});
	$slideshow.next.on('click',function(){
		gallerySwiper.swipeNext();
	});
	$slideshow.prev.on('click',function(){
		gallerySwiper.swipePrev();
	});
	$(document).keyup(function(e) {
		if ($slideshow.this.hasClass('show')) {
			if (e.keyCode === 27) {//escape
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
			gallerySwiper.appendSlide('<div class="title">'+title+'</div><div class="frame imageCenterParent"><div class="wrapper"><img src="'+$this.data('url')+'"></div></div>');
		});
		gallerySwiper.reInit();
		gallerySwiper.swipeTo(targetIndex,0);
		$slideshow.this.find('img').load(function(){
			centerImage($(this));
		});
		checkSlideshowArrows();
	});
	function centerImage($img) {
		var $wrapper = $img.closest('.imageCenterParent');
		if ($wrapper.height() > $img.height()) {
			$img.css('margin-top',($wrapper.height()-$img.height())/2);
		}
	}
	//slideshow end

	onWindowResize();
});
