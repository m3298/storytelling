import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 300 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

const svg = d3
  .select('#chart-3')
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
  .domain([0, 50])
  .range([height, 0])

// Create line function
const line = d3
  .line()
  .x(d => {
    return xPositionScale(d.day)
  })
  .y(d => {
    return yPositionScale(d.temperature)
  })

// Read in data with multiple countries
d3.csv(require('./data/data-multiline.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready(datapoints) {
  /* Draw your lines */
  console.log(datapoints)

  // Nest/groupby datapoints into 2 groups
  // Equivalent of df.groupby('country') in pandas
  const nested = d3
    .nest()
    .key(d => d.country)
    .entries(datapoints)

  console.log('Nested is', nested)

  // If you have GROUPS of data, each with one line, instead of one line
  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('d', function(d) {
      console.log(d)
      /*
      d.key is thie name of the group
      dvalues is the data in thegroup
      */
      return line(d.values)
    })

  // svg
  //   .append('path')
  //   .datum(datapoints)
  //   .attr('d', line)
  //   .attr('fill', 'none')
  //   .attr('stroke', 'black')

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
