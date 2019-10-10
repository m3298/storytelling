(function () {

  console.log('Hello world')


  // your data can be a plain array (Python calls them lists)...
  var numbers = [8, 20, 4]

  // ... but it's usually (what we'd call in Python) a list of dictionaries!
  var cities = [
    {
      'name': 'NYC',
      'population': 8,
      'area': 304
    },
    {
      'name': 'Tokyo',
      'population': 14,
      'area': 845
    },
    {
      'name': 'LA',
      'population': 4,
      'area': 4500      
    },
    {
      'name': 'Brooklyn',
      'population': 4,
      'area': 97
    }
  ]

  var widthScale = d3.scaleLinear().domain([0,15]).range([0,500])
  var colourScale = d3.scaleLinear().domain([0,5000]).range(['lightgrey','black'])
  var radiusScale = d3.scaleSqrt().domain([0,15]).range([0,30])

  console.log(widthScale(7.5))

  // Remember, scales allow us to map an INPUT (a domain) to an OUTPUT (a range).

  // For example, I'm going to have input values of 0-4500 (square miles), please give me back
  //   the appropriate size for a circle, between 0 and 100. A 0 sqmi city would have a 0 radius,
  //   while a 4500 sqmi city would have a radius of 100 pixels.

  // You can also use scales to say "I'm going to give you a number between 4 and 15, and you're
  //    going to give me back a color between beige and red." We can get fancy with our colors and use
  //    hex codes from colorbrewer.

  // The answer to every question is probably "function(d) { }"

  d3.selectAll('rect')
  .data(cities) // Bind the data: join rectangles to data points
  .attr('width', 0)
  .transition()
  .duration(1000)
  .ease(d3.easeElastic)
  .attr('width',function(d) { // When you want to transform objects on a per-element basis
    console.log(d.population)
    return widthScale(d.population)
  })
  .attr('fill',function(d) { // When you want to transform objects on a per-element basis
    console.log(d.area)
    return colourScale(d.area) 

    // OR: .attr('fill', d => colourScale(d.area))

  })

// Use the radiusScale to set the radius based on population

  // Find the svg on the page
  var svg = d3.select('svg')

  // Inside the svg, go find the circles...etc
  svg.selectAll('circle')
  .data(cities)
  // let d3 draw all your circles for you
  .enter().append('circle')
  .attr('r', d => radiusScale(d.population))
  .attr('fill', 'lightblue')
  .attr('stroke', 'navy')
  .attr('cx', 700)
  .attr('cy', function(d, i) {
    return i * 100 + 100 
  })


})()
