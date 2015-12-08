//draw Line Chart:
			var width = 500;
			var height = 500;
			var margin = {top: 20, right: 20, bottom: 20, left:20};

			var myWidth = width - margin.right - margin.left;
			var myHeight = height - margin.top - margin.bottom;


			var page1dateFormat = d3.time.format("%Y");
			var page1xScale = d3.time.scale()
								.range([ margin.left, width - margin.right]);

			var page1yScale = d3.scale.linear()
								.range([ margin.top, height - margin.bottom ]);

			var page1xAxis = d3.svg.axis()
							.scale(page1xScale)
							.tickSize(-myHeight)
							.orient("bottom")
							.ticks(8)
							.tickFormat(function(d) {
								return page1dateFormat(d);
							})
							.outerTickSize([0]);

			var page1yAxis = d3.svg.axis()
							.scale(page1yScale)
							.tickSize(myWidth)
							.orient("right")
							.outerTickSize([0])
							.ticks(5);

			var myLine = d3.svg.line()
				.x(function(d) {
					return page1xScale(page1dateFormat.parse(d.year));
				})
				.y(function(d) {
					return page1yScale(+d.amount);
				});


			//Create the empty SVG image
			var svgLine = d3.select("#page1_line")
						.append("svg")
						.attr("width", width)
						.attr("height", height)
						.attr("id", "svg_page1_line");

			svgLine.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + (height - margin.bottom) + ")")
					.call(page1xAxis);

			svgLine.append("g")
					.attr("class", "y axis")
					.attr("transform", "translate(" + margin.left + ",0)")
					.call(page1yAxis);


			var page1years = ["1960", "1961", "1962", "1963", "1964", "1965", "1966", "1967", "1968", "1969", "1970", "1971", "1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"];


			function draw_line(data){
//restructure new dataset:
				var dataset = [];
				data.forEach(function (d, i) {
					var themortality = [];
					page1years.forEach(function (y) {
						if (d[y]) {
							themortality.push({
								country: d.CountryName,
								year: y,
								amount: d[y]  
 							});
						}
					});
					dataset.push({
						country: d.CountryName,
						mortality: themortality  
						} );
				});

				console.log(dataset);
//scale domains:
				page1xScale.domain(
					d3.extent(page1years, function(d) {
						return page1dateFormat.parse(d);
					}));

				page1yScale.domain([
					d3.max(dataset, function(d) {
						return d3.max(d.mortality, function(d) {
							return +d.amount;
						});
					}),
					0
				]);
//draw lines:
				var groups = svgLine.selectAll("g")
					.data(dataset)
					.enter()
					.append("g")
					.attr("class", "lines");

				var paths = groups.selectAll("path")
									.data(function(d) {
										console.log(d.mortality);
										return [ d.mortality ]; 
									});
//update data to lines:
				paths.enter()
				     .append("path")
				     .transition()
				     .duration(2000)
				     .attr("d",myLine);

				paths.exit()
					  .transition()
					  .duration(2000)
					  .style("opacity", 0)
					  .remove();

			    svgLine.select(".y.axis")
					   .transition()
					   .duration(2000)
					   .call(page1yAxis);

				svgLine.select(".x.axis")
					   .transition()
					   .duration(2000)
					   .call(page1xAxis);
			};

//load data:			
 			var dataCountry = [];
			var dataRegion = [];
			var dataWorld = [];

			function load(error, dataset1, dataset2, dataset3){
				if(error){
					console.log(error);
				}else{
					console.log(dataCountry);
					console.log(dataRegion);
					console.log(dataWorld);
					dataCountry = dataset1;
					dataRegion = dataset2;
					dataWorld = dataset3;

				}
			};

queue()
  .defer(d3.csv, "data/total.csv")
  .defer(d3.csv, "data/region_2.csv")
  .defer(d3.csv, "data/world.csv")
  .await(load);
 

			d3.select("button#Country").on("click", function(){
				draw_line(dataCountry);
			});

			d3.select("button#Region").on("click", function(){
				draw_line(dataRegion);
			});

			d3.select("button#World").on("click", function(){
				draw_line(dataWorld);
			})

			

