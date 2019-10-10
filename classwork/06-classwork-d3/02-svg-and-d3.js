(function () {

  console.log("Hello world")

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


  var widthScale = d3.scaleLinear().domain([0, 15]).range([0, 500])
  var colorScale = d3.scaleLinear().domain([0, 5000]).range(['beige', 'red'])
  var radiusScale = d3.scaleSqrt().domain([0, 15]).range([0, 30])

  console.log(widthScale(7.5))

  // Remember, scales allow us to map an INPUT (a domain) to an OUTPUT (a range).

  // For example, I'm going to have input values of 0-4500 (square miles), please give me back
  //   the appropriate size for a circle, between 0 and 100. A 0 sqmi city would have a 0 radius,
  //   while a 4500 sqmi city would have a radius of 100 pixels.

  // You can also use scales to say "I'm going to give you a number between 4 and 15, and you're
  //    going to give me back a color between beige and red." We can get fancy with our colors and use
  //    hex codes from colorbrewer.

  // The answer to every question is probably "function(d) { }"


  // Use the colorScale to set the fill based on the area column
  // Cut and paste will help you
  d3.selectAll('rect')
    .data(cities)
    .attr('fill', d => colorScale(d.area))
    .attr('width', 0)
    .transition()
    .duration(2000)
    .ease(d3.easeElastic)
    .attr('width', function(d) {
      console.log(d.population)
      return widthScale(d.population)
    })

  // theyCapitalizeTHingsLikeThis
  // they_dont_capitalize_things_like_this_which_i_guess_isnt_even_capitalization

  // All circles the same size
  // All circles the same color
  // All circles with a little border around them

  // Use the radiusScale to set the radius of the circles
  // based on the 'population' column of our dataset
  var svg = d3.select('svg')
  svg.selectAll('circle')
    .data(cities)
    .enter().append('circle')
    .attr('fill', 'turquoise')
    .attr('r', d => radiusScale(d.population))
    .attr('stroke', 'black')
    .attr('cx', 700)
    .attr('cy', function(d, i) {
      return i * 100 + 100
    })

})()
