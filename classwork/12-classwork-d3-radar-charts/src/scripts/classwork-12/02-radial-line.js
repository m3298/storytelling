import * as d3 from 'd3'
const margin = { top: 0, left: 0, right: 0, bottom: 0 }
const height = 400 - margin.top - margin.bottom
const width = 400 - margin.left - margin.right

// When drawing anything circular -- whenever you want (0,0) to be the centre -- ad two g's
const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .append('g')
  .attr('transform', `translate(${width / 2},${height / 2})`)

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

// I give you a month
// you give me back a number of radians
const angleScale = d3
  .scaleBand()
  // OR:
  // .scalePoint()
  // .padding(1)
  .domain(months)
  .range([0, Math.PI * 2])

const radius = 150

// If I sell 0 houses, I have a radius of 0
// If I sell 70 houses, I have a radius of... radius? 150
const radiusScale = d3
  .scaleLinear()
  .domain([0, 75])
  .range([0, radius])

const line = d3
  .radialLine()
  .angle(d => angleScale(d.month))
  .radius(d => radiusScale(d.high))

d3.csv(require('/data/high-low-by-month.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  // Throw January (first point) onto the end
  datapoints.push(datapoints[0])

  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', 'black')

  // Add radial axes
  const bands = [15, 30, 45, 60, 75]

  svg
    .selectAll('.band')
    .data(bands)
    .enter()
    .append('circle')
    // .attr('r', d => radiusScale(d))
    .attr('r', function(d) {
      console.log(d)
      return radiusScale(d)
    })
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('fill', 'none')
    .attr('stroke', 'grey')
    .attr('stroke-width', 0.2)
    .lower()

  svg
    .selectAll('.label')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d)
    // .attr('r', d => radiusScale(d))
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    // Align labels
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('fill', 'grey')

  // Add a single radial axis
  // svg
  //   .append('circle')
  //   .attr('r', radiusScale(70))
  //   .attr('cx', 0)
  //   .attr('cy', 0)
  //   .attr('fill', 'none')
  //   .attr('stroke', 'grey')
  //   .attr('stroke-width', 0.2)

  // Draw radiating lines from the centre to position the months labels
  // Draw one line for every category that angleScale uses as the domain

  // console.log('everything in the angle scale', angleScale.domain())

  svg
    .selectAll('.radial-line')
    .data(angleScale.domain())
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', -radius)
    .attr('stroke', 'lightgrey')
    // Rotate each line
    .style('transform', function(d) {
      console.log(angleScale(d))
      return `rotate(${angleScale(d)}rad)`
    })

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
    .attr('fill', 'red')
    // Rotate each label
    .style('transform', function(d) {
      console.log(angleScale(d))
      return `rotate(${angleScale(d)}rad)`
    })
}
