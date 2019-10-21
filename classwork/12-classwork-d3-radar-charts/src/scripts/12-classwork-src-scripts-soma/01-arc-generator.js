import * as d3 from 'd3'

const margin = { top: 0, left: 0, right: 0, bottom: 0 }

const height = 400 - margin.top - margin.bottom

const width = 700 - margin.left - margin.right

const svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)
  .append('g')
  .attr('transform', `translate(${width / 2},${height / 2})`)

let arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(50)
  .startAngle(0)
  .endAngle(Math.PI / 2)

svg.append('path').attr('d', arc)

arc = d3
  .arc()
  .innerRadius(40)
  .outerRadius(50)
  .startAngle(Math.PI / 2)
  .endAngle(Math.PI * 1.5)

svg
  .append('path')
  .attr('d', arc)
  .attr('fill', 'blue')
