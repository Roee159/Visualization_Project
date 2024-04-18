// set the dimensions and margins of the graph
var margin = {top: 50, right: 30, bottom: 20, left: 30},
    width_timeline= 200 - margin.left - margin.right,
    height_timeline= 1600 - margin.top - margin.bottom;

// set length of lines in timeline
var dx = 50;

// function to change color of timeline according to continent
var cValue = function(d) { return d.Continent;},
      color = function(d){
      if(d.Continent == 'Europe'){
        return "rgba(0,129,200,1)";
      } else if (d.Continent == 'Asia') {
        return "rgba(252,177,49,1)";
      } else if (d.Continent == 'Oceania') {
        return "rgba(0,166,81,1)";
      } else if (d.Continent == 'America') {
        return "rgba(238,51,78,1)";
      } else {
        return "rgba(0,0,0,1)";
      }};

// function to change color of label according to continent
var color_labels = function(d){
      if(d == 'Europe'){
        return "rgba(0,129,200,1)";
      } else if (d == 'Asia') {
        return "rgba(252,177,49,1)";
      } else if (d == 'Oceania') {
        return "rgba(0,166,81,1)";
      } else if (d == 'America') {
        return "rgba(238,51,78,1)";
      } else {
        return "rgba(0,0,0,1)";
      }};


// function to set the lines of the timeline
var xLevel = function(d) {
    if(d.Season == "Summer"){
      return width_timeline/2 - dx;
    } else {
      return width_timeline/2 + dx;
    }
}

// Select Game to display
var clickYear = function(d){
      year = d.Year
      season = d.Season
      country = d.Country
      city = d.City

      load_data();
      //update_medals(year);
      update_sports(year, season);
      update_title(year, city, country);
      d3.queue()
          .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
          .defer(d3.json, "data/host_cities_markers.json")
          .await(ready);
}

// legend svg
var svg4 = d3.select("#my_dataviz_legend_timeline")
  .append("svg")
    .attr("width", 70)
    .attr("height", window.innerHeight + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + 30 + "," + 1.5*margin.top + ")");

// summer and winter titles svg
var svg5 = d3.select("#my_dataviz_timeline_seasons")
  .append("svg")
    .attr("width", width_timeline + margin.left + margin.right + 50)
    .attr("height", 70)
  .append("g")
    .attr("transform",
          "translate(" + 10 + "," + 1.5*margin.top + ")");

// append the svg object to the body of the page
var svg2 = d3.select("#my_dataviz_timeline")
  .append("svg")
    .attr("width", width_timeline+ margin.left + margin.right)
    .attr("height", height_timeline+ margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + 10 + "," + 1.5*margin.top + ")");

// add titles of winter and summer to timeline
var g_timeline = svg5.append("g")
              .attr("class", "legendColor")
              .attr("transform", "translate(-10,-20)");

              g_timeline.append("text")
              .attr("class", "caption")
              .attr("x", 35 + width_timeline/2 - dx)
              .attr("y", 0)
              .text("Summer")
              .attr("font-family", "Oswald");

              g_timeline.append("text")
              .attr("class", "caption")
              .attr("x", 35 + width_timeline/2 + dx)
              .attr("y", 0)
              .text("Winter")
              .attr("font-family", "Oswald");


// Initialize the X axis
var x = d3.scaleLinear()
  .range([0, width_timeline]);

var xAxis = svg2.append("g");


// Initialize the Y axis
var y = d3.scaleBand()
  .range([0, height_timeline])
  .padding(1);

var yAxis = svg2.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(" + (width_timeline/2 ) + "," + 0 + ")");


// Tooltip timeline
var tip_timeline = d3.tip()
          .attr('class', 'd3-tip')
          .offset(function(d){
              return [0, 0]
          })
          .html(function(d) {
                  return d["City"] + ", " + d["Country"] + "<br/> Year "+ d.Year;
          });

svg2.call(tip_timeline);


var domain_function = function range(size, step, startAt = 1896) {
return [...Array(size).keys()].map(i => i*step + startAt);
}

//rotate(-45)

var y2 = d3.scaleBand()
  .range([0, height_timeline])
  .domain(domain_function(32, 4))
  .padding(0);


// A function that create / update the plot for a given variable:
function update(selectedVar) {

  // Parse the Data
  d3.csv("data/location_host_cities.csv", function(data) {

    // Y axis
    y.domain(domain_function(63, 2))


    yAxis.call(d3.axisLeft(y2))
      .selectAll("text")
      .attr("transform", "translate(20,-6)")
      .attr("font-family", "Oswald")
      .attr("font-size", "12px")

    // Add X axis
    x.domain([-dx, d3.max(data, function(d) {
      return xLevel(d);
     }) ]);
    //yAxis.call(d3.axisLeft(y)); comment to hide yaxis

    // variable u: map data to existing circle
    var j = svg2.selectAll(".myLine")
      .data(data)
    // update lines
    j
      .enter()
      .append("line")
      .attr("class", "myLine")
      .merge(j)
        .attr("x1", width_timeline/2 )
        .attr("x2", function(d) { if (d.Season == "Summer"){ return xLevel(d) + 10;} else {return  xLevel(d) - 10;} })
        .attr("y1", function(d) { return y(d.Year); })
        .attr("y2", function(d) { return y(d.Year); })
        .attr("stroke", function(d) { return color(d);})
        .attr("stroke-width", 2)

    var u = svg2.selectAll("circle")
      .data(data)

    u.enter()
      .append("svg:image")
        .attr('x', function(d)  { if (d.Season == "Summer"){ return xLevel(d) - 30;} else {return  xLevel(d);} })
        .attr('y', function(d) { return y(d.Year) - 15; })
        .attr('width', 30)
        .attr('height', 30)
        .attr("xlink:href", function(d){return "logos/" + d.Continent + "_rings.png";})
        .on("mouseover", tip_timeline.show)
        .on("mouseleave", tip_timeline.hide)
        .on("click", function(d){return clickYear(d);});


    var size = 20
    var allgroups = ["Asia", "Europe", "America", "Oceania"]
      svg4.selectAll("myrect")
        .data(allgroups)
        .enter()
        .append("svg:image")
          .attr("y", function(d,i){ return 105 + i*window.innerHeight/6})
          .attr("x", -22) // 100 is where the first dot appears. 25 is the distance between dots
          .attr('width', 30)
          .attr('height', 30)
          .attr("xlink:href", function(d){return "logos/" + d + "_rings.png";})

      // Add labels beside legend dots
      svg4.selectAll("mylabels")
        .data(allgroups)
        .enter()
        .append("text")
          .attr("font-family", "Oswald")
          .attr("class", "continentLegend")
          .attr("y", function(d,i){ return 140 + i*window.innerHeight/6})
          .attr("x", -7) // 100 is where the first dot appears. 25 is the distance between dots
          .style("fill", function(d) {return color_labels(d);})
          .text(function(d){ return d})
          .attr("text-anchor", "middle")
          .style("alignment-baseline", "middle")


  })

}

// Initialize plot
update('var1')
