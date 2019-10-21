/* global d3 */
;(function() {
  // Build your SVG here
  // using all of that cut-and-paste magic

  var margin = { top: 25, left: 50, right: 50, bottom: 25 }

  var height = 200 - margin.top - margin.bottom

  var width = 400 - margin.left - margin.right

  // Grab the SVG from the page, set the height and width
  var svg = d3
    .select('#chart12')
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // Build your scales here
  var xPositionScale = d3
    .scaleLinear()
    .domain([0, 10])
    .range([0, width])
  var radiusScale = d3
    .scaleSqrt()
    .domain([0, 10])
    .range([0, 50])
  var colorScale = d3.scaleOrdinal().range(['red', 'blue', 'green'])

  d3.csv('eating-data.csv')
    .then(ready)
    .catch(function(err) {
      console.log('Failed on', err)
    })

  function ready(datapoints) {
    // Add and style your marks here
    svg
      .selectAll('circle')
      .data(datapoints)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('cx', function(d) {
        return xPositionScale(d['hamburgers'])
      })
      .attr('fill', function(d) {
        return colorScale(d['animal'])
      })
      .attr('r', function(d) {
        return radiusScale(d['hotdogs'])
      })
      .attr('cy', height / 2)
      .attr('opacity', 0.25)

    var xAxis = d3.axisBottom(xPositionScale)
    svg
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
  }
})()
