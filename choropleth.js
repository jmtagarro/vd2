// set the dimensions and margins of the graph
const margin2 = {top: 10, right: 10, bottom: 10, left: 10},
    width2 = 860 - margin2.left - margin2.right,
    height2 = 400 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
const svg2 = d3.select("#choropleth")
  .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(100)
  .center([0,20])
  .translate([width2 / 2, height2 / 2]);

// Data and color scale
let data = new Map()
const colorScale = d3.scaleThreshold()
  .domain([10, 100, 1000, 3000, 10000, 50000])
  .range(d3.schemeBlues[7]);

// Load external data and bootcod_disbar
Promise.all([
d3.json("distritos.geojson"),
d3.csv("tiques_20240304.csv")]).then(function(loadData){
  let topo = loadData[0]
  let tiques = loadData[1]
  let count = d3.rollup(tiques, v => v.length, d => d.cod_distrito)

  svg2.append("g")
    .selectAll("path")
    .data(topo.features)
    .join("path")
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    .attr("fill", function (d) {
      d.total = count.get(d.COD_DIS_TX) || 0;
      return colorScale(d.total);
    })
})