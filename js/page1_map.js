var height_map = 375;

var map = d3.select('#page1_map').append('svg')
    .attr('width', width)
    .attr('height', height_map);

var projection = d3.geo.mercator()
    .center([20, -50])
    .scale(90) // mess with this if you want
    .translate([width / 2, 340]);

var path = d3.geo.path()
    .projection(projection);

var colorScale = d3.scale.linear().range(["#BBD9FA", "#267CDE"]).interpolate(d3.interpolateLab);

var countryById = d3.map();

var tooltip_map = d3.select("body")
                 .append("div")
                 .attr("class", "tooltip");


// we use queue because we have 2 data files to load.
queue()
    .defer(d3.json, "data/countries.json")
    .defer(d3.csv, "data/u5mr_2015.csv", typeAndSet) // process
    .await(loaded);


function typeAndSet(d) {
    d.Year2015 = +d.Year2015;
    countryById.set(d.ISO, d);
    d.Region2015 = +d.Region2015;
    //console.log(countryById.set(d.ISO, d));
    return d;
}


function getText(d) {

 var dataRow = countryById.get(d.id);
    if (dataRow) {
        console.log(dataRow);
        return dataRow.CountryName + ": " + dataRow.Year2015 + " ‰";
    } else {
        console.log("no dataRow", d);
        return d.properties.name + ": No data.";
    }
}


function getColor(d) {
    var dataRow = countryById.get(d.id);
    if (dataRow) {
        return colorScale(dataRow.Year2015);
    } else {
        return "#ccc";
    }
}


function getRegionColor(d) {
        var dataRow = countryById.get(d.id);
        if (dataRow) {
            return colorScale(dataRow.Region2015);
        } else {
            return "#ccc";
        }
}

function getWorldColor(d) {
    return "rgb(158, 193, 243)";

}

function map_redraw(buttonCase) {

    var colorFunction;

    if (buttonCase === "World") {
        colorFunction = getWorldColor;
    }
    if (buttonCase === "Region") {
        colorFunction = getRegionColor;
    }
    if (buttonCase === "Country") {
        colorFunction = getColor;
    }

    map.selectAll("path.countries")
        .transition()
        .attr("fill", function(d,i) {
            return colorFunction(d); 
        });
}


function loaded(error, countries, mortality) {

    colorScale.domain(d3.extent(mortality, function(d) {return d.Year2015;}));

    var countries = topojson.feature(countries, countries.objects.units).features;

    map.selectAll('.path.countries')
        .data(countries)
        .enter()
        .append('path')
        .attr('class', 'countries')
        .attr('d', path)
        .attr('fill', function(d,i) {
            return getWorldColor(d);
                    });

    var linear = colorScale;

    map.append("g")
      .attr("class", "legendLinear")
      .attr("transform", "translate(400,10)");

    var legendLinear = d3.legend.color()
      .shapeWidth(25)
      .orient('horizontal')
      .scale(linear);

    map.select(".legendLinear")
      .call(legendLinear);

    function mouseoverFuncMap(d) {
        //d3.selectAll("path.countries").classed("unfocused", true);
        //d3.select(this).select("path.countries").classed("unfocused", false).classed("focused", true);
        tooltip_map
            .data(countries)
            .style("display", null) 
            .html("<p>" + getText(d) + "</p>");
    };

    function mouseoutFuncMap() {
           // d3.selectAll("path.countries").classed("unfocused", false).classed("focused", false);

            tooltip_map.style("display", "none");  
    };

    function mousemoveFuncMap(d) {
        tooltip_map
            .style("top", (d3.event.pageY - 10) + "px" )
            .style("left", (d3.event.pageX + 10) + "px");
    };

                    d3.selectAll("#page1_map path")
                      .style('cursor','pointer')
                      .on("mouseover", mouseoverFuncMap)
                      .on("mouseout", mouseoutFuncMap)
                      .on("mousemove", mousemoveFuncMap); 

  

}




