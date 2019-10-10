import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 680 - margin.left - margin.right

console.log('Building chart 3')

const svg = d3
  .select('#chart-03')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create your scales
const xPositionScale = d3
  .scaleLinear()
  .domain([2000, 2014])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 500])
  .range([height, 0])

const colorScale = d3.scaleOrdinal().range(['#ccebc5', '#b3cde3', '#fbb4ae'])

// Do you need a d3.line function for this? Maybe something similar?
const line = d3
  .area()
  .x(d => {
    return xPositionScale(d.Year)
  })
  .y0(height)
  .y1(d => {
    return yPositionScale(d.Value)
  })

// Import your data file using d3.csv
d3.csv(require('../data/air-emissions.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  // Draw your areas
  const nested = d3
    .nest()
    .key(d => d.Country)
    .entries(datapoints)

  console.log(nested)
  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('fill', d => colorScale(d.key))
    .attr('fill-opacity', 0.8)
    .attr('stroke', d => colorScale(d.key))
    .attr('d', function(d) {
      console.log('this nested thing is', d)
      return line(d.values)
    })

  // Add your axes
  const xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.format('d'))

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
