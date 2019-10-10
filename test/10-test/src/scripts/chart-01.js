import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 300 - margin.top - margin.bottom
const width = 600 - margin.left - margin.right

const svg = d3
  .select('#chart-01')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Scales
const xPositionScale = d3
  .scaleLinear()
  .domain([170, 230])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([60, 160])
  .range([height, 0])

const radiusScale = d3.scaleSqrt().range([0, 7])
// set domain later

const colorScale = d3
  .scaleOrdinal()
  .range(['red', 'yellow', 'green', 'blue', 'purple', 'orange'])
// check how many positions there are

// Read in data
d3.csv(require('../data/player_stats.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  // Set radius domain
  const points = datapoints.map(function(d) {
    return d.PTS
  })
  // Update your scales
  radiusScale.domain(d3.extent(points))

  // draw dots
  svg
    .selectAll('.dot')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('r', d => radiusScale(d.PTS))
    .attr('cx', d => xPositionScale(d.Height))
    .attr('cy', d => yPositionScale(d.Weight))
    .attr('fill', d => colorScale(d.Pos))
    .attr('fill-opacity', 0.4)
    .attr('stroke', 'none')

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
