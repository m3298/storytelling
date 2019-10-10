;(function() {
  // Build your SVG here
  // using all of that cut-and-paste magic

  var margin = { top: 50, right: 50, bottom: 50, left: 50 }
  var width = 500 - margin.left - margin.right
  var height = 300 - margin.top - margin.bottom

  var svg = d3
    .select('#chart14')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // Build your scales here
  var heightScale = d3
    .scaleLinear()
    .domain([0, 10])
    .range([height, 0])

  var xPositionScale = d3.scaleBand().range([0, width])

  var colourScale = d3
    .scaleOrdinal()
    .domain(['cat', 'dog', 'cow'])
    .range(['#e0f3db', '#a8ddb5', '#43a2ca'])

  d3.csv('eating-data.csv')
    .then(ready)
    .catch(function(err) {
      console.log('Failed with', err)
    })

  function ready(datapoints) {
    xPositionScale.domain(
      datapoints.map(function(d) {
        return d.name
      })
    )

    svg
      .selectAll('.bar')
      .data(datapoints)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', function(d) {
        return xPositionScale(d.name)
      })
      .attr('y', d => heightScale(d.hamburgers))
      .attr('width', xPositionScale.bandwidth() * 0.9)
      // .attr("height", function(d) { return height - heightScale(d.hamburgers})
      .attr('height', d => height - heightScale(d.hamburgers))
      .attr('fill', d => colourScale(d.animal))

    var yAxis = d3.axisLeft(heightScale)
    svg
      .append('g')
      .attr('class', 'axis y-axis')
      .call(yAxis)

    var xAxis = d3.axisBottom(xPositionScale)
    svg
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
  }
})()
