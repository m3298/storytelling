import * as d3 from 'd3'

const margin = { top: 30, left: 60, right: 30, bottom: 30 }
const height = 200 - margin.top - margin.bottom
const width = 600 - margin.left - margin.right

const svg = d3
  .select('#chart-04')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Scales
const xPositionScale = d3.scaleLinear().range([0, width])

const yPositionScale = d3
  .scaleBand()
  .range([height, 0])
  .padding(0.25)

// Read in data
d3.csv(require('../data/animal-counts-2.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  // set axes domains
  const kind = datapoints.map(function(d) {
    return d.kind
  })
  yPositionScale.domain(kind)

  const count = datapoints.map(function(d) {
    return +d.count
  })
  xPositionScale.domain([0, d3.max(count)])

  // draw bars
  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('x', 0)
    .attr('y', function(d) {
      return yPositionScale(d.kind)
    })
    .attr('width', function(d) {
      return xPositionScale(d.count)
    })
    .attr('height', yPositionScale.bandwidth())
    .attr('fill', 'pink')
  // Add your axes
  const xAxis = d3.axisBottom(xPositionScale).ticks(5)

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
