(function() {

  // Don't edit any of this
  var height = 50, width = 400;

  var svg = d3.select("#chart3")
    .select("svg")
    .attr("height", height + 50)
    .attr("width", width + 50)
    .select("g")
    .attr("transform", "translate(25, 25)")

  var datapoints = [
    { 'name': 'Panda', 'weight': 150 },
    { 'name': 'Cat', 'weight': 8 },
    { 'name': 'Horse', 'weight': 840 },
    { 'name': 'Pig', 'weight': 100 }
  ]

  // Build your scales here
  var xPositionScale = d3.scalePoint()
                         .domain(['Panda', 'Cat', 'Horse', 'Pig'])
                         .range([0, width])
  var radiusScale = d3.scaleSqrt().domain([0,1000]).range([0,50])

  // Set your attributes here
  svg.selectAll("circle")
    .data(datapoints)
    .attr('cy', height/2)
    .attr('r', d => radiusScale(d.weight))
    .attr('cx', d => xPositionScale(d.name))

})()