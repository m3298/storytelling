import * as d3 from 'd3'

console.log('Building chart 7')

// Set up margin/height/width
const margin = { top: 30, left: 50, right: 15, bottom: 30 }
const height = 250 - margin.top - margin.bottom
const width = 180 - margin.left - margin.right

const container = d3.select('#chart-07')

// Create your scales
const xPositionScale = d3
  .scaleLinear()
  .domain([1980, 2010])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 20000])
  .range([height, 0])

// Create your line generator
const line = d3
  .line()
  .x(d => {
    return xPositionScale(d.year)
  })
  .y(d => {
    return yPositionScale(d.income)
  })

// Read in your data
Promise.all([
  d3.csv(require('../data/middle-class-income.csv')),
  d3.csv(require('../data/middle-class-income-usa.csv'))
])
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Create your ready function
function ready([datapointsAll, datapointsUSA]) {
  console.log('all datapoints are', datapointsAll)
  console.log('USA data is', datapointsUSA)

  const nested = d3
    .nest()
    .key(d => d.country)
    .entries(datapointsAll)

  container
    .selectAll('svg')
    .data(nested)
    .enter()
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    // Do this for each svg
    .each(function(d) {
      const svg = d3.select(this)
      // console.log('nested is', nested)

      // ADD LINES FOR US
      svg
        .append('path')
        .datum(datapointsUSA)
        .attr('stroke', 'grey')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('d', line)

      // ADD LINES FOR non-US
      svg
        .append('path')
        .attr('stroke', '#9e4b6c')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('d', function(d) {
          return line(d.values)
        })

      // ADD COUNTRY LABELS
      const country = d.key
      svg
        .append('text')
        .text(country)
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('font-size', 14)
        .attr('font-weight', 'bold')
        .attr('dx', 5)
        .attr('dy', -15)
        .style('fill', '#9e4b6c')

      // ADD USA LABEL
      svg
        .append('text')
        .text('USA')
        .attr('x', 10)
        .attr('y', 28)
        // .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .style('fill', 'grey')

      // ADD AXES
      const xAxis = d3
        .axisBottom(xPositionScale)
        .ticks(4)
        .tickFormat(d3.format('d'))
        .tickSize(-height)

      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      const yAxis = d3
        .axisLeft(yPositionScale)
        .tickFormat(d3.format('$,d'))
        .ticks(5)
        .tickValues([5000, 10000, 15000, 20000])
        .tickSize(-width)

      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)

      // Make dashed gridlines
      svg.selectAll('.domain').remove()
      svg.selectAll('.tick line').attr('stroke-dasharray', '2 2')
    })
}
