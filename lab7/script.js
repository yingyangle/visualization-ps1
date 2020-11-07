var displayType = 'force'

const m = 80
const margin = ({ top: m, right: m, bottom: m, left: m })
const width = 900 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom

var svg = d3.selectAll('#chart')
	.append('svg')
	.attr('width', width)
	.attr('height', height)
	.attr('viewBox', [0, 0, width, height]) 

var circleScale = d3.scaleLinear().range([0, 9])

Promise.all([ // load multiple files
	d3.json('airports.json'), 
	d3.json('world-110m.json')
]).then(data => {
	let airports = data[0] // data1.csv
	let worldmap = data[1] // data2.json
	
	var worldmap_data = topojson.feature(worldmap, worldmap.objects.countries)
	var projection = d3.geoNaturalEarth1()
		.fitExtent([[0, 0], [width, height]], worldmap_data)
	var path = d3.geoPath()
		.projection(projection)
	
	var map = svg.append('path')
		.datum(worldmap_data)
		.attr('d', path)
		.attr('fill', '#e3e3e3')
		.style('opacity', 0)

	var map_boundaries = svg.append('path')
		.datum(topojson.mesh(worldmap, worldmap.objects.countries))
		.attr('d', path)
		.attr('class', 'subunit-boundary')
		.attr('stroke', 'white')
		.attr('fill', 'none')
		.style('opacity', 0)

	circleScale.domain([0, d3.max(airports.nodes, d => d.passengers)])

	const force = d3.forceSimulation(airports.nodes)
		.force('charge', 
			d3.forceManyBody().strength(-7))
		.force('link', 
			d3.forceLink(airports.links).distance(44))
		.force('center', 
			d3.forceCenter()
				.x(width / 2)
				.y(height / 2)
		)
	
	var edges = svg.selectAll('line')
		.data(airports.links)
		.enter()
		.append('line')
		.style('stroke', '#9d9d9d')
	
	var nodes = svg.selectAll('circle')
		.data(airports.nodes)
		.enter()
		.append('circle')
		.attr('r', d => circleScale(d.passengers))
		.style('fill', 'rgb(139, 189, 186)')
		.call(drag(force))
		
	nodes.append('title')
		.text(d => d.name)
	
	force.on('tick', function() {
		// update positions
		edges
			.attr('x1', d => d.source.x)
			.attr('y1', d => d.source.y)
			.attr('x2', d => d.target.x)
			.attr('y2', d => d.target.y)
		nodes
			.attr('cx', d => d.x)
			.attr('cy', d => d.y)
	})

	// switch display type between 'force' and 'map'
	function switchLayout() {
		if (displayType == 'force') { // FORCE LAYOUT
			// restart the simulation
			// set the map opacity to 0
			force.alpha(1).restart()
			map.transition(1100).style('opacity', 0)
			map_boundaries.transition(1100).style('opacity', 0)
		} else { // MAP LAYOUT
			// stop the simulation
			// set the positions of links and nodes based on geo-coordinates
			// set the map opacity to 1
			force.stop()
			nodes.transition(1300)
				.attr('cx', d => d.x = projection([d.longitude, d.latitude])[0])
				.attr('cy', d => d.y = projection([d.longitude, d.latitude])[1])
			edges.transition(1300).attr('x1', d => d.source.x)
				.attr('y1', d => d.source.y)
				.attr('x2', d => d.target.x)
				.attr('y2', d => d.target.y)
			map.transition(1100)
				.style('opacity', 1)
			map_boundaries.transition(1100)
				.style('opacity',1)
		}
	}
		
	d3.selectAll('input[name=display-type]').on('change', event => {
		displayType = event.target.value // selected display type
		switchLayout()
	})
})

var drag = force => {

	function dragStart(event) {
		if (!event.active) force.alphaTarget(0.3).restart()
		event.subject.fx = event.subject.x
		event.subject.fy = event.subject.y
	}
	
	function dragged(event) {
		event.subject.fx = event.x
		event.subject.fy = event.y
	}
	
	function dragEnd(event) {
		if (!event.active) force.alphaTarget(0)
		event.subject.fx = null
		event.subject.fy = null
	}
	
	return d3.drag()
		.on('start', dragStart)
		.on('drag', dragged)
		.on('end', dragEnd)
		.filter(event => displayType == 'force')
}

