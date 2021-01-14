export default function AreaChart(container){
	// initialization
	// input: selector for a chart container, e.g. '.chart'
	
	const m = 60
	const margin = ({ top: m, right: m, bottom: m, left: m })
	const width = 700 - margin.left - margin.right
	const height = 200 - margin.top - margin.bottom

	var svg = d3.select(container)
		.append('svg')
		.attr('viewBox', [0, 0, 
			width + margin.left + margin.right, 
			height + margin.top + margin.bottom])
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

	var xScale = d3.scaleTime()
		.range([0, width])

	var yScale = d3.scaleLinear()
		.rangeRound([height, 0])

	svg.append('path')
		.attr('class', 'area')
		.attr('fill', d3.schemeTableau10[3])
	
	svg.append('text')
		.attr('x', -20)
		.attr('y', -20)
		.attr('font-size', 14)
		.text('Total Unemployment')
		.attr('fill', '#5b5b5b')

	var xAxis = d3.axisBottom().scale(xScale)
	var yAxis = d3.axisLeft().scale(yScale).ticks(3, 's')
	var xAxisGroup = svg.append('g').attr('class', 'axis x-axis')
	var yAxisGroup = svg.append('g').attr('class', 'axis y-axis')

	// update scales, encodings, axes (using the total count)
	function update(data) {
		xScale.domain(d3.extent(data, d => d.date))
		yScale.domain([0, d3.max(data, d => d.total)])

		var area = d3.area()
			.x(d => xScale(d.date))
			.y0(yScale(0))
			.y1(d => yScale(d.total))
		
		d3.select('.area')
			.datum(data)
			.attr('d', area)

		svg.select('.x-axis')
			.call(xAxis)
			.attr('transform', `translate(0, ${height})`)
	
		svg.select('.y-axis')
			.call(yAxis)

		xAxisGroup.call(xAxis)
			.attr('transform', `translate(0, ${height})`)

		yAxisGroup.call(yAxis)
	}

	var brush = d3.brushX()
		.extent([[0, 0], [width, height]])
		.on('brush', brushed)
		.on('end', brushed)

	svg.append('g')
		.attr('class', 'brush')
		.call(brush)

	var listeners = { brushed: null }

	function on(event, listener) {
		listeners[event] = listener
	}

	function brushed(event) {
		if (event.selection) {
			listeners['brushed'](event.selection.map(xScale.invert))
		}
	}

	return { update, on }
}
