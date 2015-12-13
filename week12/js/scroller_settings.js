// Settings object

// For use with scroller_template.html and mfreeman_scroller.js.


// function to move a selection to the front/top, from
// https://gist.github.com/trtg/3922684
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

var settings = {
  // could be used to save settings for styling things.
}

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
}

// ******* Change the showX and showY function for some cases ********
var update = function(value) {
  var country = null;
  switch(value) {
    case 0:
      console.log("in case", value);
      country = null;
      
    case 1:
      console.log("in case 1");
      country = "Haiti";
      break;
    case 2:
      console.log("in case 2");
      country = "Myanmar";
      break;
    case 3:
      console.log("in case 3");
      country = "Tajikistan";
      break;
    case 4:
      console.log("in case 4");
      country = "Korea Dem Rep";
      break;
    case 5:
      console.log("in case 5");
      country = "Indonesia";
      break; 
    case 6:
      console.log("in case 6");
      country = "Armenia";
      break;    
    case 7:
      console.log("in case 7");
      country = "Nicaragua";
      break; 
    case 8:
      console.log("in case 8");
      country = "Honduras";
      break; 
    case 9:
      console.log("in case 9");
      country = "Samoa";
      break; 
    case 10:
      console.log("in case 10");
      country = "Venezuela,RB";
      break;        
        
    default:
      focus_country(country);
      break;
  }
  focus_country(country); // this applies a highlight on a country.
}
// setup scroll functionality

 d3.select("button#Haiti").on("click", function() {
  console.log("Haiti");
  focus_country("Haiti");
  //update(case 1);
  d3.select("section#step1").style("display", "inline-block");
})

var data = []; // make this global

function display(error, mydata) {
  if (error) {
    console.log(error);
  } else {
    console.log(data);
    data = mydata; // assign to global

    draw_lines(data);

    var scroll = scroller()
      .container(d3.select('#graphic'));

    // pass in .step selection as the steps
    scroll(d3.selectAll('.step'));

    // Pass the update function to the scroll object
    scroll.update(update)
  }
}

queue()
  //.defer(d3.csv, "data/median-U5MRbyCountry.csv")
  .defer(d3.csv, "data/timeline.csv")
  .await(display);

