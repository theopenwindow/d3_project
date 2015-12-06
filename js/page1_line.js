			var width = 600;
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
			var svgLine = d3.select("#page1_line")
						.append("svg")
						.attr("width", width)
						.attr("height", height)
						.attr("id", "svg_page1_line");


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

				//console.log(dataset);


				xScale.domain(
					d3.extent(years, function(d) {
						return dateFormat.parse(d);
					}));

				var world = dataset.filter(function (f){return f.country == "World"})[0];
				console.log(world);

				yScale.domain([
					d3.max(world.mortality, function(d) {
							return +d.amount;
						}),
					0
				]);


				var groupsLine = svgLine.selectAll("g")
									.datum(world)
									.append("g")
									.attr("id", function(d){
											return d.country;
										})
									.attr("class", "lines");


				groupsLine.selectAll("path")
						.data(function(d) { 
							//console.log(d.mortality);
							return [d.mortality]; 
						})
						.enter()
						.append("path")
						.attr("class", "line")
						.attr("d", line)
						.style('cursor','pointer');

				//Axes
				svgLine.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + (height - margin.bottom) + ")")
					.call(xAxis);

				svgLine.append("g")
					.attr("class", "y axis")
					.attr("transform", "translate(" + margin.left + ",0)")
					.call(yAxis);





			});