import AreaChart from './AreaChart.js'
import StackedAreaChart from './StackedAreaChart.js'

d3.csv('unemployment.csv', d3.autoType).then(data => {

	var categories = data.columns.slice(1, -1)
	data.categories = categories

	data.map(function(d) {
		var total = 0
		for (var industry in d) {
			if (industry == 'date') continue
			total += d[industry]
		}
		d.total = total
		return d
	})
	
	var area_chart = AreaChart('.area-chart')
	area_chart.update(data)
	area_chart.on('brushed', function(range) {
		stacked_chart.filterByDate(range)
	})

	var stacked_chart = StackedAreaChart('.stacked-chart')
	stacked_chart.update(data)

})