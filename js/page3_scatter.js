			var widthScatter = 500;
			var heightScatter = 400;

			var marginScatter = {top: 20, right: 10, bottom: 50, left: 70 };
			var dotRadius = 4;

			var xScaleScatter = d3.scale.linear()
								.range([ marginScatter.left, widthScatter - marginScatter.right - marginScatter.left])

			var yScaleScatter = d3.scale.linear()
								.range([ heightScatter - marginScatter.bottom, marginScatter.top ])

			var xAxisScatter = d3.svg.axis()
							.scale(xScaleScatter)
							.orient("bottom")
							.ticks(10);

			var yAxisScatter = d3.svg.axis()
							.scale(yScaleScatter)
							.orient("left");							
		
			var svgScatter = d3.select("#page3_scatter")
						.append("svg")
						.attr("width", widthScatter)
						.attr("height", heightScatter);

			var drawylabel = svgScatter.append('text')
								.attr("transform", "rotate(-90)")
								.attr("x", -marginScatter.top)
								.attr("y", -marginScatter.left + 103)
								.style("text-anchor", "end")
								.attr("class","label");


			d3.csv("data/scatter_data.csv", function(data) {
           

            	xScaleScatter.domain(d3.extent(data, function(d){
            			return + d.Year2015;
            		}));
            	yScaleScatter.domain(d3.extent(data, function(d){
            			return + d.literacy;
            		}));

				var circlesScatter = svgScatter.selectAll("circle")
							     .data(data)
							     .enter()
							     .append("circle")
							     .attr("class", function(d){
							     	return d.RegionCode;
							     })
							     .attr("fill", "#0099FF")
							     .attr("fill-opacity", "0.3");

				circlesScatter.attr("cx", function(d) {
						return + xScaleScatter(+d.Year2015);
					})
					.attr("cy", function(d) {
						return + yScaleScatter(+d.literacy);
					})
					.attr("r", dotRadius)
					.style('cursor','pointer');

				circlesScatter.filter(function(d){
					return "d.cy" == null;
					console.log(d);
				}).remove();

				circlesScatter
					.on("mousemove", mousemoveFunc)
					.on("mouseout",	mouseoutFunc);

			

				svgScatter.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + (heightScatter - marginScatter.bottom + 10) + ")")
					.call(xAxisScatter);

				svgScatter.append("g")
					.attr("class", "y axis")
					.attr("transform", "translate(" + (marginScatter.left - 10) + ",0)")
					.call(yAxisScatter);

				svgScatter.append("text")
					.attr("class", "xlabel")
					.attr("transform", "translate(" + (widthScatter / 2) + " ," +
								(heightScatter-15) + ")")
					.style("text-anchor", "middle")
					.attr("dy", "12")
					.text("Under 5 Mortality Rate (per thousand births)")
					.attr("font-family", "Open Sans");

                var ylabel = svgScatter.append("text")
					.attr("class", "ylabel")
					.attr("y", marginScatter.left/8 + 5)
                    .attr("x", 0 - heightScatter/3 - 30 )
					.style("text-anchor", "middle")
					.attr("transform", "rotate(-90)")
					.attr("font-family", "Open Sans");	

				svgScatter.select(".y.axis")
				   .transition()
				   .duration(2000)
				   .call(yAxisScatter);

				var tooltip = d3.select("body")
                            .append("div")
                            .attr("class", "tooltip");  

                function mousemoveFunc(d) {
							tooltip
								.style("top", (d3.event.pageY - 10) + "px" )
								.style("left", (d3.event.pageX + 10) + "px");
							}

				function mouseoutFunc(d) {
							d3.select(this)
								.transition()
								.attr("fill-opacity", 0.3)
								.attr("r", 4)
					    tooltip.style("display", "none");  
					  };





				d3.select("button#literacy").classed("selected", true);
				d3.select("#literacy").on("click", true);

//click to GNI per capita:
					d3.select("#literacy").on("click", function() {
						d3.selectAll("button").classed("selected", false);
					    d3.select("button#GNI").classed("selected", true);

                        yScaleScatter
						    .domain(d3.extent(data, function(d){
							return + d.literacy;
            		        }));


						circlesScatter
							.transition()
							.duration(2000)
							.attr("cx", function(d) {
								return xScaleScatter(+d.Year2015);
								// return the value to use for your x scale here
							})
							.attr("cy", function(d) {
								return yScaleScatter(+d.literacy);
							})

						circlesScatter
					         .on("mouseover", mouseoverFunc);

						function mouseoverFunc(d) {
							d3.select(this)
								.transition()
								.attr("r", 6);
							tooltip
								.style("display", null) // this removes the display none setting from it
								.html("<p>Country: " + d.CountryName +
											"<br>U5MR: " + d.Year2015 +
										  "<br> Total Adult Literacy Rate: " + d.literacy + "</p>");
							d3.selectAll("circle").classed("circleunfocused", true);
				            d3.select(this).select("circle").classed("circleunfocused", false).classed("circlefocused", true);
							};

							ylabel
						       .text("Total Adult Literacy Rate")
						       .transition()
						       .duration(2000)
						       .call(ylabel);

						});

			
					
						d3.select("#GNI").on("click", function() {
						d3.selectAll("button").classed("selected", false);
					    d3.select("button#GNI").classed("selected", true);

                        yScaleScatter
						    .domain(d3.extent(data, function(d){
							return + d.GNI;
            		        }));
						svgScatter.select(".y.axis")
						    .transition()
						    .duration(2000)
						    .call(yAxisScatter);

						circlesScatter
							.transition()
							.duration(2000)
							.attr("cx", function(d) {
								return xScaleScatter(+d.Year2015);
								// return the value to use for your x scale here
							})
							.attr("cy", function(d) {
								return yScaleScatter(+d.GNI);
							})

						circlesScatter
					         .on("mouseover", mouseoverFunc);

						function mouseoverFunc(d) {
							d3.select(this)
								.transition()
								.attr("r", 6)
							tooltip
								.style("display", null) // this removes the display none setting from it
								.html("<p>Country: " + d.CountryName +
											"<br>U5MR: " + d.Year2015 +
										  "<br> GNI per Capita: " + d.GNI + "</p>");
							d3.selectAll("circle").classed("circleunfocused", true);
				            d3.select(this).select("circle").classed("circleunfocused", false).classed("circlefocused", true);
							};

							ylabel
						       .text("GNI per Capita")
						       .transition()
						       .duration(2000)
						       .call(ylabel);
						});

						d3.select("#breastfeeding").on("click", function() {
						d3.selectAll("button").classed("selected", false);
					    d3.select("button#breastfeeding").classed("selected", true);

                        yScaleScatter
						    .domain(d3.extent(data, function(d){
							return + d.breastfeeding;
            		        }));
						svgScatter.select(".y.axis")
						    .transition()
						    .duration(2000)
						    .call(yAxisScatter);

						circlesScatter
							.transition()
							.duration(2000)
							.attr("cx", function(d) {
								return xScaleScatter(+d.Year2015);
								// return the value to use for your x scale here
							})
							.attr("cy", function(d) {
								return yScaleScatter(+d.breastfeeding);
							});

						circlesScatter
					         .on("mouseover", mouseoverFunc);

						function mouseoverFunc(d) {
							d3.select(this)
								.transition()
								.attr("r", 6)
							tooltip
								.style("display", null) // this removes the display none setting from it
								.html("<p>Country: " + d.CountryName +
											"<br>U5MR: " + d.Year2015 +
										  "<br>Breastfeeding at Age2: " + d.breastfeeding + "</p>");
							d3.selectAll("circle").classed("circleunfocused", true);
				            d3.select(this).select("circle").classed("circleunfocused", false).classed("circlefocused", true);
							};

							ylabel
						       .text("Breastfeeding at Age2 (%)")
						       .transition()
						       .duration(2000)
						       .call(ylabel);	

						});

					d3.select("#water").on("click", function() {
						d3.selectAll("button").classed("selected", false);
					    d3.select("button#water").classed("selected", true);

                        yScaleScatter
						    .domain(d3.extent(data, function(d){
							return + d.water;
            		        }));
						svgScatter.select(".y.axis")
						    .transition()
						    .duration(2000)
						    .call(yAxisScatter);

						circlesScatter
							.transition()
							.duration(2000)
							/*.attr("cx", function(d) {
								return xScaleScatter(+d.Year2015);
								// return the value to use for your x scale here
							})*/
							.attr("cy", function(d) {
								return yScaleScatter(+d.water);
							});

						function mouseoverFunc(d) {
							d3.select(this)
								.transition()
								.attr("r", 6)
							tooltip
								.style("display", null) // this removes the display none setting from it
								.html("<p>Country: " + d.CountryName +
											"<br>U5MR: " + d.Year2015 +
										  "<br>Use of Improved Drinking Water Sources: " + d.water + "</p>");
							d3.selectAll("circle").classed("circleunfocused", true);
				            d3.select(this).select("circle").classed("circleunfocused", false).classed("circlefocused", true);
							};

						ylabel
						       .text("Use of Improved Drinking Water Sources(%)")
						       .transition()
						       .duration(2000)
						       .call(ylabel);	


						});
//Select sanitation
					d3.select("#sanitation").on("click", function() {
						d3.selectAll("button").classed("selected", false);
					    d3.select("button#sanitation").classed("selected", true);

                        yScaleScatter
						    .domain(d3.extent(data, function(d){
							return + d.sanitation;
            		        }));
						svgScatter.select(".y.axis")
						    .transition()
						    .duration(2000)
						    .call(yAxisScatter);

						circlesScatter
							.transition()
							.duration(2000)
							.attr("cy", function(d) {
								return yScaleScatter(+d.sanitation);
							})

						yScaleScatter
						    .domain(d3.extent(data, function(d){
							return + d.sanitation;
            		        }));

						circlesScatter
					         .on("mouseover", mouseoverFunc)

						function mouseoverFunc(d) {
							d3.select(this)
								.transition()
								.attr("r", 6)
							tooltip
								.style("display", null) // this removes the display none setting from it
								.html("<p>Country: " + d.CountryName +
											"<br>U5MR: " + d.Year2015 +
										  "<br>Use of improved sanitation facilities: " + d.sanitation + "</p>");
							d3.selectAll("circle").classed("circleunfocused", true);
				            d3.select(this).select("circle").classed("circleunfocused", false).classed("circlefocused", true);
							};

							ylabel
						       .text("Use of Improved Sanitation Facilities (%)")
						       .transition()
						       .duration(2000)
						       .call(ylabel);	

						});

					d3.select("#birth").on("click", function() {
						d3.selectAll("button").classed("selected", false);
					    d3.select("button#birth").classed("selected", true);

                        yScaleScatter
						    .domain(d3.extent(data, function(d){
							return + d.birth;
            		        }));
						svgScatter.select(".y.axis")
						    .transition()
						    .duration(2000)
						    .call(yAxisScatter);

						circlesScatter
							.transition()
							.duration(2000)
							.attr("cy", function(d) {
								return yScaleScatter(+d.birth);
							});

						function mouseoverFunc(d) {
							d3.select(this)
								.transition()
								.attr("r", 6)
							tooltip
								.style("display", null) // this removes the display none setting from it
								.html("<p>Country: " + d.CountryName +
											"<br>U5MR: " + d.Year2015 +
										  "<br>Skilled Attendant at Birth: " + d.birth + "</p>");
							d3.selectAll("circle").classed("circleunfocused", true);
				            d3.select(this).select("circle").classed("circleunfocused", false).classed("circlefocused", true);
							};

						ylabel
						       .text("Skilled Attendant at Birth(%)")
						       .transition()
						       .duration(2000)
						       .call(ylabel);	
						});

					function showRegion(RegionCode) {
					    var countries = d3.selectAll("circle."+RegionCode);
					    console.log("circle."+RegionCode);
					    if (countries.classed('highlight')) {
					        countries.attr("class", RegionCode);
					    } else {
					        countries.classed('highlight', true);
					    }
					};


					$(document).ready(function() {
					    $('#filters a').click(function() {
					        var countryId = $(this).attr("id");
					        $(this).toggleClass(countryId);
					        showRegion(countryId);
					    });
									
					});


})




