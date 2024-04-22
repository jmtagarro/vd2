// Specify the chart’s dimensions.
const width3 = 860;
const height3 = 450;
const marginTop = 30;
const marginRight = -1;
const marginBottom = -1;
const marginLeft = 1;

// Create the SVG container.

const svg3 = d3.select("#marimekko")
  .append("svg")
    .attr("viewBox", [0, 0, width3, height3])
    .attr("width", 860)
    .attr("height", 390)
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")
    .attr("transform", "translate(0,0)");

d3.json("marimekko.json").then( function(data) {

    // Create the color scale.
    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(data.map(d => d.Tipo));

    // Compute the layout.
    const treemap = data => d3.treemap()
        .round(true)
        .tile(d3.treemapSliceDice)
        .size([840,390])
        (d3.hierarchy(d3.group(data, d => d.Provincia, d => d.Tipo)).sum(d => d.Consumo))
        .each(d => {
        d.x0 += marginLeft;
        d.x1 += marginLeft;
        d.y0 += marginTop;
        d.y1 += marginTop;
        });

    const root = treemap(data);

    // Position the nodes.
    const node = svg3.selectAll("g")
        .data(root.descendants())
        .join("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    const format = d => d.toLocaleString();

    // Draw column labels.
    const column = node.filter(d => d.depth === 1);

    column.append("text")
      .attr("x", 3)
      .attr("y", "-1.7em")
      .style("font-weight", "bold")
      .text(d => d.data[0]);

    column.append("text")
        .attr("x", 3)
        .attr("x", 3)
        .attr("y", "-0.5em")
        .attr("fill-opacity", 0.7)
        .text(d => format(Math.trunc(d.value/1000)));

    column.append("line")
        .attr("x1", -0.5)
        .attr("x2", -0.5)
        .attr("y1", -30)
        .attr("y2", d => d.y1 - d.y0)
        .attr("stroke", "#000")

    // Draw leaves
    const cell = node.filter(d => d.depth === 2);

    cell.append("rect")
        .attr("fill", d => color(d.data[0]))
        .attr("fill-opacity", (d, i) => d.value / d.parent.value)
        .attr("width", d => d.x1 - d.x0 - 1)
        .attr("height", d => d.y1 - d.y0 - 1);


      // Percent ticks

    const scaleX = d3.scaleLinear().domain([0, 100]).range([0,840])
    const axisX = d3.axisBottom(scaleX).ticks(10).tickFormat(d => d + "%")
    svg3.append("g")
      .attr("transform", "translate(0,420)")
      .call(axisX)

    const scaleY = d3.scaleLinear().domain([100, 0]).range([0,390])
    const axisY = d3.axisLeft(scaleY).ticks(10).tickFormat(d => d + "%")
    svg3.append("g")
      .attr("transform", "translate(0,30)")
      .call(axisY)


  // Color legend
  const svg4 = d3.select("#marimekko")
    .append("svg")
    .attr("width", 860)
    .attr("height", 40)
  
  const legend = d3.legendColor()
    .scale(color)
    .orient("horizontal")
    .shapeWidth(100)
    
  svg4.append("g")
    .attr("transform", "translate(480,0)")
    .call(legend)

})


