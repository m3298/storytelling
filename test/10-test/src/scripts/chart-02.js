import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 250 - margin.top - margin.bottom
const width = 200 - margin.left - margin.right

const svg = d3
  .select('#chart-02')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Scales
const xPositionScale = d3
  .scalePoint()
  .domain(['PG', 'SG', 'PF', 'C'])
  .range([0, width])
  .padding(0.6)

const yPositionScale = d3
  .scaleLinear()
  .domain([60, 160])
  .range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .range(['green', 'yellow', 'purple', 'orange'])

// Read in data
d3.csv(require('../data/player_stats.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  // draw dots
  svg
    .selectAll('.dot')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('r', 3)
    .attr('cx', d => xPositionScale(d.Pos))
    .attr('cy', d => yPositionScale(d.Weight))
    .attr('fill', d => colorScale(d.Pos))
    .attr('fill-opacity', 0.4)
    .attr('stroke', 'none')

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
