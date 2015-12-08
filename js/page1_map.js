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


function typeAndSet(d) {
    d.Year2015 = +d.Year2015;
    countryById.set(d.ISO, d);
    //console.log(countryById.set(d.ISO, d));
    return d;
}

function getColor(d) {
    var dataRow = countryById.get(d.id);
    if (dataRow) {
      //  console.log(dataRow.Year2015);
        return colorScale(dataRow.Year2015);
    } else {
        //console.log("no dataRow", d);
        return "#ccc";
    }
}

d3.select("button#Region").on("click",function(){

    function typeAndSet(d) {
        d.Region2015 = +d.Region2015;
        countryById.set(d.ISO, d);
        console.log(countryById.set(d.ISO, d));
        return d;
    }

    function getColor(d) {
        var dataRow = countryById.get(d.id);
        if (dataRow) {
            return colorScale(dataRow.Region2015);
        } else {
            //console.log("no dataRow", d);
            return "#ccc";
        }
    }

    redraw();
})

function redraw() {

    map.selectAll("path.countries")
        .transition()
        .attr("fill", function(d,i) {
            return getColor(d); 
        });
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
            return getColor(d);
                    });



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

  

}