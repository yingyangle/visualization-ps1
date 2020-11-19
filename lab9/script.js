var viz = {
	"$schema": "https://vega.github.io/schema/vega-lite/v4.json",
	"data": {
		"url": "https://api.covidtracking.com/v1/states/current.csv"
	},
	"config": {
		"background": "transparent"
	},
	"vconcat": [
		// SCATTER PLOT
		{
			"width": 500,
			"height": 400,
			"mark": {
				"type": "circle",
				"size": 80,
				"tooltip": true
			},
			"encoding": {
				"x": {
					"field": "positive", 
					"type": "quantitative",
					"title": "Positive Cases"
				},
				"y": {
					"field": "death", 
					"type": "quantitative",
					"title": "Deaths"
				},
				"color": {
					"field": "dataQualityGrade",
					"title": "Data Quality",
					"scale": {
						"range": [
							"#83bcb6",
							"#88d27a",
							"#f2cf5b",
							"#f58518", 
							"#e45756"
							]
					}
				},
				"tooltip": [
					{"field": "state", "type": "nominal", "title": "State"},
					{"field": "death", "type": "quantitative", "title": "Deaths"},
					{"field": "positive", "type": "quantitative", "title": "Positive Cases"}
				]
			},
			"selection": {
				"brush": {"type": "interval"} 
			}
		},

		// BAR CHART
		{
			"repeat": ["hospitalizedCumulative", "recovered"],
			"columns": 1,
			"spec":{
				"width": 500,
				"height": 200,
				"mark": {
						"type": "bar",
						"color": "#79b7bb",
						"tooltip": true
				},
				"encoding": {
					"x": {
						"field": "state",
						"type": "nominal",
						"title": "State"
					},
					"y": {
						"field": {"repeat": "repeat"},
						"type": "quantitative"
					},
					"tooltip": {
						"field": {"repeat": "repeat"}, 
						"type": "quantitative"
					}
				},
				"transform": [{
					"filter": {"selection": "brush"}
				}] 
			}
		}

	]
	
}

// embed visualization
vegaEmbed('#viz', viz);