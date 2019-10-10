import * as d3 from 'd3'

var margin = { top: 100, left: 30, right: 30, bottom: 30 }

var height = 300 - margin.top - margin.bottom

var width = 700 - margin.left - margin.right

var container = d3.select('#chart-2')

// Create our scales
var xPositionScale = d3
  .scaleLinear()
  .domain([1, 12])
  .range([0, width])
var yPositionScale = d3
  .scaleLinear()
  .domain([20, 100])
  .range([height, 0])

// Create a line generator
// This explains how to compute
// the points that make up the line
var line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.month)
  })
  .y(function(d) {
    return yPositionScale(d.high)
  })

// Read in files
d3.csv(require('./all-temps.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready(datapoints) {
  var nested = d3
    .nest()
    .key(function(d) {
      return d.city
    })
    .entries(datapoints)

  // We have 6 groups of data
  // We want 6 SVGs
  container
    .selectAll('svg')
    .data(nested)
    .enter()
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      var name = d.key
      var datapoints = d.values

      // What SVG are we in? Let's grab it.
      var svg = d3.select(this)

      svg
        .append('path')
        .datum(datapoints)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', 'black')

      svg
        .append('text')
        .text(name)
        .attr('x', width / 2) // in the center
        .attr('text-anchor', 'middle') // center aligned
        .attr('dy', -10)

      var xAxis = d3.axisBottom(xPositionScale)
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      var yAxis = d3.axisLeft(yPositionScale)
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
    })
}
