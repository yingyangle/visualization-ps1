// scatter plot - cities
d3.csv('wealth-health-2014.csv', d3.autoType)
	.then(data => {
		console.log('data', data)

		const m = 60
		const margin = ({top: m, right: m, bottom: m, left: m})
		const width = 650 - margin.left - margin.right
		const height = 500 - margin.top - margin.bottom
		
		const svg = d3.select('.chart')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		const xScale = d3
			.scaleSqrt()
			.domain(d3.extent(data, d => d.Income))
			.range([0, width])
		
		const yScale = d3
			.scaleSqrt()
			.domain(d3.extent(data, d => d.LifeExpectancy))
			.range([height, 0])

		const xAxis = d3.axisBottom()
			.scale(xScale)
			.ticks(5, 's')
		
		const yAxis = d3.axisLeft()
			.scale(yScale)
			.ticks(5, 's')

		svg.append('g')
			.attr('class', 'axis x-axis')
			.attr('transform', `translate(0, ${height})`)
			.call(xAxis)
		
		svg.append('g')
			.attr('class', 'axis y-axis')
			.call(yAxis)
		
		// x-axis label
		svg.append("text")
			.attr('x', width / 2)
			.attr('y', height + 50)
			.attr('font-family', 'Lucida Grande')
			.attr('fill', '#6d6d6d')
			.text('Income ($)')
		
		// y-axis label
		svg.append('text')
			.attr('x', -1 * height / 2 - 40)
			.attr('y', -40)
			.attr('transform', 'rotate(-90)')
			.attr('font-family', 'Lucida Grande')
			.attr('fill', '#6d6d6d')
			.text('Life Expectancy (yrs)')
		
		// color scheme
		colorScale = d3.scaleOrdinal(d3.schemeTableau10)

		// circle size
		const sizeScale = d3.scaleSqrt()
			.domain(d3.extent(data, d => d.Population))
			.range([1, 28])

		// scatter plot circles
		svg.selectAll('circle')
			.data(data)
			.enter()
			.append('circle')
			.attr('cx', d => xScale(d.Income))
			.attr('cy', d => yScale(d.LifeExpectancy))
			.attr('r', d => sizeScale(d.Population))
			.attr('fill', d => colorScale(d.Region))
			.attr('fill-opacity', 0.8)
			.on('mouseenter', (event, d) => {
				// show tooltip on hover
				const pos = d3.pointer(event, window)
				d3.select('.mytooltip')
					.style('display', 'block')
					.style('position', 'fixed')
					.style('padding', '16px')
					.style('text-align', 'left')
					.style('background-color', '#6d6d6d')
					.style('color', 'white')
					.style('opacity', '0.8')
					.style('top', pos[1] + 'px')
					.style('left', pos[0] + 'px')
					.html(
						'<p id="mytooltip">Country: ' +d.Country +
						'<br>Region: ' + d.Region +
						'<br>Population: ' + d3.format(',.3r')(d.Population) +
						'<br>Income: $' + d3.format(',.1r')(d.Income) +
						'<br>Life Expectancy: ' + d.LifeExpectancy + ' years</p>'
					)
			})
			.on('mouseleave', (event, d) => { 
				// hide tooltip on hover out
				d3.select('.mytooltip').style('display', 'none')
			})
		
		// legend boxes
		svg.append('g').selectAll('rect')
			.data(colorScale.domain())
			.enter()
			.append('rect')
			.attr('class', 'box')
			.attr('height', 10) 
			.attr('width', 10) 
			.attr('x', width - 130)
			.attr('y', (d, i) => height + i * 20 - 140)
			.attr('fill', d => colorScale(d));
		
		// legend text
		svg.append('g').selectAll('text')
			.data(colorScale.domain())
			.enter()
			.append('text')
			.text(d => d)
			.attr('x', width - 110)
			.attr('y', (d, i) => height + i * 20 - 131)
			.attr('font-size', '10px')
			.attr('fill', '#6d6d6d')
			.attr('font-family', 'Lucida Grande')
			.attr('text-anchor', 'beginning')

})
