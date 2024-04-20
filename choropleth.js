// set the dimensions and margins of the graph
const margin2 = {top: 10, right: 10, bottom: 10, left: 10},
    width2 = 860 - margin2.left - margin2.right,
    height2 = 400 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
const svg2 = d3.select("#choropleth")
  .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom);


// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(6000)
  .center([-4.5,37.5])
  .translate([width / 2, height / 2]);

// Data and color scale
let data = new Map()

const colorScale = d3.scaleThreshold()
.domain([1, 2, 5, 10, 50, 100, 300, 500])
.range(d3.schemeBlues[9]);

// Load external data and bootcod_disbar
Promise.all([
d3.json("municipios.geojson"),
d3.dsv(";", "da_centros.csv")]).then(function(loadData){
  let topo = loadData[0]
  let centros = loadData[1]
  let count = d3.rollup(centros, v => v.length, d => d.cod_municipio)
  console.log(count)
  svg2.append("g")
    .selectAll("path")
    .data(topo.features)
    .join("path")
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    .attr("fill", function (d) {
      d.total = count.get(d.properties.NATCODE.slice(-5)) || 0;
      return colorScale(d.total);
    })

  // Color legend
  let legend = d3.legendColor()
  .scale(colorScale)
  .labelFormat(d3.format(".0f"))
  .labelDelimiter("-")
  .labels(["Ninguno","1","2-4","5-9","10-49","50-99","100-299","300-499",">500"])

  svg2.append("g")
    .attr("transform", "translate(720,10)")
    .call(legend)
})
