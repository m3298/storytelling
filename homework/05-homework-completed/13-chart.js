/* global d3 */
;(function() {
  // Build your SVG here
  // using all of that cut-and-paste magic

  var margin = { top: 50, left: 100, right: 50, bottom: 50 }

  var height = 400 - margin.top - margin.bottom

  var width = 400 - margin.left - margin.right

  // Grab the SVG from the page, set the height and width
  var svg = d3
    .select('#chart13')
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // Build your scales here
  var yPositionScale = d3.scaleBand().range([height, 0])
  var widthScale = d3
    .scaleLinear()
    .domain([0, 10])
    .range([0, width])
  var colorScale = d3.scaleOrdinal().range(['indianred', 'darkred', 'pink'])

  d3.csv('eating-data.csv')
    .then(ready)
    .catch(function(err) {
      console.log('Failed on', err)
    })

  function ready(datapoints) {
    var names = datapoints.map(function(d) {
      return d.name
    })
    yPositionScale.domain(names)

    // Add and style your marks here
    svg
      .selectAll('rect')
      .data(datapoints)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', function(d) {
        return yPositionScale(d['name'])
      })
      .attr('width', function(d) {
        return widthScale(d['hamburgers'])
      })
      .attr('height', yPositionScale.bandwidth())
      .attr('fill', function(d) {
        return colorScale(d['animal'])
      })

    var yAxis = d3.axisLeft(yPositionScale)
    svg
      .append('g')
      .attr('class', 'axis y-axis')
      .call(yAxis)

    var xAxis = d3.axisBottom(widthScale)
    svg
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
  }
})()
