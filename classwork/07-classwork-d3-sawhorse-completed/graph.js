/* global d3 */
var margin = {
  top: 0,
  right: 20,
  bottom: 30,
  left: 20
}

var width = 500 - margin.left - margin.right
var height = 400 - margin.top - margin.bottom

// You'll probably need to edit this one
var svg = d3
  .select('#chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Here are some scales for you
const xPositionScale = d3
  .scaleLinear()
  .domain([0, 80000])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([30, 85])
  .range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .range(['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae'])

d3.csv(require('./countries.csv')).then(ready)

function ready(datapoints) {
  console.log('Data is....', datapoints)

  // Go get the thing with an id of highlight-asia
  // listen for a 'click' event. when it's clicked,
  // run this function
  d3.select('#highlight-asia').on('click', function() {
    console.log('clicked')
    // make all the circles light grey
    svg.selectAll('circle').attr('fill', 'lightgrey')
    // then make asian circles red
    // we use .raise() to put them on 'top' of the others
    svg
      .selectAll('.asia')
      .attr('fill', 'red')
      .raise()
  })

  // Same as above, but the classes are kind of weird
  d3.select('#highlight-sa').on('click', function() {
    svg.selectAll('circle').attr('fill', 'lightgrey')

    // "S. America" can't be a class, so in the .attr('class'...)
    // below we removed non-word chars and lowercased it
    // S. America -> SAmerica -> samerica
    svg
      .selectAll('.samerica')
      .attr('fill', 'red')
      .raise()

    // another option is to select ALL the circles and just
    // use an if statement (note we don't need to re-bind data!!!)
    svg
      .selectAll('circle')
      .attr('fill', function(d) {
        if (d.continent == 'S. America') {
          return 'red'
        } else {
          return 'lightgrey'
        }
      })
      .raise()
  })

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', 4)
    .attr('cx', d => {
      return xPositionScale(d.gdp_per_capita)
    })
    .attr('cy', d => {
      return yPositionScale(d.life_expectancy)
    })
    .attr('fill', d => {
      return colorScale(d.continent)
    })
    .attr('class', d => {
      // "S. America" can't be a class we removed non-word chars and lowercase it
      // S. America -> SAmerica -> samerica
      return d.continent.replace(/[^\w]/g, '').toLowerCase()
    })
    .on('mouseover', function(d) {
      // mouseover is the event for the cursor going over something.
      // When the mouse goes over, let's look at the datapoint
      console.log('My mouse went over the datapoint', d)

      // if we want to talk about the actual circle, we use d3.select(this)
      d3.select(this)
        .attr('stroke', 'black')
        .raise()

      // We can use the datapoint to update elements elsewhere on the page
      d3.select('#name').text(d.country)
      d3.select('#life').text(d.life_expectancy)
    })
    .on('mouseout', function(d) {
      // mouseover is the event for the cursor moving off of something

      // When the mouse leaves, let's look at the datapoint
      console.log('My mouse left the datapoint', d)
      d3.select(this).attr('stroke', 'none')
    })

  var yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(-width)
    .ticks(5)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  d3.select('.y-axis .domain').remove()

  var xAxis = d3.axisBottom(xPositionScale).ticks(7)

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
}
