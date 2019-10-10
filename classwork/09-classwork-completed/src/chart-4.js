import * as d3 from 'd3'

var margin = { top: 30, left: 100, right: 100, bottom: 30 }

var height = 300 - margin.top - margin.bottom

var width = 700 - margin.left - margin.right

var svg = d3
  .select('#chart-4')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create our scales
var xPositionScale = d3
  .scaleLinear()
  .domain([20, 100])
  .range([0, width])

var yPositionScale = d3
  .scalePoint()
  .range([height, 0])
  .padding(0.5)

// Read in files
d3.csv(require('./all-temps.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  var nested = d3
    .nest()
    .key(function(d) {
      return d.city
    })
    .entries(datapoints)

  // Go through each group, pull out the name of that group
  var names = nested.map(d => d.key)
  // Teach it to the y position scale
  yPositionScale.domain(names)

  // Add a g element for every single city
  // and then let's do something with each of you
  svg
    .selectAll('g')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      return `translate(0,${yPositionScale(d.key)})`
    })
    .each(function(d) {
      var g = d3.select(this)
      var name = d.key
      var datapoints = d.values

      var maxHigh = d3.max(datapoints, d => d.high)
      var minHigh = d3.min(datapoints, d => d.high)

      g.append('line')
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('x1', xPositionScale(maxHigh))
        .attr('x2', xPositionScale(minHigh))
        .attr('stroke', 'black')

      g.append('circle')
        .attr('r', 7)
        .attr('fill', 'pink')
        .attr('cy', 0)
        .attr('cx', xPositionScale(maxHigh))

      g.append('circle')
        .attr('r', 7)
        .attr('fill', 'lightblue')
        .attr('cy', 0)
        .attr('cx', xPositionScale(minHigh))
    })

  var xAxis = d3.axisBottom(xPositionScale).tickSize(-height)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  svg.selectAll('.x-axis line').attr('stroke-dasharray', '1 3')
  svg.selectAll('.x-axis path').remove()

  var yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  svg.selectAll('.y-axis path, .y-axis line').remove()
}
