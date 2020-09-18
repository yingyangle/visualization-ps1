
// load dataset
let attractions;
fetch('attractions.json')
	.then(response => response.json())
	.then(data => {
		attractions = data;
		filterData('all');
	})

// filter attractions by the selected category
// filter top 5 attractions
function filterData(category) {
	chart_data = attractions
	// filter data based on category
	if (category != 'all') {
		chart_data = chart_data.filter(function(x) {
			return x.Category === category
		})
	}
	// filter top 5 attractions
	chart_data.sort((a, b) => b.Visitors - a.Visitors);
	var chart_data = chart_data.slice(0,5)
	// render bar chart
	renderBarChart(chart_data);
}


// define an event listener for the dropdown menu
// call filterData with the selected category
document.querySelector('#attraction-category').addEventListener('change', function() {
	filterData(event.target.value)
})
