d3.json("./data1.json", function(data) {

nv.addGraph(function() {
  var chart = nv.models.stackedAreaChart()
		.margin({right: 100})
                .x(function(d) { return d[0] })
                .y(function(d) { return d[1] })
                .clipEdge(true)
                .useInteractiveGuideline(true)
		.rightAlignYAxis(true)
		.showControls(true)
                .transitionDuration(500);

  chart.xAxis
      .showMaxMin(false)
      .tickFormat(d3.format(',.2f'));

  chart.yAxis
      .tickFormat(d3.format(',.2f'));

  d3.select('#chart svg')
    .datum(data)
      .transition().duration(500).call(chart);

  nv.utils.windowResize(chart.update);

  return chart;
});
})
