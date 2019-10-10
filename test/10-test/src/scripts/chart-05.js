import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 60, bottom: 30 }
const height = 300 - margin.top - margin.bottom
const width = 680 - margin.left - margin.right

const svg = d3
  .select('#chart-05')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create your scales
const xPositionScale = d3
  .scaleLinear()
  .domain([2001, 2007])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 20])
  .range([height, 0])

const line = d3
  .line()
  .x(d => xPositionScale(d.year))
  .y(d => yPositionScale(d.sales))

// Import your data file using d3.csv
d3.csv(require('../data/product_sales.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  // Draw your areas
  const nested = d3
    .nest()
    .key(d => d.product)
    .entries(datapoints)

  console.log(nested)
  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', function(d) {
      if (d.key === 'coffee') {
        return 'red'
      } else {
        return 'lightgrey'
      }
    })
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
