(function() {
  // Build your SVG here
  // using all of that cut-and-paste magic

    var margin = {top: 20, right: 20, bottom: 20, left: 70}

    var width = 350 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom

    var svg = d3.select("#chart13").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


  // Build your scales here
  var widthScale = d3.scaleLinear().domain([0,10])
                  .range([0, width])

  var yPositionScale = d3.scaleBand()
                    .range([height, 0])

  var colourScale = d3.scaleOrdinal()
                    .domain(["cat",
                              "dog",
                              "cow"])
                    .range(['#e0f3db',
                      '#a8ddb5',
                      '#43a2ca'])

  d3.csv("eating-data.csv")
    .then(ready)
    .catch(function(err) {
      console.log("Failed with", err)
    })


  function ready(datapoints) {
    // Add and style your marks here
    // var names = datapoints.map(function(d) { return d.name })
    // yPositionScale.domain(names)

    yPositionScale.domain(datapoints.map(function(d) { return d.name }))

    svg.selectAll(".bar")
    .data(datapoints)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("y", function(d) { 
      return yPositionScale(d.name)
    })
    .attr('height', yPositionScale.bandwidth() * 0.9)
    .attr('width', d => widthScale(d.hamburgers))
    .attr('fill', d => colourScale(d.animal))

    var yAxis = d3.axisLeft(yPositionScale)
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis)

    var xAxis = d3.axisBottom(widthScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
  }
})()