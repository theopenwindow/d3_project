
            var fullheight = 250;
            var fullwidth = 600;

            var margin = {top: 30, right:100, bottom: 30, left: 100};
            var width = fullwidth - margin.left - margin.right,
            height = fullheight - margin.top - margin.bottom;

            // Set up the range here - my output sizes
            var widthScale = d3.scale.linear()
                                .range([0, width]);
            var heightScale = d3.scale.ordinal()
                                .rangeRoundBands([margin.top, height], 0.2);
            var xAxis = d3.svg.axis()
                              .scale(widthScale)
                              .orient("bottom");
            var yAxis = d3.svg.axis()
                              .scale(heightScale)
                              .orient("left")
                              .tickSize(3);


            var bar = d3.select("#bar")
                        .append("svg:svg")
                        .attr("width", fullwidth)
                        .attr("height", fullheight);

            var colorScale = d3.scale.linear().range(["#BBD9FA", "#267CDE"]).interpolate(d3.interpolateLab);


            d3.csv("data/region.csv", function(error, data) {

            colorScale.domain(d3.extent(data, function(d) {return d.year2015;}));


                if (error) {
                    console.log("error reading file");
                }

                data.sort(function(a, b) {
                    return d3.descending(+a.year2015, +b.year2015);
                });

                // set up the domain here, from the data i read in.
                widthScale.domain([0, d3.max(data, function(d) {
                    return +d.year2015;
                })]);

                heightScale.domain(data.map(function(d){
                    return d.region;
                }));

                var rects = bar.selectAll("rect")
                        .data(data)
                        .enter()
                        .append("rect");

                rects.attr("x", margin.left+50)
                    .attr("y", function(d) {
                        return heightScale(d.region);   // just spacing the bars - notice from the top
                    })
                    .attr("width", function(d) {
                        return widthScale(d.year2015);
                    })
                    .attr("height", heightScale.rangeBand())
                    .attr("fill", function(d) {
                        return colorScale(d.year2015); 
                                        })
                    .style('cursor','pointer');

/*                svg.append("g")
                   .attr("class", "x axis")
                   .attr("transform", "translate(" + margin.left * 1.5+ "," + height + ")")
                   .call(xAxis)*/


                bar.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(" + margin.left * 1.5 + ",0)")
                    .call(yAxis);



                
                   var label = bar.selectAll("text.labels")
                                       .data(data)
                                       .enter()
                                       .append("text")
                                       .attr("class", "labels");
                    label.attr("x", function(d){
                        return (widthScale(d.year2015) + margin.left * 1.5 + 10);
                    })
                         .attr("y", function(d){
                            return (heightScale(d.region) + (margin.top)/3 + 5);
                         })
                         .text(function(d){
                            return d.year2015;
                         })
                         .attr("font-family", "sans-serif")
                         .attr("font-size", "10px")
                         .attr("fill","black");



            });


