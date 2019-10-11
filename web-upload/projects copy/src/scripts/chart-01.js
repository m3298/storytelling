import * as d3 from 'd3'
import d3Tip from 'd3-tip'
import d3Annotation from 'd3-svg-annotation'
d3.tip = d3Tip

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

// Scales
const xPositionScale = d3.scaleBand().range([0, width])
const yPositionScale = d3
  .scaleLinear()
  .domain([0, 500000])
  .range([height, 0])

// Load data
d3.csv(require('../data/death_list_complete.csv')).then(ready)

function ready(datapoints) {
  console.log('Data read in:', datapoints)

  // List of subgroups = header of the csv files
  const subgroups = datapoints.columns.slice(1)

  // And set up the domain of the xPositionScale
  // using the read-in data
  const years = datapoints.map(d => d.year)
  xPositionScale.domain(years)

  // Use subgroups to make colourScale
  const colourScale = d3
    .scaleOrdinal()
    .domain(subgroups)
    // .range(['#ffe2b8', '#e2b6aa'])
    .range(['#ffb74d', '#bf360c'])

  // stack the data? --> stack per subgroup
  const stackedData = d3.stack().keys(subgroups)(datapoints)

  // Add your annotations
  const annotations = [
    {
      note: {
        title: 'U.S. bombs Hiroshima and Nagasaki',
        lineType: 'vertical'
      },
      // Copying what our data looks like
      // this is the point I want to annotate
      data: {
        year: '1945',
        total: 0
      },
      dy: -260,
      color: '#4d4d4d'
    },

    {
      note: {
        label: 'Hiroshima begins its list',
        title: '1952: 57,902 recorded as killed',
        lineType: 'vertical'
      },
      data: {
        year: '1952',
        total: 57902
      },
      dy: -170,
      color: '#4d4d4d'
    },
    {
      note: {
        label: 'Nagasaki begins its list',
        title: '1968: 90,426 total recorded as killed',
        lineType: 'vertical'
      },
      data: {
        year: '1968',
        total: 90426
      },
      dy: -100,
      color: '#4d4d4d'
    }
  ]
  const makeAnnotations = d3Annotation
    .annotation()
    .accessors({
      x: d => xPositionScale(d.year) + xPositionScale.bandwidth() * 0.5,
      y: d => yPositionScale(d.total)
    })
    .textWrap(300)
    .annotations(annotations)

  svg.call(makeAnnotations)

  svg.selectAll('text').style('font-size', 13)

  // Show the bars
  svg
    .append('g')
    .selectAll('g')
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter()
    .append('g')
    .attr('fill', function(d) {
      return colourScale(d.key)
    })
    .selectAll('rect')
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function(d) {
      return d
    })
    .enter()
    .append('rect')
    .attr('x', function(d) {
      // console.log('d is', d)
      return xPositionScale(d.data.year)
    })
    .attr('y', function(d) {
      return yPositionScale(d[1])
    })
    .attr('height', function(d) {
      return yPositionScale(d[0]) - yPositionScale(d[1])
    })
    .attr('width', xPositionScale.bandwidth())

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickValues([100000, 200000, 300000, 400000])

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickValues(d3.range(1945, 2018, 10))

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  svg.selectAll('.y-axis path, .x-axis path, .x-axis line').remove()
}
