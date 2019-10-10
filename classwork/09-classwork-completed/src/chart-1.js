import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 100, bottom: 30 }

var height = 300 - margin.top - margin.bottom

var width = 700 - margin.left - margin.right

var svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

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
  .x(d => xPositionScale(d.month))
  .y(d => yPositionScale(d.high))

// Read in files
d3.csv(require('./all-temps.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  // Draw the lines
  // We want 6 lines, not 72 or 1
  // so we need to put our datapoints
  // into 6 different groups
  var nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)

  console.log(nested)
  // 1 path for each group
  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('d', function(d) {
      console.log('this nested thing is', d)
      // Takes all of the datapoints in that
      // group and feeds them to the line
      // generator that we made before
      return line(d.values)
    })

  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .text(d => d.key)
    .attr('x', width)
    .attr('y', function(d) {
      // console.log(d.values)
      var datapoints = d.values
      // Finds the very last datapoint
      // var decData = datapoints[datapoints.length - 1]

      // Finds the datapoint where 'month' is 12
      var decData = datapoints.find(d => +d.month === 12)
      console.log('december is', decData)

      // Use the yPositionScale and the high temperature
      // of December to position our text
      return yPositionScale(decData.high)
    })
    .attr('font-size', 12)
    .attr('dx', 5) // Offset of 5 pixels to the right
    .attr('dy', function(d) {
      // Only push these two cities down some
      if (d.key === 'Melbourne' || d.key === 'Stockholm') {
        return 5
      } else {
        return 0
      }
    })
    .attr('alignment-baseline', 'middle')

  // Draw the circles
  svg
    .selectAll('.temp-circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 'temp-circle')
    .attr('r', 3)
    .attr('cx', function(d) {
      return xPositionScale(d.month)
    })
    .attr('cy', function(d) {
      return yPositionScale(d.high)
    })

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
}
