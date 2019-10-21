import * as d3 from 'd3'

const margin = { top: 0, left: 0, right: 0, bottom: 0 }

const height = 400 - margin.top - margin.bottom

const width = 400 - margin.left - margin.right

const svg = d3
  .select('#chart-5')
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

// base the outerRadius on the high temp using the radiusScale
const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(d => radiusScale(d.high))
  .startAngle(d => angleScale(d.month))
  .endAngle(d => angleScale(d.month) + angleScale.bandwidth())

// We don't have columns, so it's just d, not d.month
const labelArc = d3
  .arc()
  .innerRadius(radius)
  .outerRadius(radius)
  .startAngle(d => angleScale(d))
  .endAngle(d => angleScale(d) + angleScale.bandwidth())

d3.csv(require('/data/high-low-by-month.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  // Throw January onto the end so it connects
  datapoints.push(datapoints[0])

  // Add a path for
  // EVERY!
  //  SINGLE!
  //    DATAPOINT!
  svg
    .selectAll('.polar-bar')
    .data(datapoints)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', 'pink')

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
    .attr('transform', function(d) {
      return `translate(${labelArc.centroid(d)})`
    })

  // svg
  //   .selectAll('.inside-label')
  //   .data(datapoints)
  //   .enter()
  //   .append('text')
  //   .text(d => d.high)
  //   // .attr('y', -radius) // set it up at the top of the chart
  //   // .attr('dy', -10) // give a little offset to push it higher
  //   .attr('text-anchor', 'middle')
  //   .attr('alignment-baseline', 'middle')
  //   .attr('transform', function(d) {
  //     return `translate(${arc.centroid(d)})`
  //   })

  console.log('everything in the angle scale', angleScale.domain())
}
