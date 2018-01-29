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
	}
];


function animate( time ) {
	requestAnimationFrame( animate );
	TWEEN.update( time );
}


$(document).ready(function(){	
	animate();

	$('.container-fluid').fullpage({
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
			let title = $('.container-fluid .section:nth-child('+nextIndex+')').data('title');
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
		}
	});

	$('.btn-info').click(openInfo);
	$('.btn-close-overlay').click(closeInfo);
});

function closeMarker(){
	let index = $(this).attr('index');
	$(this).attr('href', MAPDATA[index].src);
	$(this).removeClass('open');
}

function onMarkerClick(e){
	let index = $(this).attr('index');
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


function openInfo(){
	let target = $(this).data('target');
	$('#overlay-' + target).css({
		'top': '0%'
	})
}

function closeInfo(id){
	$('.overlay').css({
		'top': '-100%'
	})
}