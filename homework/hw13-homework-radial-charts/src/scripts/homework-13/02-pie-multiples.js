import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const pie = d3.pie().value(function(d) {
  return d.minutes
})

const radius = 60

const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

const colorScale = d3.scaleOrdinal().range(['green', 'purple', 'orange'])

const xPositionScale = d3.scalePoint().range([0, width])

d3.csv(require('/data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  // Set xPositionScale domain
  const projects = datapoints.map(function(d) {
    return d.project
  })
  xPositionScale.domain(projects).padding(0.5)

  const nested = d3
    .nest()
    .key(d => d.project)
    .entries(datapoints)

  svg
    .selectAll('g')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      return `translate(${xPositionScale(d.key)},${height / 2})`
    })
    .each(function(d) {
      const container = d3.select(this)
      const datapoints = d.values
      const labels = d.key
      // console.log('g datapoints looks like', datapoints)

      container
        .selectAll('path')
        .data(pie(datapoints))
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.task))

      // add label
      container
        .selectAll('label')
        .data(pie(datapoints))
        .enter()
        .append('text')
        .attr('d', d => xPositionScale(d.key))
        .attr('dy', 80)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .text(d => labels)
    })
}
