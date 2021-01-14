export default function StackedAreaChart(container) {

	const m = 60
	const margin = ({ top: m, right: m, bottom: m, left: m })
	const width = 700 - margin.left - margin.right
	const height = 400 - margin.top - margin.bottom

	var svg = d3.selectAll(container)
		.append('svg')
		.attr('viewBox', [0, 0, 
			width + margin.left + margin.right, 
			height + margin.top + margin.bottom])
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

	var xScale = d3
		.scaleTime()
		.range([0, width])
	
	var yScale = d3
		.scaleLinear()
		.range([height, 0])
	
	var colorScale = d3.scaleOrdinal()
		.range(d3.schemeTableau10)
	
	var xAxis = d3.axisBottom()
		.scale(xScale)
	
	var yAxis = d3.axisLeft()
		.scale(yScale).ticks(5, 's')

	var xAxisGroup = svg.append('g')
		.attr('class', 'axis x-axis')

	var yAxisGroup = svg.append('g')
		.attr('class', 'axis y-axis')

	var tooltip = svg
		.append('text')
		.attr('x', -20)
		.attr('y', -20)
		.attr('font-size', 14)
	
	svg.append('clipPath')
		.attr('id', 'clip')
		.append('rect')
		.attr('width', width)
		.attr('height', height)
		.attr('x', 0)
		.attr('y', 0)
  
	var selected = null, xDomain, data

	function update(_data) {
		data = _data

		var keys = selected ? [selected] : data.categories
		
		var stack = d3.stack()
			.keys(keys)
			.order(d3.stackOrderNone)
			.offset(d3.stackOffsetNone)

		var series = stack(data)
	
		colorScale.domain(keys)
		xScale.domain(xDomain ? xDomain : d3.extent(data, d => d.date))
		yScale.domain([0, d3.max(series, a => d3.max(a, d => d[1]))])

		var area = d3.area()
			.x(d => xScale(d.data.date))
			.y0(d => yScale(d[0]))
			.y1(d => yScale(d[1]))
		
		var areas = svg.selectAll('.area')
			.data(series, d => d.key)
		
		areas.enter()
			.append('path')
			.attr('clip-path', 'url(#clip)')
			.attr('class', 'area')
			.attr('id', d => 'myArea ' + d.key)
			.attr('fill', d => colorScale(d.key))
			.on('mouseover', (event, d) => tooltip.text(d.key))
			.on('mouseout', (event, d) => {
				if (selected == null) tooltip.text('')
			})
			.on('click', (event, d) => {
				if (selected == d.key) selected = null
				else selected = d.key
				tooltip.text(d.key)
				update(data)
			})
			.merge(areas)
			.attr('d', area)
		
		areas.exit().remove()
		
		xAxisGroup.call(xAxis)
			.attr('transform', `translate(0, ${height})`)

		yAxisGroup.call(yAxis)
	}

	function filterByDate(range) {
		xDomain = range
		update(data)
	}
	
	return { update, filterByDate }
}