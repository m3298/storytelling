import * as d3 from 'd3'

// Set up margin/height/width
const margin = { top: 80, left: 30, right: 120, bottom: 30 }
const height = 600 - margin.top - margin.bottom
const width = 500 - margin.left - margin.right

console.log('Building chart 5')

// Add your svg
const svg = d3
  .select('#chart-05')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create a time parser (see hints)
const parseTime = d3.timeParse('%B-%y')

// Create your scales
const xPositionScale = d3.scaleLinear().range([0, width])
const yPositionScale = d3.scaleLinear().range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .range([
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
    '#ff7f00',
    '#cab2d6',
    '#6a3d9a'
  ])

// Create a d3.line function that uses your scales
const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.datetime)
  })
  .y(function(d) {
    return yPositionScale(d.price)
  })

// Read in your housing price data
d3.csv(require('../data/housing-prices.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

// Write your ready function
function ready(datapoints) {
  // Convert your months to dates
  datapoints.forEach(d => (d.datetime = parseTime(d.month)))
  const dates = datapoints.map(function(d) {
    return d.datetime
  })
  // d3.extent gives me the max and min at the same time
  xPositionScale.domain(d3.extent(dates))

  const prices = datapoints.map(function(d) {
    return d.price
  })
  yPositionScale.domain(d3.extent(prices))
  // Get a list of dates and a list of prices

  // Group your data together
  const nested = d3
    .nest()
    .key(d => d.region)
    .entries(datapoints)

  console.log(nested)
  // Draw your lines
  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', d => colorScale(d.key))
    .attr('d', function(d) {
      console.log('this nested thing is', d)
      return line(d.values)
    })

  // Add circles
  svg
    .selectAll('circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('r', 3)
    .attr('cx', width)
    .attr('cy', function(d) {
      console.log('d.values is', d.values)
      console.log('d.key is', d.key)
      const datapoints = d.values
      // Finds the datapoint where 'datetime' is July-17
      const lastmonthData = datapoints.find(function(d) {
        return d.month === 'July-17'
      })
      console.log('last month is', lastmonthData)
      return yPositionScale(lastmonthData.price)
    })
    .attr('fill', d => colorScale(d.key))

  // Add your text on the right-hand side
  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .text(d => d.key)
    .attr('x', width)
    .attr('y', function(d) {
      console.log('d.values is', d.values)
      console.log('d.key is', d.key)
      const datapoints = d.values
      // Finds the datapoint where 'datetime' is July-17
      const lastmonthData = datapoints.find(function(d) {
        return d.month === 'July-17'
      })
      console.log('last month is', lastmonthData)
      return yPositionScale(lastmonthData.price)
    })
    .attr('font-size', 12)
    .style('fill', d => colorScale(d.key))
    .attr('dx', 6) // Offset 6 pixels to the right
    .attr('dy', function(d) {
      if (d.key === 'West North Central') {
        return 5
      }
      if (d.key === 'South Atlantic') {
        return -3
      } else {
        return 0
      }
    })
    .attr('alignment-baseline', 'middle')

  // Add your title
  svg
    .append('text')
    .text('U.S. housing prices fall in winter')
    .attr('x', width / 2)
    .attr('dx', 30)
    .attr('dy', -30)
    .attr('text-anchor', 'middle')
    .attr('font-size', 20)

  svg
    .append('rect')
    .datum(datapoints)
    .attr('x', function(d) {
      return xPositionScale(parseTime('December-16'))
    })
    .attr('y', 0)
    .attr('width', function(d) {
      return (
        xPositionScale(parseTime('February-17')) -
        xPositionScale(parseTime('December-16'))
      )
    })
    .attr('height', height)
    .attr('fill', 'lightgrey')
    .attr('fill-opacity', 0.5)
    .lower()

  // Add your axes
  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.timeFormat('%b %y'))
    .ticks(9)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale).ticks(7)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
