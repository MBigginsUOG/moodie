var freqData=[
	{date:'1-May-12',mood:5, exercised:0, cleaned:5}
,{date:'30-Apr-12',mood:3, exercised:3, cleaned:3}
,{date:'27-Apr-12',mood:4, exercised:4, cleaned:0}
,{date:'26-Apr-12',mood:3, exercised:0, cleaned:0}
,{date:'25-Apr-12',mood:5, exercised:5, cleaned:0}
,{date:'24-Apr-12',mood:1, exercised:1, cleaned:0}
,{date:'23-Apr-12',mood:1, exercised:0, cleaned:1}
,{date:'20-Apr-12',mood:3, exercised:3, cleaned:3}
,{date:'19-Apr-12',mood:3, exercised:0, cleaned:3}
,{date:'18-Apr-12',mood:3, exercised:3, cleaned:0}
,{date:'17-Apr-12',mood:3, exercised:3, cleaned:3}
,{date:'16-Apr-12',mood:4, exercised:4, cleaned:0}
,{date:'13-Apr-12',mood:3, exercised:0, cleaned:0}
,{date:'10-Apr-12',mood:5, exercised:5, cleaned:0}
,{date:'09-Apr-12',mood:1, exercised:1, cleaned:0}
,{date:'23-Mar-12',mood:1, exercised:0, cleaned:1}
,{date:'20-Mar-12',mood:3, exercised:3, cleaned:3}
,{date:'19-Mar-12',mood:3, exercised:0, cleaned:3}
];

scatterLine('#scatterLineId',freqData);

function scatterLine(id, data) {

var	margin = {top: 30, right: 40, bottom: 70, left: 50},
	width = 600 - margin.left - margin.right,
	height = 300 - margin.top - margin.bottom;


// Parse the date / time
var parseDate = d3.time.format("%d-%b-%y").parse;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.mood); });

// Adds the svg canvas
// var svg = d3.select("body")
var svg = d3.select(id)
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
// d3.csv("scatterLine.csv", function(error, data) {
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.mood = +d.mood;
        d.exercised = +d.exercised;
        d.cleaned = +d.cleaned;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.mood; })]);

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));


///////////////////////////////////// EXERCISED
    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("class","dot")
        .attr("r", 3.5)
        .attr("id","exercisedDots")
        .style("fill", "red")
        .attr("opacity", function(d) {
          // var active   = exercisedDots.active ? false : true;
          return (d.exercised==0) ? 0 : 1;
        })
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.exercised); });

    svg.append("text")
      .attr("id","exercisedText")
    	.attr("x", 0)
    	.attr("y", height + margin.top + 10)
    	.attr("class", "legend")
    	.style("fill", "red")
      .text("Exercised")
    	.on("click", function(){
    		// Determine if current line is visible

    		var active   = exercisedDots.active ? false : true;
    		var newOpacity = active ? 0 : 1;
        (active) ? d3.selectAll("#exercisedText").style("opacity",0.5)
                  : d3.selectAll("#exercisedText").style("opacity",1);
        d3.selectAll("#exercisedDots")
            .style("opacity", function(d) {
                                      return (d.exercised==0) ? 0 : newOpacity;
                                      })
    		exercisedDots.active = active;
    	});

///////////////////////////////////// CLEANED
    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("class","dot")
        .attr("r", 3.5)
        .attr("id","cleanedDots")
        .style("fill", "green")
        .attr("opacity", function(d) {
          return (d.cleaned==0) ? 0 : 1;
        })
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.cleaned); });

    svg.append("text")
      .attr("id","cleanedText")
      .attr("x", 0)
      .attr("y", height + margin.top + 30)
      .attr("class", "legend")
      .style("fill", "green")
      .text("Cleaned")
      .on("click", function(){
        var active   = cleanedDots.active ? false : true;
        var newOpacity = active ? 0 : 1;
        (active) ? d3.selectAll("#cleanedText").style("opacity",0.5)
                  : d3.selectAll("#cleanedText").style("opacity",1);
        d3.selectAll("#cleanedDots")
            .style("opacity", function(d) {
                                      return (d.cleaned==0) ? 0 : newOpacity;
                                      })
        cleanedDots.active = active;
      });

// });
}
