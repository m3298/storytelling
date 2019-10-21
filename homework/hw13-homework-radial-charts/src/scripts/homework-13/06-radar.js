import * as d3 from 'd3'

const margin = { top: 20, left: 0, right: 0, bottom: 0 }
const height = 400 - margin.top - margin.bottom
const width = 400 - margin.left - margin.right

const svg = d3
  .select('#chart-6')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .attr('transform', `translate(${width / 2},${height / 2})`)

d3.csv(require('/data/ratings.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

const angleScale = d3.scaleBand().range([0, Math.PI * 2])

const radius = 150

const radiusScale = d3
  .scaleLinear()
  .domain([0, 5])
  .range([0, radius])

const line = d3
  .radialLine()
  .angle(d => angleScale(d.category))
  .radius(d => radiusScale(d.score))

function ready(datapoints) {
  datapoints.push(datapoints[0])

  // update scale domains
  const categories = datapoints.map(function(d) {
    return d.category
  })
  angleScale.domain(categories)

  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'lightpink')
    .attr('stroke', 'grey')
    .attr('fill-opacity', 0.6)

  // Add radial axes
  const bands = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]

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
    .attr('stroke-width', 0.2)
    .lower()

  svg
    .selectAll('.radial-label')
    .data(angleScale.domain())
    .enter()
    .append('text')
    .text(d => d)
    .attr('x', d => -radiusScale(d))
    .attr('y', -radius)
    .attr('dy', -15)
    // Align labels
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    // Rotate each label
    .style('transform', function(d) {
      console.log(angleScale(d))
      return `rotate(${angleScale(d)}rad)`
    })
}
