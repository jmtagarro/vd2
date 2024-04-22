// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 40, left: 80},
    width = 860 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#histogram")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left},${margin.top})`);

// get the data
d3.csv("tiques_20240304.csv").then( function(data) {

  // X axis: scale and draw:
  const x = d3.scaleLinear()
      .domain([0, 500])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width]);
  svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

  // Y axis: initialization
  const y = d3.scaleLinear()
      .range([height, 0]);
  const yAxis = svg.append("g")

function update(nBin) {

  // set the parameters for the histogram
  const histogram = d3.histogram()
      .value(function(d) { return d.minutos_tique; })   // I need to give the vector of value
      .domain(x.domain())  // then the domain of the graphic
      .thresholds(x.ticks(nBin)); // then the numbers of bins

  // And apply this function to data to get the bins
  const bins = histogram(data);

  // Y axis: update now that we know the domain
  y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
  yAxis
      .transition()
      .duration(1000)
      .call(d3.axisLeft(y));

  // append the bar rectangles to the svg element
  svg.selectAll("rect")
    .data(bins)
    .join("rect")
    .transition()
    .duration(1000)
      .attr("x", 1)
      .attr("transform", function(d) { return `translate(${x(d.x0)}, ${y(d.length)})`})
      .attr("width", function(d) { 
        let w = x(d.x1) - x(d.x0) - 1
        return w > 0 ? w : 0;
      })
      .attr("height", function(d) { return height - y(d.length); })
      .style("fill", "#6BAED6")

}

  update(20)

  // Listen to the button -> update if user change it
  d3.select("#nBin").on("input", function() {
    update(+this.value);
  });

  // Add Y axis label
  svg.append("text")
  .attr("text-anchor", "end")
  .attr("x", width)
  .attr("y", height + margin.top + 30)
  .text("Duración en minutos")
    
  // Add Y axis label
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left+20)
    .attr("x", -margin.top)
    .text("Número de tiques")
        
});
