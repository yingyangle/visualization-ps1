// scatter plot - cities
d3.csv('cities.csv', d=>{
	return {
		...d, // spread operator
		eu: d.eu === 'true', // convert to boolean
		population: +d.population,
		x: +d.x,
		y: +d.y,
	}
}).then(data_cities=>{
	console.log('cities', data_cities)
	// filter European cities only
	data_cities = data_cities.filter(city => city.eu == true)
	console.log('filtered cities', data_cities)

	d3.select('.city-count').text('Number of Cities: ' + data_cities.length)

	const width = 700
	const height = 550
	const svg = d3.select('.population-plot')
		.append('svg')
		.attr('viewBox', [0, 0, width, height])

	// scatter plot circles
	svg.selectAll('circle')
		.data(data_cities)
		.enter()
		.append('circle')
		.text(d => d.country)
		.attr('cx', (d,i) => d.x)
		.attr('cy', (d,i) => d.y)
		.attr('r', d => d.population < 1000000 ? 4 : 8)
		.attr('font-size', '13px')
		.attr('fill', '#78A1BB')
	
	// scatter plot labels
	svg.selectAll('text')
		.data(data_cities)
		.enter()
		.append('text')
		.text(d => d.population < 1000000 ? '' : d.city)
		.attr('r', d => d.population < 1000000? 4 : 8)
		.attr('x', (d,i) => d.x)
		.attr('y', (d,i) => d.y - 12) // put label above circle
		.attr('text-anchor', 'middle') // center label
		.attr('font-size', '13px')
		.attr('fill', '#6d6d6d')
})

// bar chart - buildings
d3.csv('buildings.csv', d=>{
	return {
		...d, // spread operator
		height: +d.height_px,
		floors: + d.floors
	}
}).then(data=>{
	console.log('buildings', data)
	data_buildings = data
	data_buildings = data_buildings.sort((a,b) => b.height - a.height)
	console.log('buildings', data_buildings)
	const extent = d3.extent(data_buildings, d=>d.height)
	console.log(data_buildings.length, extent)

	const width = 500
	const height = 600
	const svg = d3.select('.barchart')
		.append('svg')
		.attr('viewBox', [0, 0, width, height])
	
	// bars
	svg.selectAll('rect')
		.data(data_buildings)
		.enter()
		.append('rect')
		.attr('y', (d,i) => (50 * i + 28))
		.attr('x', (d,i) =>(190))
		.attr('width', d => d.height)
		.attr('height', 35)
		.attr('fill', '#78A1BB')
		.attr('class', 'bar')
		.on('click', (d,i) =>{
			d3.select('.building').text(i.building)
			d3.select('.country').text(i.country)
			d3.select('.city').text(i.city)
			d3.select('.height').text(i.height_ft + ' ft')
			d3.select('.floors').text(i.floors)
			d3.select('.completed').text(i.completed)
			d3.select('.image').attr('src', 'img/' + i.image)
		})

	// building name labels
	svg.selectAll('text.labels')
		.data(data_buildings)
		.enter()
		.append('text')
		.text(function(d){
			return d.building
		})
		.attr('x', (d,i) => (0))
		.attr('y', (d,i) => (50 * i + 50))
		.attr('text-anchor', 'left')
		.attr('font-size', '13px')
		.attr('fill', '#6d6d6d')
		.on('click', (d,i) =>{
			d3.select('.building').text(i.building)
			d3.select('.country').text(i.country)
			d3.select('.city').text(i.city)
			d3.select('.height').text(i.height_ft + ' ft')
			d3.select('.floors').text(i.floors)
			d3.select('.completed').text(i.completed)
			d3.select('.image').attr('src', 'img/' + i.image)
		})

	// height labels
	svg.selectAll('text.values')
		.data(data_buildings)
		.enter()
		.append('text')
		.text((d) => d.height + ' ft')
		.attr('x',d => 190 + d.height - 10)
		.attr('y', (d,i) => (50 * i + 50))
		.attr('text-anchor', 'end')
		.attr('font-size', '13px')
		.attr('fill', 'white')
		.on('click', (d,i) =>{
			d3.select('.building').text(i.building)
			d3.select('.country').text(i.country)
			d3.select('.city').text(i.city)
			d3.select('.height').text(i.height_ft + ' ft')
			d3.select('.floors').text(i.floors)
			d3.select('.completed').text(i.completed)
			d3.select('.image').attr('src', 'img/' + i.image)
		})
})

