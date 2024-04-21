// set the dimensions and margins of the graph
const width3 = 860,
    height3 = 500,
    margin3 = 20;

const x = d3.scaleLinear()
.range([0, width3 - 3 * margin3]);

const y = d3.scaleLinear()
    .range([0, height3 - 2 * margin3]);

const z = d3.scaleOrdinal(d3.schemeCategory10)

const n = d3.format(",d"),
    p = d3.format("%");

// append the svg object to the body of the page
const svg3 = d3.select("#marimekko")
  .append("svg")
    .attr("width", width3)
    .attr("height", height3)
  .append("g")
    .attr("transform", "tdataranslate(" + 2 * margin3 + "," + margin3 + ")");

d3.json("marimekko.json", function(error, data) {
  if (error) throw error;

  let offset = 0;

  // Nest values by segment. We assume each segment+market is unique.
  let tipos = d3.nest()
      .key(function(d) { return d.Tipo; })
      .entries(data);

  console.log(tipos)

  // Compute the total sum, the per-segment sum, and the per-market offset.
  // You can use reduce rather than reduceRight to reverse the ordering.
  // We also record a reference to the parent segment for each market.
  const sum = tipos.reduce(function(v, p) {
    return (p.offset = v) + (p.sum = p.values.reduceRight(function(v, d) {
      d.parent = p;
      return (d.offset = v) + d.Consumo;
    }, 0));
  }, 0);

  // Add x-axis ticks.
  const xtick = svg3.selectAll(".x")
      .data(x.ticks(10))
    .enter().append("g")
      .attr("class", "x")
      .attr("transform", function(d) { return "translate(" + x(d) + "," + y(1) + ")"; });

  xtick.append("line")
      .attr("y2", 6)
      .style("stroke", "#000");

  xtick.append("text")
      .attr("y", 8)
      .attr("text-anchor", "middle")
      .attr("dy", ".71em")
      .text(p);

  // Add y-axis ticks.
  const ytick = svg3.selectAll(".y")
      .data(y.ticks(10))
    .enter().append("g")
      .attr("class", "y")
      .attr("transform", function(d) { return "translate(0," + y(1 - d) + ")"; });

  ytick.append("line")
      .attr("x1", -6)
      .style("stroke", "#000");

  ytick.append("text")
      .attr("x", -8)
      .attr("text-anchor", "end")
      .attr("dy", ".35em")
      .text(p);

  // Add a group for each segment.
  let segments = svg3.selectAll(".tipo")
      .data(tipos)
    .enter().append("g")
      .attr("class", "tipo")
      .attr("xlink:title", function(d) { return d.key; })
      .attr("transform", function(d) { return "translate(" + x(d.offset / sum) + ")"; });

  // Add a rect for each market.
  const provincias = tipos.selectAll(".provincia")
      .data(function(d) { return d.values; })
    .enter().append("a")
      .attr("class", "provincia")
      .attr("xlink:title", function(d) { return d.Provincias + " " + d.parent.key + ": " + n(d.Consumo); })
    .append("rect")
      .attr("y", function(d) { return y(d.offset / d.parent.sum); })
      .attr("height", function(d) { return y(d.value / d.parent.sum); })
      .attr("width", function(d) { return x(d.parent.sum / sum); })
      .style("fill", function(d) { return z(d.Provincias); });
});