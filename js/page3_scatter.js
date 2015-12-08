			var widthScatter = 600;
			var heightScatter = 450;

			var marginScatter = { top: 20, right: 10, bottom: 50, left: 80 };
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
							     });

				circlesScatter.attr("cx", function(d) {
						return + xScaleScatter(+d.Year2015);
					})
					.attr("cy", function(d) {
						return + yScaleScatter(+d.literacy);
					})
					.attr("r", dotRadius)
					.style('cursor','pointer');

				circlesScatter.filter(function(d){
					return d == null;
				}).remove();
			

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



				d3.select("button#literacy").classed("selected", true);

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
							})
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
							})
						});

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
							})
						});

function showRegion(RegionCode) {
    var countries = d3.selectAll("circle."+RegionCode);
    console.log("circle."+RegionCode);
    if (countries.classed('highlight')) {
        countries.attr("class", RegionCode);
    } else {
        countries.classed('highlight', true);
    }
}


$(document).ready(function() {
    $('#filters a').click(function() {
        var countryId = $(this).attr("id");
        $(this).toggleClass(countryId);
        showRegion(countryId);
    });
				
});

})


