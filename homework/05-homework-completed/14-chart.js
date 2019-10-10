/* global d3 */
;(function() {
  // Build your SVG here
  // using all of that cut-and-paste magic

  var margin = { top: 50, left: 100, right: 50, bottom: 50 }

  var height = 400 - margin.top - margin.bottom

  var width = 700 - margin.left - margin.right

  // Grab the SVG from the page, set the height and width
  var svg = d3
    .select('#chart14')
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // Build your scales here
  var xPositionScale = d3.scaleBand().range([0, width])
  var heightScale = d3
    .scaleLinear()
    .domain([0, 10])
    .range([0, height])
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

    xPositionScale.domain(names)

    // Add and style your marks here
    svg
      .selectAll('rect')
      .data(datapoints)
      .enter()
      .append('rect')
      .attr('y', function(d) {
        return height - heightScale(d['hamburgers'])
      })
      .attr('x', function(d) {
        return xPositionScale(d['name'])
      })
      .attr('height', function(d) {
        return heightScale(d['hamburgers'])
      })
      .attr('width', xPositionScale.bandwidth())
      .attr('fill', function(d) {
        return colorScale(d['animal'])
      })

    var yAxis = d3.axisLeft(heightScale)
    svg
      .append('g')
      .attr('class', 'axis y-axis')
      .call(yAxis)

    var xAxis = d3.axisBottom(xPositionScale)
    svg
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
  }
})()
