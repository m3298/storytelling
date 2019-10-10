import * as d3 from 'd3'

console.log('Building chart 6')

// Set up margin/height/width
const margin = { top: 20, left: 30, right: 15, bottom: 30 }
const height = 120 - margin.top - margin.bottom
const width = 100 - margin.left - margin.right

// I'll give you the container
const container = d3.select('#chart-06')

// Create your scales
const xPositionScale = d3
  .scaleLinear()
  .domain([12, 55])
  .range([0, width])
const yPositionScale = d3
  .scaleLinear()
  .domain([0, 0.3])
  .range([height, 0])

// Create a d3.area function that uses your scales
const USarea = d3
  .area()
  .x(d => {
    return xPositionScale(d.Age)
  })
  .y0(height)
  .y1(d => {
    return yPositionScale(d.ASFR_us)
  })

const JParea = d3
  .area()
  .x(d => {
    return xPositionScale(d.Age)
  })
  .y0(height)
  .y1(d => {
    return yPositionScale(d.ASFR_jp)
  })

// Read in your data
d3.csv(require('../data/fertility.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

// Build your ready function that draws lines, axes, etc
function ready(datapoints) {
  const nested = d3
    .nest()
    .key(d => d.Year)
    .entries(datapoints)

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

      // ADD US AREA
      console.log('chart-06 nested is', nested)
      svg
        .append('path')
        .attr('fill', '#2b8cbe')
        .attr('fill-opacity', 0.5)
        .attr('d', function(d) {
          return USarea(d.values)
        })

      // ADD JAPAN AREA
      svg
        .append('path')
        .attr('fill', 'red')
        .attr('fill-opacity', 0.5)
        .attr('d', function(d) {
          return JParea(d.values)
        })

      // ADD YEAR LABELS
      const year = d.key
      svg
        .append('text')
        .text(year)
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('font-size', 13.5)
        .attr('dy', -9)

      // ADD TOTAL FERTILITY LABELS
      const datapoints = d.values
      const JPfertility = d3.sum(datapoints, function(d) {
        return d.ASFR_jp
      })
      const USfertility = d3.sum(datapoints, function(d) {
        return d.ASFR_us
      })

      svg
        .append('text')
        .text(JPfertility.toFixed(2))
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('dx', 4)
        .attr('dy', 29)
        .attr('text-anchor', 'right')
        .attr('font-size', 11)
        .style('fill', 'red')

      svg
        .append('text')
        .text(USfertility.toFixed(2))
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('dx', 4)
        .attr('dy', 18)
        .attr('text-anchor', 'right')
        .attr('font-size', 11)
        .style('fill', '#2b8cbe')

      /// ///// ADD AXES //////////
      const age = datapoints.map(function(d) {
        return d.Age
      })
      console.log('age extent', d3.extent(age))
      // d3.extent gives me the max and min at the same time
      // xPositionScale.domain(d3.extent(age))

      const xAxis = d3
        .axisBottom(xPositionScale)
        .tickFormat(d3.format('d'))
        .ticks(3)
        .tickValues([15, 30, 45])
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      const yAxis = d3
        .axisLeft(yPositionScale)
        .ticks(4)
        .tickValues([0.0, 0.1, 0.2, 0.3])

      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
    })
}
