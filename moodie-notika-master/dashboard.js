var freqData=[
{Activity:'Sport',   freq:{sentiment_very_dissatisfied:3, sentiment_dissatisfied:7, sentiment_neutral:10, sentiment_satisfied:15, sentiment_very_satisfied:25}}
,{Activity:'Relax',   freq:{sentiment_very_dissatisfied:0, sentiment_dissatisfied:3, sentiment_neutral:9, sentiment_satisfied:13, sentiment_very_satisfied:15}}
,{Activity:'Food',    freq:{sentiment_very_dissatisfied:0, sentiment_dissatisfied:1, sentiment_neutral:10, sentiment_satisfied:15, sentiment_very_satisfied:19}}
,{Activity:'Games',   freq:{sentiment_very_dissatisfied:3, sentiment_dissatisfied:5, sentiment_neutral:15, sentiment_satisfied:13, sentiment_very_satisfied:16}}
,{Activity:'Clean',  freq:{sentiment_very_dissatisfied:4, sentiment_dissatisfied:2, sentiment_neutral:5, sentiment_satisfied:3, sentiment_very_satisfied:10}}
,{Activity:'Friends',freq:{sentiment_very_dissatisfied:5, sentiment_dissatisfied:2, sentiment_neutral:10, sentiment_satisfied:17, sentiment_very_satisfied:20}}
,{Activity:'Date',   freq:{sentiment_very_dissatisfied:0, sentiment_dissatisfied:1, sentiment_neutral:2, sentiment_satisfied:6, sentiment_very_satisfied:5}}
// {Activity:'Sport',   freq:{awful:3, bad:7, meh:10, good:15, rad:25}}
// ,{Activity:'Relax',   freq:{awful:0, bad:3, meh:9, good:13, rad:15}}
// ,{Activity:'Food',    freq:{awful:0, bad:1, meh:10, good:15, rad:19}}
// ,{Activity:'Games',   freq:{awful:3, bad:5, meh:15, good:13, rad:16}}
// ,{Activity:'Clean',  freq:{awful:4, bad:2, meh:5, good:3, rad:10}}
// ,{Activity:'Friends',freq:{awful:5, bad:2, meh:10, good:17, rad:20}}
// ,{Activity:'Date',   freq:{awful:0, bad:1, meh:2, good:6, rad:5}}
// ,{Activity:'AZ',freq:{awful:34, bad:1101, meh:412, good:674, rad:99}}
// ,{Activity:'CT',freq:{awful:44, bad:932, meh:219, good:418, rad:199}}
// ,{Activity:'GA',freq:{awful:4, bad:119, meh:167, good:163, rad:99}}
// ,{Activity:'IL',freq:{awful:4, bad:448, meh:3852, good:942, rad:99}}
// ,{Activity:'KS',freq:{awful:43, bad:162, meh:379, good:471, rad:969}}
];

// dashboard('#dashboard',freqData);
dashboard('#histId','#legId','#pieId',freqData);

// function dashboard(id, fData){
function dashboard(histId, legId, pieId, fData){

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
                            d.total = d.freq.sentiment_very_dissatisfied + d.freq.sentiment_dissatisfied + d.freq.sentiment_neutral + d.freq.sentiment_satisfied + d.freq.sentiment_very_satisfied;
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
            .on("mouseover",mouseover)// mouseover is defined bebad.
            .on("mouseout",mouseout);// mouseout is defined bebad.

        //Create the frequency labels above the rectangles.
        bars.append("text").text(function(d){ return d3.format(",")(d[1])})
            .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
            .attr("y", function(d) { return y(d[1])-5; })
            .attr("text-anchor", "middle");

        function mouseover(d){  // utility function to be called on mouseover.
            // filter for selected Activity.
            var st = fData.filter(function(s){ return s.Activity == d[0];})[0],
                nD = d3.keys(st.freq).map(function(s){ return {type:s, freq:st.freq[s]};});

            // call update functions of pie-chart and legend.
            pC.update(nD);
            leg.update(nD);
        }

        function mouseout(d){    // utility function to be called on mouseout.
            // reset the pie-chart and legend.
            pC.update(tF);
            leg.update(tF);
        }

        // create function to update the bars. This will be used by pie-chart.
        hG.update = function(nD, color){
            // update the domain of the y-axis map to reflect change in frequencies.
            y.domain([0, d3.max(nD, function(d) { return d[1]; })]);

            // Attach the new data to the bars.
            var bars = hGsvg.selectAll(".bar").data(nD);

            // transition the height and color of rectangles.
            bars.select("rect").transition().duration(500)
                .attr("y", function(d) {return y(d[1]); })
                .attr("height", function(d) { return hGDim.h - y(d[1]); })
                .attr("fill", color);

            // transition the frequency labels location and change value.
            bars.select("text").transition().duration(500)
                .text(function(d){ return d3.format(",")(d[1])})
                .attr("y", function(d) {return y(d[1])-5; });
        }
        return hG;
    }

/////////////////////////////////////////////////////////
    function pieChart(pD){
        var pC ={};
        var pieDim ={w:250, h: 250};
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;


        // var piesvg = d3.select(id).append("svg")
        var piesvg = d3.select(pieId).append("svg")
            .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
            .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");


        // create function to draw the arcs of the pie slices.
        var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);

        // create a function to compute the pie slice angles.
        var pie = d3.layout.pie().sort(null).value(function(d) { return d.freq; });

        // Draw the pie slices.
        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
            .each(function(d) { this._current = d; })
            .style("fill", function(d) { return segColor(d.data.type); })
            .style('stroke', 'white')
            .style('stroke-width', 5)
            .on("mouseover",mouseover).on("mouseout",mouseout);

        // create function to update pie-chart. This will be used by histogram.
        pC.update = function(nD){
            piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                .attrTween("d", arcTween);
        }
        // Utility function to be called on mouseover a pie slice.
        function mouseover(d){
            // call the update function of histogram with new data.
            hG.update(fData.map(function(v){
                return [v.Activity,v.freq[d.data.type]];}),segColor(d.data.type));
        }
        //Utility function to be called on mouseout a pie slice.
        function mouseout(d){
            // call the update function of histogram with all data.
            hG.update(fData.map(function(v){
                return [v.Activity,v.total];}), barColor);
        }
        // Animating the pie-slice requiring a custom function which specifies
        // how the intermediate paths should be drawn.
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) { return arc(i(t));    };
        }
        return pC;
    }

/////////////////////////////////////////////////////////
    function legend(lD){
        var leg = {};

        // create table for legend.
        // var legend = d3.select(id).append("table").attr('class','legend');
        var legend = d3.select(legId).append("table").attr('class','legend');

        // create one row per segment.
        var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

      //   // create the first column for each segment.
      //   tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
      //       .attr("width", '16').attr("height", '16')
			// .attr("fill",function(d){ return segColor(d.type); });

        // create the second column for each segment.
        tr.append("i").attr("class",'material-icons')
            .text(function(d){return d.type;})
            .style("color",function(d){ return segColor(d.type); });

        // tr.append("td").attr("class",'legendLabel')
        //     .text(function(d){ return d.type;});


        // create the third column for each segment.
        tr.append("td").attr("class",'legendFreq')
            .text(function(d){ return d3.format(",")(d.freq);});

        // create the fourth column for each segment.
        tr.append("td").attr("class",'legendPerc')
            .text(function(d){ return getLegend(d,lD);});

        // Utility function to be used to update the legend.
        leg.update = function(nD){
            // update the data attached to the row elements.
            var l = legend.select("tbody").selectAll("tr").data(nD);

            l.select(".legendLabel").text("Hello");

            // update the frequencies.
            l.select(".legendFreq").text(function(d){ return d3.format(",")(d.freq);});

            // update the percentage column.
            l.select(".legendPerc").text(function(d){ return getLegend(d,nD);});
        }

        function getLegend(d,aD){ // Utility function to compute percentage.
            return d3.format("%")(d.freq/d3.sum(aD.map(function(v){ return v.freq; })));
        }

        return leg;
    }

    // calculate total frequency by segment for all Activity.
    var tF = ['sentiment_very_dissatisfied','sentiment_dissatisfied','sentiment_neutral','sentiment_satisfied','sentiment_very_satisfied'].map(function(d){
        return {type:d, freq: d3.sum(fData.map(function(t){ return t.freq[d];}))};
    });

    // calculate total frequency by Activity for all segment.
    var sF = fData.map(function(d){return [d.Activity,d.total];});

    var hG = histoGram(sF), // create the histogram.
        pC = pieChart(tF), // create the pie-chart.
        leg= legend(tF);  // create the legend.


}
