import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 100, bottom: 30 }

var height = 300 - margin.top - margin.bottom

var width = 700 - margin.left - margin.right

var svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)

// Read in files
d3.csv(require('./all-temps.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  // I'm making a group of stuff!
  // Move the WHOLE THING right 20 and down 20
  var g = svg
    .append('g')
    .attr('transform', 'translate(20,20) rotate(20) scale(2)')

  // Put a circle in that group!
  g.append('circle')
    .attr('r', 4)
    .attr('cx', 0)
    .attr('cy', 0)

  // Put some text in that group!
  g.append('text')
    .text('I am some text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('dx', 10)
    .attr('dy', 5)
}
