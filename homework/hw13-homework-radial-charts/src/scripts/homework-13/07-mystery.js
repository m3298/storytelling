import * as d3 from 'd3'

const margin = { top: 0, left: 0, right: 0, bottom: 0 }
const height = 600 - margin.top - margin.bottom
const width = 600 - margin.left - margin.right

const svg = d3
  .select('#chart-7')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .attr('transform', `translate(${width / 2},${height / 2})`)

d3.csv(require('/data/time-binned.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

const parseTime = d3.timeParse('%H-%M')

const angleScale = d3.scaleBand().range([0, Math.PI * 2])

const radius = 250

const radiusScale = d3
  .scaleLinear()
  .domain([0, 80000])
  .range([0, radius])

const radiusAxis = radiusScale(55000)

const line = d3
  .radialArea()
  .innerRadius(radiusScale(40000))
  .outerRadius(d => radiusScale(d.total))
  .angle(d => angleScale(d.time))
  .curve(d3.curveBasis)

const arc = d3
  .arc()
  .innerRadius(d => radiusScale(d.total))
  .outerRadius(d => radiusScale(d.total))
  .startAngle(d => angleScale(d.time))
  .endAngle(d => angleScale(d.time) + angleScale.bandwidth())

const colorScaleAbove = d3
  .scaleSequential(d3.interpolateYlOrBr)
  .domain([40000, 90000])

const colorScaleBelow = d3
  .scaleSequential(d3.interpolateYlGnBu)
  .domain([20000, 40000])

function ready(datapoints) {
  datapoints.push(datapoints[0])

  // update angleScale() & colorScale()
  const times = datapoints.map(d => d.time)
  angleScale.domain(times)

  // const births = datapoints.map(d => d.total)
  // colorScale.domain(births)

  const bands = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
    '00:00'
  ]

  svg
    .selectAll('circle')
    .append('circle')
    .attr('r', radiusScale(55000))
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('fill', 'none')
    .attr('stroke', 'lightgrey')
    .style('stroke-width', 2)

  // Draw the outer rim circle - single line
  svg
    .append('circle')
    .attr('r', radiusScale(55000))
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('fill', 'none')
    .attr('stroke', 'lightgrey')
    .style('stroke-width', 2)

  // Draw one circle for each hour
  svg
    .selectAll('circle')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', 5)
    .attr('cx', 0)
    .attr('cy', radiusAxis)
    .style('transform', function(d) {
      // console.log('angleScale(d)', angleScale(d))
      return `rotate(${angleScale(d)}rad)`
    })
    .style('stroke', 'white')
    .attr('stroke-width', 5)
    .attr('fill', 'lightgrey')

  // Draw the clipping mask shape
  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'pink')

  // // draw colour bands
  // svg
  //   .selectAll('circle')
  //   .data(datapoints)
  //   .enter()
  //   .append('circle')
  //   .attr('r', d => radiusScale(d.total))
  //   .attr('fill', function(d) {
  //     console.log('d.total', d.total)
  //     if (d.total >= 40000) {
  //       return colorScaleAbove(d.total)
  //     } else {
  //       return colorScaleBelow(d.total)
  //     }
  //   })
  //   .lower()

  // middle label
  svg
    .append('text')
    .text('EVERYONE!')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .style('font-size', 18)
    .attr('font-weight', '600')
    .attr('dy', -20)

  svg
    .append('text')
    .text('is born at 8am')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .style('font-size', 14)
    .attr('font-weight', '600')

  svg
    .append('text')
    .text('(read Macbeth for details)')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .style('font-size', 12)
    .attr('dy', 18)

  // use mask
}
