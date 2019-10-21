import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-3b')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

d3.csv(require('/data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

const angleScale = d3.scaleBand().range([0, Math.PI * 2])

const radius = 60

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

const xPositionScale = d3.scalePoint().range([0, width])

function ready(datapoints) {
  // update angleScale()
  const months = datapoints.map(function(d) {
    return d.month_name
  })
  angleScale.domain(months)

  const cities = datapoints.map(function(d) {
    return d.city
  })
  xPositionScale.domain(cities).padding(0.3)

  const nested = d3
    .nest()
    .key(d => d.city)
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
      const cities = d.key
      console.log('nested d is', d)

      container
        .selectAll('.polar-bar')
        .data(datapoints)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => colorScale(d.high_temp))

      container
        .append('circle')
        .attr('r', 1)
        .raise()

      // add label
      container
        .selectAll('label')
        .data(datapoints)
        .enter()
        .append('text')
        .attr('d', d => xPositionScale(d.key))
        .attr('dy', 80)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .text(d => cities)
    })
}
