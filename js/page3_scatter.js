			var width = 600;
			var height = 450;

			var margin = { top: 20, right: 10, bottom: 50, left: 80 };
			var dotRadius = 4;

			var xScale = d3.scale.linear()
								.range([ margin.left, width - margin.right - margin.left])

			var yScale = d3.scale.linear()
								.range([ height - margin.bottom, margin.top ])

			var xAxis = d3.svg.axis()
							.scale(xScale)
							.orient("bottom")
							.ticks(10);

			var yAxis = d3.svg.axis()
							.scale(yScale)
							.orient("left");							
		
			var svg = d3.select("#page3_scatter")
						.append("svg")
						.attr("width", width)
						.attr("height", height);

			var drawylabel = svg.append('text')
								.attr("transform", "rotate(-90)")
								.attr("x", -margin.top)
								.attr("y", -margin.left + 103)
								.style("text-anchor", "end")
								.attr("class","label");


			d3.csv("data/scatter_data.csv", function(data) {
           

            	xScale.domain(d3.extent(data, function(d){
            			return + d.Year2015;
            		}));
            	yScale.domain(d3.extent(data, function(d){
            			return + d.literacy;
            		}));

				var circles = svg.selectAll("circle")
							     .data(data)
							     .enter()
							     .append("circle")
							     .attr("class", function(d){
							     	return d.RegionCode;
							     });

				circles.attr("cx", function(d) {
						return + xScale(+d.Year2015);
					})
					.attr("cy", function(d) {
						return + yScale(+d.literacy);
					})
					.attr("r", dotRadius)
					.style('cursor','pointer');
			

				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + (height - margin.bottom + 10) + ")")
					.call(xAxis);

				svg.append("g")
					.attr("class", "y axis")
					.attr("transform", "translate(" + (margin.left - 10) + ",0)")
					.call(yAxis);

				svg.append("text")
					.attr("class", "xlabel")
					.attr("transform", "translate(" + (width / 2) + " ," +
								(height-15) + ")")
					.style("text-anchor", "middle")
					.attr("dy", "12")
					.text("Under 5 Mortality Rate (per thousand births)")
					.attr("font-family", "Open Sans");

                var ylabel = svg.append("text")
					.attr("class", "ylabel")
					.attr("y", margin.left/8 + 5)
                    .attr("x", 0 - height/3 - 30 )
					.style("text-anchor", "middle")
					.attr("transform", "rotate(-90)")
					.attr("font-family", "Open Sans");	

				svg.select(".y.axis")
				   .transition()
				   .duration(2000)
				   .call(yAxis);



				d3.select("button#literacy").classed("selected", true);

//click to GNI per capita:
					d3.select("#literacy").on("click", function() {
						d3.selectAll("button").classed("selected", false);
					    d3.select("button#GNI").classed("selected", true);

                        yScale
						    .domain(d3.extent(data, function(d){
							return + d.literacy;
            		        }));


						circles
							.transition()
							.duration(2000)
							.attr("cx", function(d) {
								return xScale(+d.Year2015);
								// return the value to use for your x scale here
							})
							.attr("cy", function(d) {
								return yScale(+d.literacy);
							})
						});

			
					
						d3.select("#GNI").on("click", function() {
						d3.selectAll("button").classed("selected", false);
					    d3.select("button#GNI").classed("selected", true);

                        yScale
						    .domain(d3.extent(data, function(d){
							return + d.GNI;
            		        }));
						svg.select(".y.axis")
						    .transition()
						    .duration(2000)
						    .call(yAxis);

						circles
							.transition()
							.duration(2000)
							.attr("cx", function(d) {
								return xScale(+d.Year2015);
								// return the value to use for your x scale here
							})
							.attr("cy", function(d) {
								return yScale(+d.GNI);
							})
						});

						d3.select("#breastfeeding").on("click", function() {
						d3.selectAll("button").classed("selected", false);
					    d3.select("button#breastfeeding").classed("selected", true);

                        yScale
						    .domain(d3.extent(data, function(d){
							return + d.breastfeeding;
            		        }));
						svg.select(".y.axis")
						    .transition()
						    .duration(2000)
						    .call(yAxis);

						circles
							.transition()
							.duration(2000)
							.attr("cx", function(d) {
								return xScale(+d.Year2015);
								// return the value to use for your x scale here
							})
							.attr("cy", function(d) {
								return yScale(+d.breastfeeding);
							})
						});

					d3.select("#water").on("click", function() {
						d3.selectAll("button").classed("selected", false);
					    d3.select("button#water").classed("selected", true);

                        yScale
						    .domain(d3.extent(data, function(d){
							return + d.water;
            		        }));
						svg.select(".y.axis")
						    .transition()
						    .duration(2000)
						    .call(yAxis);

						circles
							.transition()
							.duration(2000)
							/*.attr("cx", function(d) {
								return xScale(+d.Year2015);
								// return the value to use for your x scale here
							})*/
							.attr("cy", function(d) {
								return yScale(+d.water);
							})
						});

					d3.select("#sanitation").on("click", function() {
						d3.selectAll("button").classed("selected", false);
					    d3.select("button#sanitation").classed("selected", true);

                        yScale
						    .domain(d3.extent(data, function(d){
							return + d.sanitation;
            		        }));
						svg.select(".y.axis")
						    .transition()
						    .duration(2000)
						    .call(yAxis);

						circles
							.transition()
							.duration(2000)
							.attr("cy", function(d) {
								return yScale(+d.sanitation);
							})
						});

					d3.select("#birth").on("click", function() {
						d3.selectAll("button").classed("selected", false);
					    d3.select("button#birth").classed("selected", true);

                        yScale
						    .domain(d3.extent(data, function(d){
							return + d.birth;
            		        }));
						svg.select(".y.axis")
						    .transition()
						    .duration(2000)
						    .call(yAxis);

						circles
							.transition()
							.duration(2000)
							.attr("cy", function(d) {
								return yScale(+d.birth);
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
