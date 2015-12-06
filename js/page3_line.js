var regions = { "SAS": "South Asia" , "ECS": "Europe and Central Asia", "MEA": "Middle East & North Africa", "SSF": "Sub-Saharan Africa", "LCN": "Latin America & Caribbean", "EAS": "East Asia &amp; Pacific", "NAC": "North America" },
    w = 550,
    h = 400,
    margin = 30,
    startYear = 1960, 
    endYear = 2015,
    startu5mr = 0,
    endu5mr = 443.5,
    years = d3.range(startYear, endYear + 1),
    y = d3.scale.linear().domain([endu5mr, startu5mr]).range([0 + margin, h - margin]),
    x = d3.scale.linear().domain([1960, 2015]).range([0 + margin -5, w]);

var vis = d3.select("#vis")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g");
            
var line = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });


// Regions
var countries_regions = {};
d3.text('data/u5mr_region.csv', 'text/csv', function(text) {
    var regions = d3.csv.parseRows(text);
    for (i=1; i < regions.length; i++) {
        countries_regions[regions[i][0]] = regions[i][1];
    }
});

var startEnd = {},
    countryCodes = {};
d3.text('data/u5mr_cleaned.csv', 'text/csv', function(text) {
    var countries = d3.csv.parseRows(text);
    
    for (i=1; i < countries.length; i++) {
        var values = countries[i].slice(2, countries[i.length]);
        var currData = [];
        countryCodes[countries[i][1]] = countries[i][0];
        
        var started = false;
        for (j=0; j < values.length; j++) {
            if (values[j] != '') {
                currData.push({ x: years[j], y: values[j] });
            
                if (!started) {
                    startEnd[countries[i][1]] = { 'startYear':years[j], 'startVal':values[j] };
                    started = true;
                } else if (j == values.length-1) {
                    startEnd[countries[i][1]]['endYear'] = years[j];
                    startEnd[countries[i][1]]['endVal'] = values[j];
                }
                
            }
        }
        
        // Actual line
        vis.append("path")
            .data([currData])
            .attr("country", countries[i][1])
            .attr("class", countries_regions[countries[i][1]])
            .attr("d", line)
            .on("mouseover", onmouseover)
            .on("mouseout", onmouseout);
    }
});  
/////////////////////////////////AXIS   
vis.append("line")
    .attr("x1", x(startYear))
    .attr("y1", y(startu5mr))
    .attr("x2", x(endYear))
    .attr("y2", y(startu5mr))
    .attr("class", "axis")

vis.append("svg:line")
    .attr("x1", x(startYear))
    .attr("y1", y(startu5mr))
    .attr("x2", x(startYear))
    .attr("y2", y(endu5mr))
    .attr("class", "axis")

////////////////////////////////LABEL            
vis.selectAll(".xLabel")
    .data(x.ticks(5))
    .enter().append("text")
    .attr("class", "xLabel")
    .text(String)
    .attr("x", function(d) { return x(d) })
    .attr("y", h-10)
    .attr("text-anchor", "middle")

vis.selectAll(".yLabel")
    .data(y.ticks(4))
    .enter().append("text")
    .attr("class", "yLabel")
    .text(String)
    .attr("x", 0)
    .attr("y", function(d) { return y(d) })
    .attr("text-anchor", "right")
    .attr("dy", 3)

/////////////////////////////////TICKS   
            
vis.selectAll(".xTicks")
    .data(x.ticks(5))
    .enter().append("line")
    .attr("class", "xTicks")
    .attr("x1", function(d) { return x(d); })
    .attr("y1", y(startu5mr))
    .attr("x2", function(d) { return x(d); })
    .attr("y2", y(startu5mr)+7)
    
vis.selectAll(".yTicks")
    .data(y.ticks(4))
    .enter().append("line")
    .attr("class", "yTicks")
    .attr("y1", function(d) { return y(d); })
    .attr("x1", x(startYear-0.5))
    .attr("y2", function(d) { return y(d); })
    .attr("x2", x(startYear))

function onclick(d, i) {
    var currClass = d3.select(this).attr("class");
    if (d3.select(this).classed('selected')) {
        d3.select(this).attr("class", currClass.substring(0, currClass.length-9));
    } else {
        d3.select(this).classed('selected', true);
    }
}

function onmouseover(d, i) {
    var currClass = d3.select(this).attr("class");
    d3.select(this)
        .attr("class", currClass + " current");
    
    var countryCode = $(this).attr("country");
    var countryVals = startEnd[countryCode];
    var percentChange = 100 * (countryVals['endVal'] - countryVals['startVal']) / countryVals['startVal'];
    
    var blurb = '<h2>' + countryCodes[countryCode] + '</h2>';
    blurb += "<p>On average: a life expectancy of " + Math.round(countryVals['startVal']) + " years in " + countryVals['startYear'] + " and " + Math.round(countryVals['endVal']) + " years in " + countryVals['endYear'] + ", ";
    if (percentChange >= 0) {
        blurb += "an increase of " + Math.round(percentChange) + " percent."
    } else {
        blurb += "a decrease of " + -1 * Math.round(percentChange) + " percent."
    }
    blurb += "</p>";
    
    $("#default-blurb").hide();
    $("#blurb-content").html(blurb);
}
function onmouseout(d, i) {
    var currClass = d3.select(this).attr("class");
    var prevClass = currClass.substring(0, currClass.length-8);
    d3.select(this)
        .attr("class", prevClass);
    // $("#blurb").text("hi again");
    $("#default-blurb").show();
    $("#blurb-content").html('');
}

function showRegion(regionCode) {
    var countries = d3.selectAll("path."+regionCode);
    if (countries.classed('highlight')) {
        countries.attr("class", regionCode);
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