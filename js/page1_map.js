var width = 600,
    height = 550;

var map = d3.select('#page1_map').append('svg')
    .attr('width', width)
    .attr('height', height);

var projection = d3.geo.mercator()
    .center([15, -50])

    .scale(90) // mess with this if you want
    .translate([width / 2, 450]);

var path = d3.geo.path()
    .projection(projection);

var colorScale = d3.scale.linear().range(["#BBD9FA", "#267CDE"]).interpolate(d3.interpolateLab);

var countryById = d3.map();

// we use queue because we have 2 data files to load.
queue()
    .defer(d3.json, "data/countries.json")
    .defer(d3.csv, "data/u5mr_2015.csv", typeAndSet) // process
    .await(loaded);

var typeAndSet = [];

d3.select("#Region").on("click", function(typeAndSet){
    typeAndSet.forEach(function(d){
            d.Region2015 = +d.Region2015;
            countryById.set(d.ISO, d);
            return d;
    })
    return typeAndSet;
})

function getColor(d) {
    var dataRow = countryById.get(d.id);
    if (dataRow) {
      //  console.log(dataRow.Year2015);
        return colorScale(dataRow.Region2015);
    } else {
        //console.log("no dataRow", d);
        return "#ccc";
    }
}








function getText(d) {
 var dataRow = countryById.get(d.id);
    if (dataRow) {
        //console.log(dataRow);
        return dataRow.Country + ": " + dataRow.Year2015 + " ‰";
    } else {
        //console.log("no dataRow", d);
        return d.properties.name + ": No data.";
    }
}
function loaded(error, countries, mortality) {

    //console.log(countries);
    //console.log(mortality);

    colorScale.domain(d3.extent(mortality, function(d) {return d.Year2015;}));

    var countries = topojson.feature(countries, countries.objects.units).features;

    map.selectAll('.path.countries')
        .data(countries)
        .enter()
        .append('path')
        .attr('class', 'countries')
        .attr('d', path)
        .attr('fill', function(d,i) {
            //console.log(d);
            //console.log(d.properties.name);
            return getColor(d);

                    });

       /* .append("title")
        .text(function(d) {
            return getText(d);
        });*/


    var linear = colorScale;

    map.append("g")
      .attr("class", "legendLinear")
      .attr("transform", "translate(20,20)");

    var legendLinear = d3.legend.color()
      .shapeWidth(30)
      .orient('horizontal')
      .scale(linear);

    map.select(".legendLinear")
      .call(legendLinear);

    d3.selectAll(".path")
      .style('cursor','pointer')
      .on("mouseover", mouseoverFunc)
      .on("mouseout", mouseoutFunc)
      .on("mousemove", mousemoveFunc); 
  

            var tooltip = d3.select("body")
                            .append("div")
                            .attr("class", "tooltip");



    function mouseoverFunc(d) {
        //d3.selectAll("path.countries").classed("unfocused", true);
        //d3.select(this).select("path.countries").classed("unfocused", false).classed("focused", true);

        tooltip
            .data(countries)
            .style("display", null) 
            .html("<p>" + getText(d) + "</p>");
    }

    function mouseoutFunc() {
           // d3.selectAll("path.countries").classed("unfocused", false).classed("focused", false);

            tooltip.style("display", "none");  
    }

    function mousemoveFunc(d) {
        tooltip
            .style("top", (d3.event.pageY - 10) + "px" )
            .style("left", (d3.event.pageX + 10) + "px");
    }
}