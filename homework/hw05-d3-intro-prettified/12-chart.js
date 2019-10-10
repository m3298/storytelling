;(function() {
  // Build your SVG here
  // using all of that cut-and-paste magic

  var margin = { top: 30, right: 20, bottom: 30, left: 20 }
  var width = 400 - margin.left - margin.right
  var height = 200 - margin.top - margin.bottom

  var svg = d3
    .select('#chart12')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // Build your scales here

  var xPositionScale = d3
    .scaleLinear()
    .domain([0, 10])
    .range([0, width])

  var colourScale = d3
    .scaleOrdinal()
    .domain(['dog', 'cat', 'cow'])
    .range(['#7fc97f', '#beaed4', '#fdc086'])
  var radiusScale = d3
    .scaleSqrt()
    .domain([0, 10])
    .range([0, 50])

  d3.csv('eating-data.csv')
    .then(ready)
    .catch(function(err) {
      console.log('Failed with', err)
    })

  function ready(datapoints) {
    // Add and style your marks here
    svg
      .selectAll('circle')
      .data(datapoints)
      .enter()
      .append('circle')
      .attr('r', d => radiusScale(d.hotdogs))
      .attr('cx', d => xPositionScale(d.hamburgers))
      .attr('cy', height / 2)
      .attr('fill', d => colourScale(d.animal))
      .attr('fill-opacity', 0.25)

    var xAxis = d3.axisBottom(xPositionScale)
    svg
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
  }
})()
