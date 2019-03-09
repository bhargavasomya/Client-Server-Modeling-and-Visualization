var margin = 50;
var width = 600;
var height = 400;

var dataGroup = d3.select(".graph").append("svg")
  .attr("width", width + margin)
  .attr("height", height + 2 * margin)
  .append("g")
  .attr("transform", "translate(" + margin + ", " + margin + ")");

function showGraph() {
    var radios = document.getElementsByName('optradio');
    var cInput = document.getElementById('c').value;

    d3.selectAll('svg > g > *').remove();

    console.log(cInput)

    var preprocess = ""

    if (radios[0].checked) {
        preprocess = "StandardScaler"
    } else {
        preprocess = "MinMaxScaler"
    }

    var link = "http://127.0.0.1:5000/roc/" + preprocess + "/" + cInput;
    console.log(link);

    d3.json(link).then(function(data) {
        console.log(data);
        var randomLineData = [{"x": 0.0, "y": 0.0}, {"x": 1.0, "y": 1.0}];

        var line = d3.line()
            .x(d => x(d.fpr))
            .y(d => y(d.tpr));

        var randomLine = d3.line()
            .x(d => x(d.x))
            .y(d => y(d.y));

          // Scale
        var scale_horizontal = d3.scaleLinear()
                .domain( [0.0, 1.5] )
                .range( [0.0, width] );

        var scale_vertical = d3.scaleLinear()
                .domain( [0.0, 1.0] )
                .range( [0.0, width - 20] );
        // Gridline
        var gridlineshorizontal = d3.axisLeft()
                    .tickFormat(" ")
                    .tickSize(-width + 20)
                    .ticks(9)
                    .scale(scale_horizontal);

        dataGroup.append("g")
            .attr("class", "grid")
            .attr("color", "gainsboro")
            .call(gridlineshorizontal);

         var gridlinesvertical = d3.axisBottom()
                    .tickFormat(" ")
                    .tickSize(height)
                    .ticks(5)
                    .scale(scale_vertical);

        dataGroup.append("g")
            .attr("class", "grid")
            .attr("color", "gainsboro")
            .call(gridlinesvertical);

        var x = d3.scaleLinear()
            .domain(d3.extent(data, function (d) {
                return d.fpr;
            }))
            .range([0, width - 20]);

        var y = d3.scaleLinear()
            .domain(d3.extent(data, function (d) {
                return d.tpr;
            }))
            .range([height, 0]);

        dataGroup.append("path")
            .data([data])
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", "1.5px")
            .attr("d", line);

        dataGroup.append("path")
            .data([randomLineData])
            .attr("fill", "none")
            .style("stroke-dasharray", ("3, 3"))
            .attr("stroke", "orange")
            .attr("stroke-width", "1.5px")
            .attr("d", randomLine);

        var xAxisGroup = dataGroup
            .append("g")
            .attr("class", "xAxisGroup")
            .attr("transform", "translate(0," + height + ")");

        var xAxis = d3.axisBottom(x).ticks(5);

        xAxis(xAxisGroup);

        var yAxisGroup = dataGroup
            .append("g")
            .attr("class", "yAxisGroup");

        var yAxis = d3.axisLeft(y).ticks(5);

        yAxis(yAxisGroup);

       dataGroup.append("text")
      .attr("transform",
            "translate(" + (width/2 - 20) + " ," +
                           (height + 40) + ")")
      .style("text-anchor", "middle")
      .text("False Positive Rate");

      dataGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - 45)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("True Positive Rate");
    });
}