

$(document).ready(function(){
	$('#section-details>.card').addClass("hidden").viewportChecker({
	    classToAdd: 'visible animated fadeIn',
	    classToRemove: 'hidden',
	    offset: 50,
	});

});