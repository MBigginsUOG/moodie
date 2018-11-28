var freqData=[
{day:'M', freq:{sentiment_very_dissatisfied:3, sentiment_dissatisfied:7, sentiment_neutral:10, sentiment_satisfied:15, sentiment_very_satisfied:25}},
{day:'T', freq:{sentiment_very_dissatisfied:0, sentiment_dissatisfied:3, sentiment_neutral:9, sentiment_satisfied:13, sentiment_very_satisfied:15}},
{day:'W', freq:{sentiment_very_dissatisfied:0, sentiment_dissatisfied:1, sentiment_neutral:10, sentiment_satisfied:15, sentiment_very_satisfied:19}},
{day:'T', freq:{sentiment_very_dissatisfied:3, sentiment_dissatisfied:5, sentiment_neutral:15, sentiment_satisfied:13, sentiment_very_satisfied:16}},
{day:'F', freq:{sentiment_very_dissatisfied:4, sentiment_dissatisfied:2, sentiment_neutral:5, sentiment_satisfied:3, sentiment_very_satisfied:10}},
{day:'S', freq:{sentiment_very_dissatisfied:5, sentiment_dissatisfied:2, sentiment_neutral:10, sentiment_satisfied:17, sentiment_very_satisfied:20}},
{day:'S', freq:{sentiment_very_dissatisfied:0, sentiment_dissatisfied:1, sentiment_neutral:2, sentiment_satisfied:6, sentiment_very_satisfied:5}},
];

// dashboard('#dashboard',freqData);
dailymood('#dailyMoodId', freqData);

// function dashboard(id, fData){
function dailymood(histId, fData){

  var	margin = {top: 30, right: 40, bottom: 70, left: 50};

  var barColor = '#2196F3';
  function segColor(c){ return {
                                  sentiment_very_dissatisfied:"#e21818",
                                  sentiment_dissatisfied:"#FB8C00",
                                  sentiment_neutral:"#fbd300",
                                  sentiment_satisfied:"#79e65e",
                                  sentiment_very_satisfied:"#298e00"
                                }[c];
                        }
  // compute total for each Activity.
  fData.forEach(function(d){
                            // d.total = (d.freq.sentiment_very_dissatisfied + d.freq.sentiment_dissatisfied + d.freq.sentiment_neutral + d.freq.sentiment_satisfied + d.freq.sentiment_very_satisfied;
                            d.total = Math.random(Math.round(4))

                            // (d.freq.sentiment_very_dissatisfied + d.freq.sentiment_dissatisfied + d.freq.sentiment_neutral + d.freq.sentiment_satisfied + d.freq.sentiment_very_satisfied;
                            });

    // function to handle histogram.
  function histoGram(fD){
    var hG={};
    var hGDim = {t: 60, r: 0, b: 30, l: 0};
    hGDim.w = 500 - hGDim.l - hGDim.r,
    hGDim.h = 300 - hGDim.t - hGDim.b;

    //create svg for histogram.
    // var hGsvg = d3.select(id).append("svg")
    // // var hGsvg = d3.select(histId).append("svg")
    //             .attr("width", hGDim.w + hGDim.l + hGDim.r)
    //             .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
    //             .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");


    var hGsvg = d3.select(histId)
    // var hGsvg = d3.select(id)
      .append("div")
      .classed("svg-container", true)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 600 400")
      .classed("svg-content-responsive", true)
      .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")")
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")
      .style("font-size","35px");


        // create function for x-axis mapping.
        var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
                .domain(fD.map(function(d) { return d[0]; }));

        // Add x-axis to the histogram svg.
        hGsvg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + hGDim.h + ")")
            .call(d3.svg.axis().scale(x).orient("bottom"))
            .style("font-size","22px");

        // Create function for y-axis map.
        var y = d3.scale.linear().range([hGDim.h, 0])
                .domain([0, d3.max(fD, function(d) { return d[1]; })]);

        // Create bars for histogram to contain rectangles and freq labels.
        var bars = hGsvg.selectAll(".bar").data(fD).enter()
                .append("g").attr("class", "bar");

        //create the rectangles.
        bars.append("rect")
            .attr("x", function(d) { return x(d[0]); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("width", x.rangeBand())
            .attr("height", function(d) { return hGDim.h - y(d[1]); })
            .attr('fill',barColor)


        //Create the frequency labels above the rectangles.
        bars.append("text").text(function(d){ return d3.format(",")(d[1])})
            .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
            .attr("y", function(d) { return y(d[1])-5; })
            .attr("text-anchor", "middle");


        histoGram(fD)
        return hG;
    }

}
