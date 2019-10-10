;(function() {
  // Here is your data
  var countries = [
    {
      name: 'Blahstia',
      continent: 'North America',
      gdp: 40
    },
    {
      name: 'Bleers',
      continent: 'Europe',
      gdp: 12
    },
    {
      name: 'Blolo',
      continent: 'Antarctica',
      gdp: 35
    },
    {
      name: 'Blurben',
      continent: 'North America',
      gdp: 90
    }
  ]

  var widthScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([0, 400])
  var continentNames = countries.map(function(d) {
    return d.continent
  })
  var colourScale = d3
    .scaleOrdinal()
    .domain(continentNames)
    .range(['#7fc97f', '#beaed4', '#fdc086'])

  // Get the svg with the id of 'chart2'
  // Using d3, change the SVG itself to be 400 pixels wide and 200 pixels tall

  var svg = d3
    .select('#chart2')
    .attr('height', 200)
    .attr('width', 400)

  // Get the rectangles inside of it
  svg
    .selectAll('rect')
    .data(countries)
    .attr('height', 50)
    .attr('width', d => widthScale(d.gdp))
    .attr('fill', d => colourScale(d.continent))
})()
