import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-4')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .attr('transform', `translate(${width / 2},${height / 2})`)

d3.csv(require('/data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

const angleScale = d3.scaleBand().range([0, Math.PI * 2])

const radius = 150

const radiusScale = d3
  .scaleLinear()
  .domain([0, 90])
  .range([0, radius])

const line = d3
  .radialArea()
  .angle(d => angleScale(d.month_name))
  .innerRadius(d => radiusScale(d.low_temp))
  .outerRadius(d => radiusScale(d.high_temp))

function ready(datapoints) {
  // update angleScale()
  const months = datapoints.map(function(d) {
    return d.month_name
  })
  angleScale.domain(months)

  // // Throw January onto the end so it connects
  datapoints.push(datapoints[0])

  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'lightblue')

  svg
    .append('text')
    .text('NYC')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .style('font-size', 18)
    .attr('font-weight', '600')

  // Add radial axes
  const bands = [20, 30, 40, 50, 60, 70, 80, 90]
  const labels = [30, 50, 70, 90]
  svg
    .selectAll('.band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('fill', 'none')
    .attr('stroke', 'grey')
    .attr('stroke-width', 0.5)

  svg
    .selectAll('.labels')
    .data(labels)
    .enter()
    .append('text')
    .text(function(d) {
      return `${d}°`
    })
    .attr('y', d => -radiusScale(d))
    .attr('dy', -5)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
}
