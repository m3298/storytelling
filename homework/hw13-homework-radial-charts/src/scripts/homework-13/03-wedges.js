import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-3')
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

const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(d => radiusScale(d.high_temp))
  .startAngle(d => angleScale(d.month_name))
  .endAngle(d => angleScale(d.month_name) + angleScale.bandwidth())

const colorScale = d3
  .scaleLinear()
  .domain([38, 84])
  .range(['lightblue', 'pink'])

function ready(datapoints) {
  // update angleScale()
  const months = datapoints.map(function(d) {
    return d.month_name
  })
  angleScale.domain(months)
  // // Throw January onto the end so it connects
  // datapoints.push(datapoints[0])

  svg
    .selectAll('.polar-bar')
    .data(datapoints)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', d => colorScale(d.high_temp))

  svg
    .append('circle')
    .attr('r', 2)
    .raise()

  svg
    .append('text')
    .text('NYC high temperatures, by month')
    .attr('text-anchor', 'middle')
    .attr('dy', -110)
    .attr('alignment-baseline', 'middle')
    .style('font-size', 22)
    .attr('font-weight', '600')
}
