// https://bl.ocks.org/maybelinot/5552606564ef37b5de7e47ed2b7dc099

function logPath(d) {
  console.log(`y : [${d.y0}, ${d.y1}]`)
  console.log(`x : [${d.x0}, ${d.x1}]`)
  console.log(`frequency : ${d.frequency}`)

}

var width = 960,
    height = 700,
    radius = (Math.min(width, height) / 2) - 10;

var formatNumber = d3.format(",d");

var xScale = d3.scaleLinear()
    .range([0, 2 * Math.PI]);

// Maps y values to radius
var yScale = d3.scaleLinear()
    .range([0, radius]);

// var color = (t) => d3.interpolateRdBu(1 - t)

var partition = d3.partition();

var arc = d3.arc()
    .startAngle(  (d) => Math.max(0, Math.min(2 * Math.PI, xScale(d.x0))))
    .endAngle(    (d) => Math.max(0, Math.min(2 * Math.PI, xScale(d.x1))))
    .innerRadius( (d) => Math.max(0, yScale(d.y0)))
    .outerRadius( (d) => Math.max(0, yScale(d.y1)));


var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

d3.json("./flare.json", function(error, root) {
  if (error) throw error;
  
  root = d3.hierarchy(root);
  root.sum( (d) => d.size );

  // Frequency aggregation
  root.eachAfter( (d) => {
      if (d.children) {
        d.frequency = d.children.map(c => c.frequency)
                                .reduce( (a, b) => a + b)
      } else {
        d.frequency = d.data.frequency
      }
    } )

  svg.selectAll("path")
      .data(partition(root).descendants())
    .enter().append("path")
      .attr("d", arc)
      .style("fill", distinctColor)
      .on("click", click)
    .append("title")
      .text( (d) => d.data.name + "\n" + formatNumber(d.value) )

  d3.selectAll("input")
      .data([distinctColor, heatColor], function(d) { return d ? d.name : this.value; })
      .on("change", changed);

});

function click(d) {
  logPath(d)
  svg.transition()
      .duration(750)
      .tween("scale", function() {
        var xd = d3.interpolate(xScale.domain(), [d.x0, d.x1]),
            yd = d3.interpolate(yScale.domain(), [d.y0, 1]),
            // d.y0 ? 20 : 0 leaves hole in center when d is not root
            yr = d3.interpolate(yScale.range(),  [d.y0 ? 20 : 0, radius]);
        return function(t) {
            xScale.domain(xd(t)); 
            yScale
              .domain(yd(t))
              .range( yr(t)); 
          };
      })
    .selectAll("path")
      .attrTween("d", (d) => () => arc(d))
}


var heatScale = d3.scaleLinear()
                   .domain([0, 1])
                   .range(["lightblue", "red"])
function heatColor(d) {
  return heatScale(d.frequency)
} 

var distinctScale = d3.scaleOrdinal(d3.schemeCategory20);
function distinctColor(d) {
  return distinctScale((d.children ? d : d.parent).data.name)
}

function changed(colorFn) {
  console.log("color changed")
    svg.selectAll("path").transition()
      .duration(750)
      .style("fill", colorFn)
}



d3.select(self.frameElement).style("height", height + "px");