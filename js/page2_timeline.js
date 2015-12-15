
			var marginPage2 = {
			    top: 50,
			    right: 100,
			    bottom: 70,
			    left: 100
			    };

			    var widthPage2 = 900;
			    var heightPage2 = 600;


			    //Set up date formatting and years
			    var dateFormat = d3.time.format("%Y");

			    //Set up scales
			    var xScalePage2 = d3.time.scale()
			    .range([marginPage2.left, widthPage2 - marginPage2.right - marginPage2.left]);

			    var yScalePage2 = d3.scale.linear()
			    .range([marginPage2.top, heightPage2 - marginPage2.bottom]);

			    //Configure axis generators
			    var xAxisPage2 = d3.svg.axis()
			    .scale(xScalePage2)
			    .orient("bottom")
			    .ticks(15)
			    .tickFormat(function (d) {
			        return dateFormat(d);
			    })
			    .innerTickSize(5);

			    var yAxisPage2 = d3.svg.axis()
			    .scale(yScalePage2)
			    .orient("left")
			    .innerTickSize(5);

			    //Configure line generator
			    // each line dataset must have a d.year and a d.rate for this to work.
			    var linePage2 = d3.svg.line()
			    .x(function (d) {
			        return xScalePage2(dateFormat.parse(d.year));
			    })
			    .y(function (d) {
			        return yScalePage2(+d.rate);
			    });


			    //Create the empty SVG image
			    var svgPage2 = d3.select("#page2_timeline")
			    .append("svg")
			    .attr("width", widthPage2)
			    .attr("height", heightPage2);


			function draw_linesPage2(data) {

			    var years = d3.keys(data[0]).slice(1, 55); //
			    console.log(years);

			    //Create a new, empty array to hold our restructured dataset
			    var dataset = [];

			    //Loop once for each row in data
			    data.forEach(function (d, i) {

			        var IMRs = [];

			        years.forEach(function (y) { //Loop through all the years - and get the rates for this data element

			            if (d[y]) { /// What we are checking is if the "y" value - the year string from our array, which would translate to a column in our csv file - is empty or not.

			                IMRs.push({ //Add a new object to the new rates data array - for year, rate. These are OBJECTS that we are pushing onto the array
			                    year: y,
			                    rate: d[y], // this is the value for, for example, d["2004"]
			                    Country: d.Country
			                });
			            }

			        });
			        dataset.push({ // At this point we are accessing one index of data from our original csv "data", above and we have created an array of year and rate data from this index. We then create a new object with the Country value from this index and the array that we have made from this index.
			            country: d.Country,
			            rates: IMRs // we just built this from the current index.
			        });

			    });

			    //Uncomment to log the original data to the console
			    //console.log(data);

			    //Uncomment to log the newly restructured dataset to the console
			    console.log(dataset);


			    //Set scale domains - max and min of the years
			    xScalePage2.domain(
			        d3.extent(years, function (d) {
			            return dateFormat.parse(d);
			        }));

			    // max of rates to 0 (reversed, remember)
			    yScalePage2.domain([
			        d3.max(dataset, function (d) {
			            return d3.max(d.rates, function (d) {
			                return +d.rate;
			            });
			        }),
			        0
			    ]);


			    //Make a group for each country
			    var groupsPage2 = svgPage2.selectAll("g.lines")
			        .data(dataset)
			        .enter()
			        .append("g")
			        .attr("class", "lines")
			        .attr("id", function (d) {
			            return d.country.replace(/\s/g, '_');
			        });

			    //Within each group, create a new line/path,
			    //binding just the rates data to each one
			    groupsPage2.selectAll("path")
			        .data(function (d) { // because there's a group with data already...
			            return [d.rates]; // it has to be an array for the line function
			        })
			        .enter()
			        .append("path")
			        .attr("class", "line")
			        .attr("d", linePage2)
			        .classed("normal", true)
			        .classed("focused", false); // gives gray color


			    /*======================================================================
			      Adding the Axes
			    ======================================================================*/
			    svgPage2.append("g")
			        .attr("class", "x axis")
			        .attr("transform", "translate(0," + (heightPage2 - marginPage2.bottom) + ")")
			        .call(xAxisPage2)
			        .append("text")
			        .attr("x", widthPage2 - marginPage2.left - marginPage2.right)
			        // .attr("y", marginPage2.bottom / 3)
			        .attr("y", "25")
			        .attr("dy", "1em")
			        .style("text-anchor", "end")
			        .attr("class", "label")
			        .text("Year");

			    svgPage2.append("g")
			        .attr("class", "y axis")
			        .attr("transform", "translate(" + marginPage2.left + ",0)")
			        .call(yAxisPage2)
			        .append("text")
			        .attr("transform", "rotate(-90)")
			        // .attr("x", -marginPage2.top)
			        // .attr("y", -2*marginPage2.left / 3)
			        .attr("x", "-180")
			        .attr("y", "-60")
			        .attr("dy", "1em")
			        .style("text-anchor", "end")
			        .attr("class", "label")
			        .text("Under 5 Mortality Rate");

			};

			d3.selection.prototype.moveToFront = function() {
				  return this.each(function(){
				    this.parentNode.appendChild(this);
				  });
				};

			//focus on country
			function focus_country(country) {
				  console.log("in focus", country);
				  // unfocus all, then focus one if given a name.
				    d3.selectAll("path.line").classed("focused", false);
				    if (country) {
				        var country = country.replace(/\s/g, '_');
				        var line = d3.select("g.lines#" + country + " path.line");
				        line.classed("focused", true);
				        line.moveToFront();
				    }
				};


			  d3.select("button#Haiti").on("click", function() {
				//   console.log("Haiti");
				   focus_country("Haiti");
				   d3.selectAll("button").classed("selected", false);
				   d3.select("button#Haiti").classed("selected", true);
				//   //update(case 1);
				//   //d3.select("section#step1").style("display", "inline-block");
				 });
			  d3.select("button#Myanmar").on("click", function(){
			  	focus_country("Myanmar");
			  	d3.selectAll("button").classed("selected", false);
				d3.select("button#Myanmar").classed("selected", true);
			  });
			  d3.select("button#Tajikistan").on("click", function(){
			  	focus_country("Tajikistan");
			  	d3.selectAll("button").classed("selected", false);
				d3.select("button#Tajikistan").classed("selected", true);
			  })
			  d3.select("button#Korea").on("click", function(){
			  	focus_country("Korea");
			  	d3.selectAll("button").classed("selected", false);
				d3.select("button#Korea").classed("selected", true);
			  })
			  d3.select("button#Indonesia").on("click", function(){
			  	focus_country("Indonesia");
			  	d3.selectAll("button").classed("selected", false);
				d3.select("button#Indonesia").classed("selected", true);
			  })
			  d3.select("button#Armenia").on("click", function(){
			  	focus_country("Armenia");
			  	d3.selectAll("button").classed("selected", false);
				d3.select("button#Armenia").classed("selected", true);
			  })
			  d3.select("button#Nicaragua").on("click", function(){
			  	focus_country("Nicaragua");
			  	d3.selectAll("button").classed("selected", false);
				d3.select("button#Nicaragua").classed("selected", true);
			  })
			  d3.select("button#Honduras").on("click", function(){
			  	focus_country("Honduras");
			  	d3.selectAll("button").classed("selected", false);
				d3.select("button#Honduras").classed("selected", true);
			  })
			  d3.select("button#Samoa").on("click", function(){
			  	focus_country("Samoa");
			  	d3.selectAll("button").classed("selected", false);
				d3.select("button#Samoa").classed("selected", true);
			  })
			  d3.select("button#Venezuela").on("click", function(){
			  	focus_country("Venezuela");
			  	d3.selectAll("button").classed("selected", false);
				d3.select("button#Venezuela").classed("selected", true);
			  })

			
			//display data
			var data = []; // make this global

			function display(error, mydata) {
			  if (error) {
			    console.log(error);
			  } else {
			    console.log(data);
			    data = mydata; // assign to global

			    draw_linesPage2(data);
			  }
			}


			//queue the data

			queue()
				  .defer(d3.csv, "data/timeline.csv")
				  .await(display);

			//jquery for button

$(document).ready(function(){
$(".toggle_container").hide(); 
$("button.reveal").click(function(){
    $(this).toggleClass("active").next().slideToggle("fast");
    return false; 
});
 $("a[href='" + window.location.hash + "']").parent(".reveal").click();
});
