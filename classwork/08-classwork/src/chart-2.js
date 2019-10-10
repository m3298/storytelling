import * as d3 from 'd3'
const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 300 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right
const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
// Normal scales
const xPositionScale = d3
  .scaleLinear()
  .domain([1, 25])
  .range([0, width])
const yPositionScale = d3
  .scaleLinear()
  .domain([10, 50])
  .range([height, 0])
const line = d3
  .line()
  .x(d => {
    return xPositionScale(d.day)
  })
  .y(d => {
    return yPositionScale(d.temperature)
  })
/*
  We want to read in:
  
    d3.csv(require('./data-singleline-cimbria.csv'))
  
  But we also want to read in:
  
    d3.csv(require('./data-singleline-cimmeria.csv'))
  
  How do we do both?
*/
/* This is a Promise */
Promise.all([
  d3.csv(require('./data/data-singleline-cimbria.csv')),
  d3.csv(require('./data/data-singleline-cimmeria.csv'))
])
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

/*
DO THIS WHEN YOU ARE READING IN MULTIPLE FILES: 
First CSV file becomes datapointsCimbria
Second CSV file becomes datapointsCimmeria 
*/
function ready([datapointsCimbria, datapointsCimmeria]) {
  console.log('Cimbria is', datapointsCimbria)
  console.log('Cimmeria is', datapointsCimmeria)

  // Draw one line for each country
  svg
    .append('path')
    .datum(datapointsCimbria)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', 'black')

  svg
    .append('path')
    .datum(datapointsCimmeria)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', 'black')

  /* Add in your temperature circles */
  svg
    .selectAll('.circle-cimmeria')
    .data(datapointsCimmeria)
    .enter()
    .append('circle')
    .attr('class', 'circle-cimmeria')
    .attr('r', 3)
    .attr('cx', d => {
      return xPositionScale(d.day)
    })
    .attr('cy', d => {
      return yPositionScale(d.temperature)
    })

  svg
    .selectAll('.circle-cimbria')
    .data(datapointsCimbria)
    .enter()
    .append('circle')
    .attr('class', 'circle-cimbria')
    .attr('r', 3)
    .attr('cx', d => {
      return xPositionScale(d.day)
    })
    .attr('cy', d => {
      return yPositionScale(d.temperature)
    })

  /* Add in your axes */
  const xAxis = d3.axisBottom(xPositionScale)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
