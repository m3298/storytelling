import * as d3 from 'd3'

console.log('Building chart 8')

// I'll give you margins/height/width
const margin = { top: 100, right: 60, bottom: 20, left: 0 }
const height = 350 - margin.top - margin.bottom
const width = 350 - margin.left - margin.right

// And grabbing your container
const container = d3.select('#chart-08')

// Create your scales
const xPositionScale = d3
  .scaleLinear()
  .domain([-6, 6])
  .range([0, width])

const yPositionScale = d3.scaleLinear().range([height, 0])
// Set domain using d3.extent or d3.max later

// Create your area generator
const area = d3
  .area()
  .x(d => {
    return xPositionScale(d.diff)
  })
  .y0(height)
  .y1(d => {
    return yPositionScale(d.freq)
  })

// Read in your data, then call ready
d3.tsv(require('../data/climate-data.tsv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

// Write your ready function
function ready(datapoints) {
  // Filter data for 1951-1980
  const filteredMain = datapoints.filter(function(d) {
    return d.year < 1981
  })
  // Filter data for 1983-1993
  const filtered2 = datapoints.filter(function(d) {
    return d.year > 1982 && d.year < 1994
  })
  // Filter data for 1994-2004
  const filtered3 = datapoints.filter(function(d) {
    return d.year > 1993 && d.year < 2005
  })
  // Filter data for 2005-2015
  const filtered4 = datapoints.filter(function(d) {
    return d.year > 2004
  })

  // Make axes variables
  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickValues([-3, -0.9, 0.9, 3])
    .tickSize(-height)

  const frequencies = datapoints.map(function(d) {
    return +d.freq
  })
  console.log('d3.extent(frequencies) is', d3.extent(frequencies))
  yPositionScale.domain(d3.extent(frequencies))
  const yAxis = d3.axisLeft(yPositionScale).ticks(10)

  // Make functions to draw temp areas
  function drawTemp(svg, data, minTemp, maxTemp, color) {
    const filteredData = data.filter(function(d) {
      return d.diff >= minTemp && d.diff <= maxTemp
    })
    return container
      .select('.' + svg)
      .datum(filteredData)
      .append('path')
      .attr('fill', color)
      .attr('fill-opacity', 0.7)
      .attr('d', area)
      .raise()
  }

  function drawAllAreas(svg, data) {
    // v cold
    drawTemp(svg, data, -10, -3, '#236085')
    // cold
    drawTemp(svg, data, -3, -0.9, '#96bccf')
    // normal
    drawTemp(svg, data, -0.9, 0.9, '#cac7c7')
    // hot
    drawTemp(svg, data, 0.9, 3, '#ee9f71')
    // v hot
    drawTemp(svg, data, 3, 10, '#c9604b')
  }

  function addLabels(svg, yearLabel) {
    return container
      .select('.' + svg)
      .append('text')
      .text(yearLabel)
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .attr('font-size', 14)
      .attr('font-weight', 'bold')
  }

  // Make svgs
  container
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('class', 'svg1951')
  container
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('class', 'svg1983')

  container
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('class', 'svg1994')

  container
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('class', 'svg2005')

  // CHART 1!111111111111111111111111111111111111111111111111111111111111
  // Make the main, grey area chart for 1951

  drawAllAreas('svg1951', filteredMain)
  addLabels('svg1951', '1951 to 1980')

  // CHART 2!222222222222222222222222222222222222222222222222222222222222
  /// Make the 1983 chart

  // draw the base 1951 grey area
  container
    .select('.svg1983')
    .datum(filteredMain)
    .append('path')
    .attr('fill', '#e5e5e5')
    .attr('fill-opacity', 0.7)
    .attr('d', area)

  drawAllAreas('svg1983', filtered2)
  addLabels('svg1983', '1983 to 1993')

  // CHART 3!333333333333333333333333333333333333333333333333333333333333
  // Make 1994 chart

  // draw the base 1951 grey area
  container
    .select('.svg1994')
    .datum(filteredMain)
    .append('path')
    .attr('fill', '#e5e5e5')
    .attr('fill-opacity', 0.7)
    .attr('d', area)

  drawAllAreas('svg1994', filtered3)
  addLabels('svg1994', '1994 to 2004')

  // CHART 4!444444444444444444444444444444444444444444444444444444444444s
  // Make 2005 chart

  // draw the base 1951 grey area
  container
    .select('.svg2005')
    .datum(filteredMain)
    .append('path')
    .attr('fill', '#e5e5e5')
    .attr('fill-opacity', 0.7)
    .attr('d', area)

  drawAllAreas('svg2005', filtered4)
  addLabels('svg2005', '2005 to 2015')

  container.selectAll('svg').each(function() {
    const svg = d3.select(this).select('g')
    // Add x-axis labels
    function xLabels(label, freqValue, color) {
      svg
        .append('text')
        .text(label)
        .attr('x', d => xPositionScale(freqValue))
        .attr('y', height)
        .attr('dy', 16)
        .attr('text-anchor', 'start')
        .attr('font-size', 10)
        .attr('font-weight', 'bold')
        .style('fill', color)
    }
    xLabels('Extremely Cold', -6, '#236085')
    xLabels('Cold', -2.5, '#96bccf')
    xLabels('Normal', -0.7, '#cac7c7')
    xLabels('Hot', 1.5, '#ee9f71')
    xLabels('Extremely Hot', 3, '#c9604b')

    // Add axes
    svg
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      // Delete x-axis values/labels
      .selectAll('text')
      .remove()

    svg
      .append('g')
      .attr('class', 'axis y-axis')
      .call(yAxis)

    // Make dashed gridlines
    svg.selectAll('.domain').remove()
    svg.selectAll('.tick line').attr('stroke-dasharray', '2 2')
  })

  //
  // End of ready function
  //
}

// Nested and .rollup, which I didn't use

// const nested = d3
//   .nest()
//   .key(d => d.year)
//   .rollup(values => d3.mean(values, v => v.freq))
//   .entries(datapoints)

// Initial, manual code for colouring in 'hot'

// Filter HOT for 1951-1980
// const filteredMainHot = filteredMain.filter(function(d) {
//   return d.diff > '0.9' && d.diff < '3'
// })
// // Draw HOT for 1951-1980
// container
//   .select('.svg1951')
//   .datum(filteredMainHot)
//   .append('path')
//   .attr('fill', '#ee9f71')
//   .attr('fill-opacity', 0.7)
//   .attr('d', area)
//   .raise()
