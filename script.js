
function showImage(lab) {
	document.querySelector(".image-container").style.display = 'inline'
	var img = 'img/' + lab.slice(lab.lastIndexOf('/')+1, lab.length) + '.png'
	document.querySelector(".image-container img").src = img
}

function hideImage() {
	document.querySelector(".image-container").style.display = 'none'
}

document.querySelectorAll('#container a').forEach(function(element) {
	element.addEventListener('mouseover', function() {
		showImage(element.href)
	})
	element.addEventListener('mouseout', hideImage)
})