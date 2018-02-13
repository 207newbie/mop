var MAPDATA = [
	{
		barTitle: "Competitividad y desarrollo económico",
		zone    : "Macro zona norte",
		region  : "Arica y parinacota",
		text   : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		author  : "Yolanda del Pilar Carrasco", 
		x       : 700,
		y       : 400,
		src     : 'images/marker-face00.png',
		srcMinus: 'images/marker-face00-minus.png',
		color   : '#face00'
	},
	{
		barTitle: "Calidad de vida",
		zone    : "Macro zona norte",
		region  : "Arica y parinacota",
		text   : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		author  : "Yolanda del Pilar Carrasco", 
		x       : 1000,
		y       : 800,
		src     : 'images/marker-008c74.png',
		srcMinus: 'images/marker-008c74-minus.png',
		color   : '#008c74'
	},
	{
		barTitle: "Calidad de vida",
		zone    : "Macro zona norte",
		region  : "Arica y parinacota",
		text   : "Lorem.",
		author  : "Yolanda del Pilar Carrasco", 
		x       : 900,
		y       : 1200,
		src     : 'images/marker-008c74.png',
		srcMinus: 'images/marker-008c74-minus.png',
		color   : '#008c74'
	}
];


function animate( time ) {
	requestAnimationFrame( animate );
	TWEEN.update( time );
}

const MAX_TEXT_DETAIL_SIZE = 200;

$(document).ready(function(){	
	loadData();
	animate();

	$(window).scroll(function(e){
		//preventDefault();
	});
	
	$('.container').fullpage({
		paddingTop: '0px',
		controlArrows: false,
		fixedElements: '.header, .footer',
		verticalCentered: false,
		autoScrolling: true,
		touchSensitivity: 10,
		normalScrollElements: '#map-container, #map-zoombar',
		slidesNavigation: true,
		slidesNavPosition: 'bottom',
		onLeave: function(index, nextIndex, direction){
			let title = $('.container .section:nth-child('+nextIndex+')').data('title');
			$('#title-header').html(title);
			if (nextIndex >= 5){
				$('#map-footer').removeClass('hidden');
				$('.fp-slidesNav').hide();
			}
			else{
				$('#map-footer').removeClass('open maximized');
				$('.btn-open-map-footer').removeClass('open');
				$('#map-footer').addClass('hidden');
				$('.fp-slidesNav').show();
			}
		},
		onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex){
			/* en slide de mapa */
			if (index == 5 && nextSlideIndex != 0){
				$('#map-footer').removeClass('open maximized');
				$('.btn-open-map-footer').removeClass('open');
				$('#map-footer').addClass('hidden');
			}
			if (index == 5 && nextSlideIndex == 0){
				$('#map-footer').removeClass('hidden');
			}
		}
	});

	$('.map-container').click(function(e){
		let svgMap = $(this).find('svg');
		let values = svgMap.attr('viewBox').split(" ").map(function(e){ return parseInt(e) });
		var tweenObjectOriginal = { x: values[0], y: values[1], w: values[2], h: values[3]};
		let maxHeight = $('body').css('height').replace('px', '');
		let maxWidth = $('body').css('width').replace('px', '');
		let verticalOffset   = (e.pageY * 100 / maxHeight);
		let horizontalOffset = (e.pageX * 100 / maxWidth);

		if (verticalOffset < 30 && values[1] >= -values[3]*1.5){
			console.log("# subiendo");
			let y = parseInt(values[1]) - (values[3]*0.2);
			values[1] = y < 0 ? 0 : y;
		}
		else if (verticalOffset >= 50 && values[1] < values[3]*1.5){
			console.log("# bajando");
			let y = parseInt(values[1]) + (values[3]*0.2);
			values[1] = y + (values[3]*0.2) > values[3]  ? values[3] - (values[3]*0.2) : y;
		}
		if (horizontalOffset < 30 && values[0] >= -values[2]){
			console.log("# izquierda");
			values[0] = parseInt(values[0]) - (values[2]*0.2);
		}
		else if (horizontalOffset >= 70 && values[0] < values[2]/2){
			console.log("# derecha");
			values[0] = parseInt(values[0]) + (values[2]*0.2);
		}

		var tweenObject = { x: values[0], y: values[1], w: values[2], h: values[3]};
		var tween = new TWEEN.Tween(tweenObjectOriginal)
	    	.to( tweenObject, 200)
			.easing( TWEEN.Easing.Linear.None )
			.onUpdate( function (object){
				let values = [tweenObjectOriginal.x, tweenObjectOriginal.y, tweenObjectOriginal.w, tweenObjectOriginal.h]
				.join(" ");
				svgMap.attr('viewBox', values);
			} )
			.start();
	});

	$('#zoom-slider').change(function(e){

		e.preventDefault();
		let idMapa = $(this).data('target');
		let val      = (100 - $(this).val()) / 100;

		/* 1420 y 0.1717 podrian extraerse desde los atributos del svg y la imagen del mapa*/
		let values = $('#'+idMapa).attr('viewBox').split(" ").map(function(e){ return parseInt(e)});
		let height = $('#'+idMapa).css('height').replace('px', '');
		if (values[1] < 0){
			values[1] = 0;
		}
		values[2] = 1420 + 1420 * val;
		values[3] = 8266 + 8266 * val;
		$('#'+idMapa).attr('viewBox', values.join(" "));
		$('#'+idMapa).css({
			'transform' : 'scale('+ ( 1 + val ) +')',
		});





		$('#'+idMapa).find('.map-marker').each(function(e){
			let index = $(this).attr('index');
			$(this).attr('x', MAPDATA[index].x * ( 1 + val ));
			$(this).attr('y', MAPDATA[index].y * ( 1 + val ));
		});

	});
	$('.btn-open-map-footer').click(toggleMapDetail);
	$('.btn-maximize').click(maximizeMapDetail);
	$('#button-footer').click(function(){
		$.fn.fullpage.moveSectionDown();
	});
	$('.btn-legend').click(function(){
		$.fn.fullpage.moveTo(5, 1);
	});
	$('.svg-map').on('click', '.map-marker', onMarkerClick);

	$('.menu-item').click(closeNav);
});

function closeMarker(){
	let index = $(this).attr('index');
	$(this).attr('href', MAPDATA[index].src);
	$(this).removeClass('open');
}

function onMarkerClick(e){
	let index = $(this).attr('index');
	if ($(this).hasClass('open')){
		$(this).attr('href', MAPDATA[index].src);
		$(this).removeClass('open');
	}
	else{
		$('.svg-map .map-marker.open').each(closeMarker);
		$(this).addClass('open');
		$(this).attr('href', MAPDATA[index].srcMinus);
	}
	$('#detail-bar').html(MAPDATA[index].barTitle);
	$('#detail-zone').html(MAPDATA[index].zone);
	$('#detail-region').html(MAPDATA[index].region);
	$('#detail-author').html(MAPDATA[index].author);
	/* solo se muestran hasta MAX_TEXT_DETAIL_SIZE letras*/
	if (MAPDATA[index].text.length > MAX_TEXT_DETAIL_SIZE){
		$('#detail-text').html('<span>'+MAPDATA[index].text.substr(0, MAX_TEXT_DETAIL_SIZE)+'...</span>');
		let span = $('<span></span>');
		span.hide();
		span.html(MAPDATA[index].text.substr(MAX_TEXT_DETAIL_SIZE));
		$('#detail-text').append(span);
		$('#detail-author').hide();
		$('.footer-footer').show();	
	}
	else{
		$('#detail-text').html(MAPDATA[index].text);
		$('#detail-author').show();	
		$('.footer-footer').hide();	
	}
	$('#detail-bar').css('background-color', MAPDATA[index].color);
	updateMapDetailHeight();	
}

function loadData(){
	let map = $('#map-dialogo-territorial');
	let values = map.attr('viewBox').split(" ").map(function(e){ return parseInt(e) });
	for (var i = MAPDATA.length - 1; i >= 0; i--) {
		var img = document.createElementNS('http://www.w3.org/2000/svg','image');
			img.setAttributeNS(null,'height', 220);
			img.setAttributeNS(null,'width', 220);
			img.setAttributeNS(null,'class','map-marker');
			img.setAttributeNS('http://www.w3.org/1999/xlink','href', MAPDATA[i].src);
			img.setAttributeNS(null,'x', MAPDATA[i].x);
			img.setAttributeNS(null,'y', MAPDATA[i].y);
			img.setAttributeNS(null,'index', i);
		map.append(img);
	}
}

function maximizeMapDetail(e){
	if ($('#map-footer').hasClass('maximized')){
		$('#detail-text span:nth-child(2)').hide();	
		$('#detail-author').hide();
	}
	else{
		$('#detail-author').show();	
		$('#detail-text span').show();
	}
	$('#map-footer').toggleClass('maximized');		
	$(this).toggleClass('maximized');
}

function toggleMapDetail(e){
	$('#map-footer').css({
		height: ''
	})
	if ($(this).hasClass('open')){
		$('#map-footer').removeClass('maximized');
		$('#detail-text span:nth-child(2)').hide();	
	}
	$(this).toggleClass('open');		
	$('#map-footer').toggleClass('open');		
}

function closeFooter(e){
	$(this).hide();
}

/* Open when someone clicks on the span element */
function openNav() {
    $("#overlay-menu").css({
    	'top': "0%"
    });
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    $("#overlay-menu").css({
    	'top': "-100%"
    });
} 

function openDownloadOverlay() {
    $("#overlay-download").css({
    	'top': "0px"
    });
}

function closeDownloadOverlay() {
    $("#overlay-download").css({
    	'top': "-100%"
    });
}

function openShareOverlay() {
    $("#overlay-share").css({
    	'top': "0px"
    });
}

function closeShareOverlay() {
    $("#overlay-share").css({
    	'top': "-100%"
    });
}




function moveLeft(){
	$.fn.fullpage.moveSlideLeft();
}