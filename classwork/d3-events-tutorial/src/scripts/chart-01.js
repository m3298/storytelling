import * as d3 from 'd3'

const margin = { top: 50, left: 50, right: 50, bottom: 50 }
const height = 400 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

const svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleLinear()
  .domain([0, 70000])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 80])
  .range([height, 0])

d3.csv(require('../data/countries.csv')).then(ready)

function ready(datapoints) {
  console.log('Data read in:', datapoints)

  // Go get the thing with an id of highlight-asia
  // listen for a 'click' event. when it's clicked, run this function

  d3.select('#highlight-asia').on('click', function() {
    console.log('clicked')
    // first, make ALL circles grey
    svg.selectAll('circle').attr('fill', 'lightgrey')
    // make Asian circles red
    svg.selectAll('.asia').attr('fill', 'red')
  })

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', 2)
    .attr('cx', d => xPositionScale(d.gdp_per_capita))
    .attr('cy', d => yPositionScale(d.life_expectancy))
    .attr('fill', 'pink')
    // Assign class by continent name, make it lower case
    .attr('class', d => d.continent.toLowerCase())

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  const xAxis = d3.axisBottom(xPositionScale)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
}
