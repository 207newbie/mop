var MAPDATA = [
	{
		barTitle: "Competitividad y desarrollo económico",
		zone    : "Macro zona norte",
		region  : "Arica y parinacota",
		text   : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		author  : "Yolanda del Pilar Carrasco", 
		x       : 40,
		y       : 100,
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
		x       : 30,
		y       : 190,
		src     : 'images/marker-008c74.png',
		srcMinus: 'images/marker-008c74-minus.png',
		color   : '#008c74'
	}
];

$(document).ready(function(){	
	loadData();

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
		onLeave: function(index, nextIndex, direction){
			let title = $('.container .section:nth-child('+nextIndex+')').data('title');
			$('#title-header').html(title);
			if (nextIndex >= 5){
				$('#map-footer').removeClass('hidden');
			}
			else{
				$('#map-footer').removeClass('open maximized');
				$('.btn-open-map-footer').removeClass('open');
				$('#map-footer').addClass('hidden');
			}
		}
	});

	$('#zoom-slider').change(function(e){
		e.preventDefault();
		let val      = (100 - $(this).val()) * 0.01;
		let mapWidth = $('#img-map').css('width').replace('px', '');
		
		/*
		$('#img-map').css({
			'transform': 'scale('+(1 + val)+')',
		});
		$('.map-marker').each(function(e){
			let top = $(this).css('top').replace('px', '');
			let left = $(this).css('left').replace('px', '');
			$(this).css({
				top  : $(this).data('y') * (1 + val),
				left : mapWidth + $(this).data('x') * (1 + val) 
			});
		});
		*/
	});
	$('.btn-open-map-footer').click(toggleMapDetail);
	$('.btn-maximize').click(maximizeMapDetail);
	$('#button-footer').click(function(){
		$.fn.fullpage.moveSectionDown();
	});

	$('.btn-up').click(function(){
		$.fn.fullpage.moveSectionUp();
	});

	$('#map-container').on('click', '.map-marker', onMarkerClick);
});

function closeMarker(){
	let index = $(this).data('index');
	$(this).attr('src', MAPDATA[index].src);
	$(this).removeClass('open');
}

function onMarkerClick(e){
	let index = $(this).data('index');
	if ($(this).hasClass('open')){
		$(this).attr('src', MAPDATA[index].src);
		$(this).removeClass('open');
	}
	else{
		$('#map-container .map-marker.open').each(closeMarker);
		$(this).addClass('open');
		$(this).attr('src', MAPDATA[index].srcMinus);
	}
	$('#detail-bar').html(MAPDATA[index].barTitle);
	$('#detail-zone').html(MAPDATA[index].zone);
	$('#detail-region').html(MAPDATA[index].region);
	$('#detail-text').html(MAPDATA[index].text);
	$('#detail-bar').css('background-color', MAPDATA[index].color);
	updateMapDetailHeight();	
}

function updateMapDetailHeight(){
	/*
	let height = parseInt($('#detail-bar').css('height').replace('px', ''));
	height    += parseInt($('#map-footer .footer-header').css('height').replace('px', ''));
	$('#map-footer').css({
		height: height
	});
	*/
}

function loadData(){
	let map = $('#map-container');
	for (var i = MAPDATA.length - 1; i >= 0; i--) {
		let marker = $('<img class="map-marker">');
		marker.attr('src', MAPDATA[i].src);
		map.append(marker);
		marker.data('index', i);
		marker.data('x', MAPDATA[i].x);
		marker.data('y', MAPDATA[i].y);
		marker.css({
			top   : MAPDATA[i].y,
			left  : MAPDATA[i].x,
		})
	}
}

function maximizeMapDetail(e){
	$('#map-footer').toggleClass('maximized');		
	$(this).toggleClass('maximized');	
}

function toggleMapDetail(e){
	$('#map-footer').css({
		height: ''
	})
	if ($(this).hasClass('open')){
		$('#map-footer').removeClass('maximized');
		updateMapDetailHeight();		
	}
	$(this).toggleClass('open');		
	$('#map-footer').toggleClass('open');		
}

function closeFooter(e){
	$(this).hide();
}

/* Open when someone clicks on the span element */
function openNav() {
    document.getElementById("myNav").style.width = "100%";
}

function openDownloadOverlay() {
    $("#overlay-download").css({
    	'width': "100%"
    });
}

function openLegendOverlay() {
    $("#overlay-legend").css({
    	'left': "0%"
    });
}

function closeLegendOverlay() {
    $("#overlay-legend").css({
    	'left': "-100%"
    });
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    $('.overlay').css({
    	'width': "0%"
    });
} 
