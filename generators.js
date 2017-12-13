nv.addGraph(function() {
  var chart = nv.models.stackedAreaChart()
                .x(function(d) { return d[0] })
                .y(function(d) { return d[1] })
                .clipEdge(true)
                .useInteractiveGuideline(true)
                ;

  chart.xAxis
      .showMaxMin(false)
      .tickFormat(d3.format(',.2f'));

  chart.yAxis
      .tickFormat(d3.format(',.2f'));

  d3.select('#chart svg')
    .datum(data1.txt)
      .transition().duration(500).call(chart);

  nv.utils.windowResize(chart.update);

  return chart;
});
