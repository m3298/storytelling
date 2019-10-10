import * as d3 from 'd3'
import d3Tip from 'd3-tip'
d3.tip = d3Tip

const margin = { top: 0, left: 280, right: 15, bottom: 40 }
const height = 400 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Scales
const xPositionScale = d3
  .scaleLinear()
  .domain([0, 400])
  .range([0, width])

const yPositionScale = d3
  .scalePoint()
  .range([height, 0])
  .padding(0.8)

// Load data
d3.csv(require('../data/sake_top5.csv')).then(ready)

function ready(datapoints) {
  console.log('Data read in:', datapoints)

  const nested = d3
    .nest()
    .key(function(d) {
      return d.name
    })
    .entries(datapoints)

  // Go through each group, pull out the name of that group
  const names = nested.map(d => d.key)
  // Teach it to the y position scale
  yPositionScale.domain(names)

  // Add label for the biggest mark-up
  svg
    .append('text')
    .text('The biggest mark-up')
    .attr('x', d => xPositionScale('Kyokusen'))
    .attr('y', 100)
    .attr('dx', 120)
    .attr('text-anchor', 'middle')
    .attr('font-size', 11)
    .attr('font-weight', 'bold')
    .style('fill', '#ed1964')

  // Add a g element for every single city
  // and then let's do something with each of you
  svg
    .selectAll('g')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      return `translate(0,${yPositionScale(d.key)})`
    })
    .each(function(d) {
      const g = d3.select(this)
      const datapoints = d.values

      const maxHigh = d3.max(datapoints, d => d.cost_US)
      const minHigh = d3.min(datapoints, d => d.cost_JP)
      const markup = d3.min(datapoints, d => d.markup)

      // Add tooltip
      const minHighFormatted = parseFloat(minHigh).toFixed(0)
      const maxHighFormatted = parseFloat(maxHigh).toFixed(0)
      const markupFormatted = parseFloat(markup).toFixed(0)

      const tip = d3
        .tip()
        .attr('class', 'd3-tip')
        .offset([50, 75])
        .html(
          `Markup: <strong>${markupFormatted}%</strong><br/>Price in Japan: $${minHighFormatted}<br/>Price in NY: $${maxHighFormatted}</span>`
        )

      svg.call(tip)

      g.append('line')
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('x1', xPositionScale(maxHigh))
        .attr('x2', xPositionScale(minHigh))
        .attr('stroke-width', 1.5)
        .attr('stroke', function(d) {
          if (d.key === 'Kyokusen') {
            return '#ed1964'
          } else {
            return '#666666'
          }
        })
        // Add tooltip
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)

      g.append('circle')
        .attr('r', 4)
        .attr('class', d => d.key)
        .attr('fill', function(d) {
          if (d.key === 'Kyokusen') {
            return '#ed1964'
          } else {
            return '#666666'
          }
        })
        .attr('cy', 0)
        .attr('cx', xPositionScale(maxHigh))
        // Add tooltip
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)

      g.append('circle')
        .attr('r', 4)
        .attr('fill', function(d) {
          if (d.key === 'Kyokusen') {
            return '#ed1964'
          } else {
            return '#666666'
          }
        })
        .attr('cy', 0)
        .attr('cx', xPositionScale(minHigh))
        // Add tooltip
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
    })

  // Add labels for each g (line) on the right-hand side

  // Add axes
  const dollarFormat = function(d) {
    return '$' + d3.format(',')(d)
  }

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .style('font-size', 13)

  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickValues([100, 200, 300, 400])
    .tickFormat(dollarFormat)
    .tickSize(-height)

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  svg
    .selectAll('.tick line')
    .attr('stroke-dasharray', '2 2')
    .attr('stroke', '#ababab')
    .lower()

  svg.selectAll('.y-axis path, .y-axis line, .x-axis path').remove()
}
