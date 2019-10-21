import * as d3 from 'd3'
const margin = { top: 0, left: 0, right: 0, bottom: 0 }
const height = 400 - margin.top - margin.bottom
const width = 400 - margin.left - margin.right
const svg = d3
  .select('#chart-4')
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
  // .scalePoint()
  // .padding(0.5)
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])
const radius = 150
// If I sell 0 houses, I have a radius of 0
// If I sell 70 houses, I have a radius of... radius? 150
const radiusScale = d3
  .scaleLinear()
  .domain([0, 75])
  .range([0, radius])
// Make the outside of the shape based on
// the high temperature
// make the inside of the shape based
// on the low temperature
const line = d3
  .radialArea()
  .angle(d => angleScale(d.month))
  .innerRadius(d => radiusScale(d.low))
  .outerRadius(d => radiusScale(d.high))
// I've been told to draw a line that's
// the average
// d.high "77"
// d.low "23"
// Need +d.high or else we get "7723"/2
const avgLine = d3
  .radialLine()
  .angle(d => angleScale(d.month))
  .radius(d => radiusScale((+d.high + +d.low) / 2))
d3.csv(require('/data/high-low-by-month.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))
function ready(datapoints) {
  // Throw January onto the end so it connects
  datapoints.push(datapoints[0])
  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'pink')
    .attr('stroke', 'black')
  svg
    .append('path')
    .datum(datapoints)
    .attr('d', avgLine)
    .attr('fill', 'none')
    .attr('stroke', 'black')
  svg
    .append('circle')
    .attr('r', 3)
    .attr('cx', 0)
    .attr('cy', 0)
  // No matter what, this is at 70 houses sold
  // svg
  //   .append('circle')
  //   .attr('cx', 0)
  //   .attr('cy', 0)
  //   // .attr('r', 150)
  //   // .attr('r', radius)
  //   .attr('r', radiusScale(70))
  //   .attr('stroke', 'black')
  //   .attr('fill', 'none')
  const bands = [15, 30, 45, 60, 75]
  // Draw a circle for each item in bands
  svg
    .selectAll('.band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('fill', 'none')
    .attr('stroke', 'lightgrey')
    .attr('r', function(d) {
      console.log(d)
      return radiusScale(d)
    })
    .lower()
  svg
    .selectAll('.label')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d)
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
  // Draw one line for every category that this scale knows about
  svg
    .selectAll('.radius-line')
    .data(angleScale.domain())
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', -radius)
    .attr('stroke', 'black')
    // .style/css knows about radians
    // .style('transform', function(d) {
    //   console.log(d, angleScale(d))
    //   return `rotate(${angleScale(d)}rad)`
    // })
    // for .attr you need to convert to degrees
    .attr('transform', function(d) {
      return `rotate(${(angleScale(d) * 180) / Math.PI})`
    })
  // Add one text element for every category
  // that our angleScale knows about
  // we aren't using .data(months) because
  // we want to be able to cut and paste
  svg
    .selectAll('.outside-label')
    .data(angleScale.domain())
    .enter()
    .append('text')
    .text(d => d)
    // .attr('y', -radius) // set it up at the top of the chart
    // .attr('dy', -10) // give a little offset to push it higher
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('x', function(d) {
      const a = angleScale(d)
      const r = radius + 10
      return r * Math.sin(a)
    })
    .attr('y', function(d) {
      const a = angleScale(d)
      const r = radius + 10
      return r * Math.cos(a) * -1
    })
  console.log('everything in the angle scale', angleScale.domain())
}
