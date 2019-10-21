import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 450 - margin.top - margin.bottom
const width = 900 - margin.left - margin.right

const svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

d3.csv(require('/data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

const angleScale = d3.scaleBand().range([0, Math.PI * 2])

const radius = 65

const radiusScale = d3
  .scaleLinear()
  .domain([0, 90])
  .range([30, radius])

const line = d3
  .radialArea()
  .angle(d => angleScale(d.month_name))
  .innerRadius(d => radiusScale(d.low_temp))
  .outerRadius(d => radiusScale(d.high_temp))

const xPositionScale = d3.scalePoint().range([0, width])

function ready(datapoints) {
  // update scale domains
  const months = datapoints.map(function(d) {
    return d.month_name
  })
  angleScale.domain(months)

  const cities = datapoints.map(function(d) {
    return d.city
  })
  xPositionScale.domain(cities).padding(0.4)

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
      datapoints.push(datapoints[0])

      container
        .append('path')
        .datum(datapoints)
        .attr('d', line)
        .attr('fill', 'lightpink')

      // add city label
      container
        .selectAll('label')
        .data(datapoints)
        .enter()
        .append('text')
        .text(d => cities)
        .attr('d', d => xPositionScale(d.key))
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .style('font-size', 14)

      // Add radial axes
      const bands = [20, 40, 60, 80, 100]
      const labels = [20, 60, 100]

      container
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

      container
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
        .style('font-size', 11)
    })

  svg
    .append('text')
    .text('Average Monthly Temperatures')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('x', width / 2)
    .attr('dy', 20)
    .style('font-size', 22)
    .attr('font-weight', '600')

  svg
    .append('text')
    .text('in cities around the world')
    .attr('x', width / 2)
    .attr('dy', 50)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .style('font-size', 14)
}
