(function() {
  var height = 200, width = 400;

  var svg = d3.select("#chart5")
    .select("svg")
    .attr("height", height)
    .attr("width", width)

  var datapoints = [
    {"hotdogs":10,"hamburgers":10,"animal":"dog","name":"Stevie"},
    {"hotdogs":3,"hamburgers":3,"animal":"cat","name":"Nicholas"},
    {"hotdogs":2,"hamburgers":2,"animal":"cat","name":"Bubbletree"},
    {"hotdogs":10,"hamburgers":3,"animal":"cow","name":"Particle"},
    {"hotdogs":7,"hamburgers":5,"animal":"dog","name":"Jumpup"},
    {"hotdogs":4,"hamburgers":9,"animal":"dog","name":"Parlay"},
    {"hotdogs":3,"hamburgers":1,"animal":"cat","name":"Hio"}
  ]

  // Build your scales here
  var xPosScale = d3.scaleLinear().domain([0,10]).range([0, width])
  var colourScale = d3.scaleOrdinal()
                    .domain(["dog","cat", "cow"])
                    .range(['#7fc97f',
                      '#beaed4',
                      '#fdc086'])
  var radiusScale = d3.scaleSqrt().domain([0,10]).range([0,30])

  // Add your circles and style them here
  svg.selectAll("circle")
    .data(datapoints)
    .enter().append("circle")
    .attr('r', d => radiusScale(d.hotdogs))
    .attr('cx', d => xPosScale(d.hamburgers))
    .attr('cy', height / 2)
    .attr('fill', d => colourScale(d.animal))
    .attr('fill-opacity',0.5)

})()