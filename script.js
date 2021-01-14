// show image preview
function showImage(lab) {
	$('.image-container').css('display', 'inline')
	var img = 'img/' + lab.slice(lab.lastIndexOf('/')+1, lab.length) + '.png'
	$('.image-container img').attr('src', img)
}

// hide image preview
function hideImage() {
	$('.image-container').css('display', 'none')
}

// show image preview on hover
$('#container a').on('mouseover', function() {
		console.log($(this), $(this).attr('href'))
		showImage($(this).attr('href'))
	})
$('#container a').on('mouseout', hideImage)

// make image preview follow cursor
$(document).bind('mousemove', function(e){
	$('.image-container').css({
		left: e.pageX + 20,
		top: e.pageY + 20,
	})
})