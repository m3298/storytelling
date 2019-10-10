import * as d3 from 'd3'

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 20
}

const width = 700 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const svg = d3
  .select('#bar-chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3.scaleBand().range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range([height, 0])

const colourScale = d3
  .scaleOrdinal()
  .domain(['Oceania', 'Asia', 'Europe', 'Africa', 'N. America', 'S. America'])
  .range(['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc'])

d3.csv(require('../data/countries.csv')).then(ready)

function ready(datapoints) {
  d3.select('#button-asia').on('click', function() {
    console.log('clicked')
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg.selectAll('.asia').attr('fill', '#2b8cbe')
  })
  d3.select('#button-africa').on('click', function() {
    console.log('clicked')
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg.selectAll('.africa').attr('fill', '#2b8cbe')
  })
  d3.select('#button-namerica').on('click', function() {
    console.log('clicked')
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg.selectAll('.namerica').attr('fill', '#2b8cbe')
  })
  d3.select('#button-lowgdp').on('click', function() {
    console.log('clicked')
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg.selectAll('#lowgdp').attr('fill', '#2b8cbe')
  })
  d3.select('#button-continent').on('click', function() {
    console.log('clicked')
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg.selectAll('rect').attr('fill', d => colourScale(d.continent))
  })
  d3.select('#button-reset').on('click', function() {
    console.log('clicked')
    svg.selectAll('rect').attr('fill', 'lightgrey')
  })
  // Sort the countries from low to high
  datapoints = datapoints.sort((a, b) => {
    return a.life_expectancy - b.life_expectancy
  })

  // And set up the domain of the xPositionScale
  // using the read-in data
  const countries = datapoints.map(d => d.country)
  xPositionScale.domain(countries)

  /* Add your rectangles here */
  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('x', function(d) {
      return xPositionScale(d.country)
    })
    .attr('y', d => yPositionScale(d.life_expectancy))
    .attr('width', xPositionScale.bandwidth())
    .attr('height', d => height - yPositionScale(d.life_expectancy))
    .attr('fill', 'lightgrey')
    // Assign class by continent name, make it lower case
    // .attr('class', d => d.continent.toLowerCase())
    .attr('class', d => {
      // "S. America" can't be a class we removed non-word chars and lowercase it
      // S. America -> SAmerica -> samerica
      return d.continent.replace(/[^\w]/g, '').toLowerCase()
    })
    .attr('id', function(d) {
      if (d.gdp_per_capita < 1200) {
        return 'lowgdp'
      }
    })

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(-width)
    .ticks(5)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  d3.select('.y-axis .domain').remove()
}
