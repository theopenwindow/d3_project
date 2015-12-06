			var width = 700;
			var height = 500;
			var margin = {top: 20, right: 80, bottom: 40, left:0};

			var myWidth = width - margin.right - margin.left;
			var myHeight = height - margin.top - margin.bottom;


			var dateFormat = d3.time.format("%Y");
			var xScale = d3.time.scale()
								.range([ margin.left, width - margin.right]);

			var yScale = d3.scale.linear()
								.range([ margin.top, height - margin.bottom ]);

			var xAxis = d3.svg.axis()
							.scale(xScale)
							.tickSize(-myHeight)
							.orient("bottom")
							.ticks(8)
							.tickFormat(function(d) {
								return dateFormat(d);
							})
							.outerTickSize([0]);

			var yAxis = d3.svg.axis()
							.scale(yScale)
							.tickSize(myWidth)
							.orient("right")
							.outerTickSize([0])
							.ticks(5);


			var line = d3.svg.line()
				.x(function(d) {
					return xScale(dateFormat.parse(d.year));
				})
				.y(function(d) {
					return yScale(+d.amount);
				});

			var tooltip = d3.select("body")
      	                    .append("div")
      	                    .attr("class", "tooltip");


			//Create the empty SVG image
			var svg = d3.select("#page1_line")
						.append("svg")
						.attr("width", width)
						.attr("height", height);


			d3.csv("data/total.csv", function(data) {



				var years = ["1961", "1962", "1963", "1964", "1965", "1966", "1967", "1968", "1969", "1970", "1971", "1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"];

				// or 

				// var years = d3.keys(data[0]).slice(0, 54-4); //

				var dataset = [];

				data.forEach(function (d, i) {

					var themortality = [];

					years.forEach(function (y) {

						if (d[y]) {
							themortality.push({
								country: d.CountryName,
								year: y,
								amount: d[y]  
 							});
						}

					});

					dataset.push( {
						country: d.CountryName,
						mortality: themortality  
						} );

				});

				//console.log(data);

				console.log(dataset);


				xScale.domain(
					d3.extent(years, function(d) {
						return dateFormat.parse(d);
					}));

				var world = dataset.filter(function (f){return f.country == "WLD"})[0];
				console.log(world.mortality);

				yScale.domain([
					d3.max(world, function(d) {
						return d3.max(d.mortality, function(d){
							return +d.amount;
						});
					}),
					0
				]);



				var groups = svg.selectAll("g")
									.data(world)
									.enter()
									.append("g")
					/*				.filter(function(d){
											return d.country == "WLD";
										})*/
									.attr("id", function(d){
											return d.country;
										})
									.attr("class", "lines");

/*			d3.select("#Region").on("click", function(){

				groups.data(dataset)
					.enter()
					.append("g")
					.transition()
					.duration(2000)
					.filter(function(d){
						return d.country == "WLD";
					});
					
			});*/


			groups.selectAll("path")
					.data(function(d) { 
						//console.log(d.country);
						return [d.mortality]; 
					})
					.enter()
					.append("path")
					.attr("class", "line")
					.attr("d", line)
					.style('cursor','pointer');

			// Tooltip dots

			var circles = groups.selectAll("circle")
								.data(function(d) { // because there's a group with data already...
											return d.mortality; // NOT an array here.
								})
								.enter()
								.append("circle");

				circles.attr("cx", function(d) {
						return xScale(dateFormat.parse(d.year));
					})
					.attr("cy", function(d) {
						return yScale(d.amount);
						console.log(d.amount);
					})
					.attr("r", 3)
					.style("opacity", 0); // this is optional - if you want visible dots or not!

				// Adding a subtle animation to increase the dot size when over it!

				circles
					.on("mouseover", mouseoverFunc)
					.on("mousemove", mousemoveFunc)
					.on("mouseout",	mouseoutFunc);	



				groups.append("text")
				      .attr("transform", function(d){
				      	if(d.country === "World"){
				      		return "translate("+(width - margin.right - margin.left + 5)+", "+ yScale(+d.mortality[54].amount - 5) +")";
				      	}
				      }) 
				      .text(function(d){
				      	if(d.country === "World"){
				      		return d.country;
				      	}
				      })
				      .attr("font-size","11px")
				      .attr("font-weight", "bold");


				//Axes
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + (height - margin.bottom) + ")")
					.call(xAxis);

				svg.append("g")
					.attr("class", "y axis")
					.attr("transform", "translate(" + margin.left + ",0)")
					.call(yAxis);


				function mouseoverFunc(d) {
					d3.select(this)
						.transition()
						.style("opacity", 1)
						//.attr("fill", "#912F3A")
						.attr("r", 4);
					tooltip
						.style("display", null) 
						.html("<p>Country: " + d.country +
									"<br>Year: " + d.year +
								  "<br>Mortality: " + d.amount + "</p>");
					
				d3.selectAll("path.line").classed("unfocused", true);
					var mygroup = d3.select(this).node().parentNode;
		            d3.select(mygroup).select("path.line").classed("unfocused", false).classed("focused", true);
					}

				function mousemoveFunc(d) {
					tooltip
						.style("top", (d3.event.pageY - 10) + "px" )
						.style("left", (d3.event.pageX + 10) + "px");
					}


			    function mouseoutFunc() {

			    	d3.select(this)
						.transition()
						.duration(50)
						.style("opacity", 0)
						.attr("r", 0);
			    	d3.selectAll("path.line").classed("unfocused", true).classed("focused", false);
			    	tooltip.style("display", "none");  
	          }


			});