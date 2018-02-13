var maps = {};

function animate( time ) {
	requestAnimationFrame( animate );
	//TWEEN.update( time );
}

var freeMovement = false;
$(document).ready(function(){	

	$('.container-fluid').fullpage({
		paddingTop: '0px',
		controlArrows: false,
		fixedElements: '#main-header, .footer',
		verticalCentered: false,
		autoScrolling: true,
		touchSensitivity: 10,
		normalScrollElements: '#map-container, #map-zoombar',
		slidesNavigation: true,
		slidesNavPosition: 'bottom',
		normalScrollElements: '.overlay',
		afterRender: function(){
			$.fn.fullpage.moveTo(window.location.hash.substr(1), 0);
			$('#main-spinner').remove();
		},
		onLeave: function(index, nextIndex, direction){
			$('#overlay-detalle-conectividad').addClass('hidden');
			if (freeMovement){
				freeMovement = false;
				return true;
			}
			if (nextIndex != 1){
				$('#main-header').addClass('hidden');
			}
			else{
				$('#main-header').removeClass('hidden');
			}

			if (nextIndex > 3){
				let leavingSection = $(this);

				if (nextIndex > index){
					centerMap(leavingSection.data('anchor'));
					/* Si el usuario avanza, se expande el mapa */
					if (!leavingSection.hasClass('expanded')){
						leavingSection.addClass('expanded');
						return false;
					}
					else{
						leavingSection.removeClass('expanded')
						resetMap(leavingSection.data('anchor'));
					}
				}
				else{
					/* Si el usuario retrocede y el mapa esta extendido */
					if (leavingSection.hasClass('expanded')){
						leavingSection.removeClass('expanded')
						resetMap(leavingSection.data('anchor'));
						return false;
					}
				}
				
			}
		}
	});

	$('.btn-info').click(openInfo);
	$('.btn-close-overlay').click(closeInfo);
	$('.overlay .legend-info .filter-item input').change(onLegendItemClick);
	$('#overlay-detalle-conectividad .btn-close').click(function(){
		$('#overlay-detalle-conectividad').addClass('hidden');
	});
	$('.side-header a.sub-item, .side-header a.item, .col-map a').click(function(e){
		e.preventDefault();
		let anchor = $(this).attr('href');
		freeMovement = true;
		$.fn.fullpage.moveTo(anchor.substr(1), 0);
	});
	$('#main-header a').click(function(e){
		e.preventDefault();
		$('#main-header').addClass('hidden');
		let anchor = $(this).attr('href');
		freeMovement = true;
		$.fn.fullpage.moveTo(anchor.substr(1), 0);
	});

	$('.btn-open-map').click(openMap);
	$('.btn-close-map').click(closeMap);
});



function initMapaVulnerabilidades(){
	var mapName = "mapa-vulnerabilidades";
	$.get( "images/"+mapName+".svg", function( data ) {
		initMap(data, mapName);
		initZoombar(mapName);
	}, 'xml');
}

function initMapaConectividad(){
	var mapName = "mapa-conectividad";
	$.get( "images/"+mapName+".svg", function( data ) {
		initMap(data, mapName, function(){
			$('#overlay-detalle-conectividad').addClass('hidden');
		});
		let map = maps[mapName];
		map.select('#objs circle').each(function(){
			this.front();
			this.click(function(e){
				let g = this.parent();
				$('#overlay-detalle-conectividad').removeClass('hidden');
				let width = $('#overlay-detalle-conectividad').css('width').replace('px', '');
				$('#overlay-detalle-conectividad').css({
					left: e.clientX - width/2,
					top : e.clientY + 5
				})
			});
		})
		initZoombar(mapName, function(){
			$('#overlay-detalle-conectividad').addClass('hidden');
		});
	}, 'xml');
}



function resetMap(mapName){
	if (maps[mapName]){
		maps[mapName].animate().zoom(0.5);
		maps[mapName].zoomBar.select('.circulo').get(0).y(175);
		let box = maps[mapName].select('g.mapa').bbox();
		maps[mapName].select('g.general').move(-(box.cx), -460);
	}
}

function centerMap(mapName){
	if (maps[mapName]){
		//maps[mapName]
	}
}

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


function onLegendItemClick(e){
	let checked = $(this).is(':checked');
	let target  = $(this).data('target');
	let mapName = $(this).parents('.overlay').attr('id').replace('overlay-', '');
	console.log(mapName);
	if (checked){
		maps[mapName].select('#'+target).get(0).show();
	}
	else{
		maps[mapName].select('#'+target).get(0).hide();
	}
}

function initMap(data, mapName, dragCallback){
	var xmlDataReceived = (new XMLSerializer()).serializeToString(data);
	//Set the viewport size
	draw = SVG("svg-"+mapName).panZoom({zoomMin: 0.5, zoomMax: 2});
	let nested = draw.nested();
	nested.attr('class', 'general');
	//Draw the background	
	let rect = nested.rect(draw.width(), draw.height()).fill('#ffffff00');
	dataDraw = nested.svg(xmlDataReceived);
	let box = dataDraw.select('g.mapa').bbox();
	rect.size(box.w, box.h);
	rect.back();
	maps[mapName] = draw;
	nested.draggable();
	maps[mapName].zoom(1);
	$('#svg-' + mapName).addClass('loaded');
	removeLoadingSpinner($('#overlay-' + mapName));
}

function initZoombar(mapName, callback){
	$.get( "images/zoombar2.svg", function( data ) {
		var xmlDataReceived = (new XMLSerializer()).serializeToString(data);
		//Set the viewport size
		let zoom = SVG("svg-zoom-"+mapName);
		let dataDraw = zoom.svg(xmlDataReceived);

		maps[mapName].zoomBar = zoom;
		
		maps[mapName].zoomBar.select('.circulo').get(0).draggable(function(x, y){
			let response =  {
				x: false,
				y: y < 175 && y > 40,
			}
			if (response.y){
				y = y - 40;
				let max = 175 - 40;
				let zoom = 100 - (y * 100 / max);
				zoom = 0.5 + (zoom / 100 * 1.5);
				maps[mapName].zoom(zoom);
			}		
			if (callback){
				callback(x, y, maps[mapName])
			}			
			return response;
		});
	}, 'xml');
}

function closeMap(){
	let mapName = $(this).parents('.overlay').attr('id').replace('overlay-', '');
	$('#overlay-' + mapName).css({
		'top': '-100%'
	});
	maps[mapName] = undefined;
	$('#svg-' + mapName).removeClass('loaded').html('');
	$('#svg-zoom-' + mapName).html('');
	console.log(maps);
}

function openMap(){
	let target = $(this).data('target');
	let overlay = $('#overlay-' + target);
	overlay.css({'top': '0%'});
	addLoadingSpinner(overlay.find('.map-wrapper'));

	switch(target){
		case 'mapa-vulnerabilidades':
			initMapaVulnerabilidades();
		break;
		default:
		break;
	}
	initMapaConectividad();
}

function addLoadingSpinner(e){
	e.append('<div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>');
}

function removeLoadingSpinner(e){
	e.find('.spinner').remove();
}