console.log('6.1');

//First, append <svg> element and implement the margin convention
var m = {t:50,r:50,b:50,l:50};
var outerWidth = document.getElementById('canvas').clientWidth,
    outerHeight = document.getElementById('canvas').clientHeight;
var w = outerWidth - m.l - m.r,
    h = outerHeight - m.t - m.b;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width',outerWidth)
    .attr('height',outerHeight)
    .append('g')
    .attr('transform','translate(' + m.l + ',' + m.t + ')');

//Import data and parse
d3.csv("../data/olympic_medal_count.csv", parse , function(error,rows){
	console.log(error);
	console.table(rows);

	// Rearrange elements in the array in a new, descending order
	rows.sort(function(a,b){
		return b["count2012"] - a["count2012"]; // this is a descending order
	});

	// Select only the first elements
	var top5 = rows.slice(0,5);
	console.table(top5);

	//Mining for max and min
	var minCount = d3.min(rows, function (d){ return d["count1900", "count1960", "count2012"]; }),
		maxCount = d3.max(rows, function (d){ return d["count1900", "count1960", "count2012"]; });

	console.log("The minimum is "+ minCount + " and the maximum is " + maxCount + ".");


	// Defining the scale for data
	var scaleX = d3.scaleOrdinal() // names not numbers on the scale
		.domain(top5.map(function(d) {return d["country"];})) // .map creates a new array from an existing array
		.range (d3.range(30,w,w/5)); // goes from 30 to w in increments of w/5

	var  scaleY = d3.scaleLinear()
		.domain([minCount,maxCount])
		.range ([h,0]);

	// Represent data using Join
	var rects = plot.selectAll("rect")
		.data(top5)
		.enter()
		.append("g")
		.append("rect")
		.attr("y", function(d){return scaleY(d["count2012"])}) // position in y axis
		.attr("x", function(d) {return scaleX(d.country);}) // position in x axis - distribute along 
		.attr("width", 30) // width of each bar
		.attr("height", function(d,i) { return h-scaleY(d["count2012"]);})// height of the bar = number of medals
		.style("fill", "black"); 

	    //Represent: axis
    var axisY = d3.axisLeft()
        .scale(scaleY)
        .tickSize(-w);
    var axisNode = plot.append('g').attr('class','axis axis-y').call(axisY);

    var axisX = d3.axisBottom()
        .scale(scaleX);
    var axisNode2 = plot.append('g')
    	.attr('class','axis axis-x')
    	.attr('transform','translate(' + 0 + ',' + h + ')')
    	.call(axisX);

/*	var axisY = d3.axisLeft()
		.scale(scaleY)
		.tickSize(-w);
	// Create a new g element called axis	
	var axisNode2 = plot.append("g").attr("class","axis")
		.attr("transform", "translate(0,0)"); // you don't need to translate it. because it starts in 0,0. 
	// Pass the selection into the function
	axisY(axisNode2);*/

});

function parse (d) {
	return {
		country: d["Country"],
		count1900: +d["1900"],
		count1960: +d["1960"],
		count2012: +d["2012"]
	}
}


