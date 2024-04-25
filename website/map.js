// set dimensions
var width = 1200
var height = 700
var width_window = Math.min(1800, window.innerWidth)
var height_window = window.innerHeight
var width_adjusted = width_window  - 300

// variables to initialize info
var year = 1896
var season = 'Summer'
var city = "Athina"
var country = "Greece"
 
// initialize map
var country_code = d3.map()

// svg for the map
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width_adjusted)
  .attr("height", height);

// svg for the header
var info_games = d3.select("#logo_games")
        .append("svg")
        .attr("width", 750)
        .attr("height", 250)
        .attr("transform", "translate("+ (width_adjusted/2 - 750/2) + ","+ 10 +")");

// function to update header
function upload_info_games(year, city, country, edition, season, n_countries, n_athletes) {
  info_games.selectAll("text").remove();
  info_games.selectAll("image").remove();
  // adding game logo or special cases 
  if (year <= 1928 | year == 1940 | year == 1944 | year == 2020) {
    info_games.append("svg:image")
      .attr('x', 50)
      .attr('y', 10)
      .attr('width', 150)
      .attr('height', 150)
      .attr("xlink:href", "logos/" + year + "-" + season + ".jpg");
  } else {
    info_games.append("svg:image")
      .attr('x', 50)
      .attr('y', 10)
      .attr('width', 150)
      .attr('height', 150)
      .attr("xlink:href", "logos/" + year + "-" + season + ".png");
  }

  if (edition == 1 | edition == 21) {
      info_games.append("text")
                .attr("x", 250)
                .attr("y", 40)
                .text(edition + "st EDITION OF " +  season.toUpperCase() + " OLYMPIC GAMES")
                .attr("font-family", "Oswald")
                .attr("font-size", "30px")
                .attr("font-weight", 900);
  } else if (edition == 2 | edition == 22) {
      info_games.append("text")
                .attr("x", 250)
                .attr("y", 40)
                .text(edition + "nd EDITION OF " +  season.toUpperCase() + " OLYMPIC GAMES")
                .attr("font-family", "Oswald")
                .attr("font-size", "30px")
                .attr("font-weight", 900);
  } else if (edition == 3 | edition == 23) {
      info_games.append("text")
                .attr("x", 250)
                .attr("y", 40)
                .text(edition + "rd EDITION OF " +  season.toUpperCase() + " OLYMPIC GAMES")
                .attr("font-family", "Oswald")
                .attr("font-size", "30px")
                .attr("font-weight", 900);
  } else if (edition == "Cancelled"){
      if (year == 1916){
          var text_cancelled = 'CANCELLED EDITION: WORLD WAR I'
      } else if (year == 1940 | year == 1944) {
          var text_cancelled = 'CANCELLED EDITION: WORLD WAR II'
      } else {
          var text_cancelled = 'POSTPONED EDITION: COVID-19'
      }
      info_games.append("text")
                .attr("x", 250)
                .attr("y", 40)
                .text(text_cancelled)
                .attr("font-family", "Oswald")
                .attr("font-size", "30px")
                .attr("font-weight", 900);


  } else {
      info_games.append("text")
                .attr("x", 250)
                .attr("y", 40)
                .text(edition + "th EDITION OF " +  season.toUpperCase() + " OLYMPIC GAMES")
                .attr("font-family", "Oswald")
                .attr("font-size", "30px")
                .attr("font-weight", 900);
  }
  // adding the host country flag
  info_games.append("svg:image")
            .attr("xlink:href", "country-flags-master/svg/" + country + ".svg")
            .attr("x", 250)
            .attr("y", 55)
            .attr("width", "30")
            .attr("height", "30");
  // adding the host country info
  info_games.append("text")
            .attr("x", 290)
            .attr("y", 80)
            .text(city + ", " + country + " - " + year)
            .attr("font-family", "Oswald")
            .attr("font-size", "25px")
            .attr("font-weight", 900);
   // adding info about total number of countries in game
  info_games.append("text")
            .attr("x", 250)
            .attr("y", 120)
            .text("Total Number of Countries Participating: " + n_countries)
            .attr("font-family", "Oswald")
            .attr("font-size", "18px")
            .attr("fill", "gray")
            .attr("font-weight", 700);
  // adding info about total number of athletes in game
  info_games.append("text")
            .attr("x", 250)
            .attr("y", 150)
            .text("Total Number of Athletes Participating: " + n_athletes.toLocaleString())
            .attr("font-family", "Oswald")
            .attr("font-size", "18px")
            .attr("fill", "gray")
            .attr("font-weight", 700);
}

// initialize header
upload_info_games(year, "Athina", country, 1, season, 12, 176);

// Map and projection
var path = d3.geoPath();

var projection = d3.geoNaturalEarth()
    .scale(width_adjusted / 2 / Math.PI)
    .translate([width_adjusted / 2, height / 2])
var path = d3.geoPath()
    .projection(projection);

// Data and color scale
var data = d3.map();
var full_data = d3.map();

// color
var get_color = function(season){
    if (season == "Summer"){
        return d3.schemeBlues[8];
    } else {
        return d3.schemePuBu[8];
    }
}

var colorScheme = get_color(season)
    colorScheme.unshift("#eee")

var colorScale = d3.scaleThreshold()
    .domain([1, 11, 51, 101, 201, 301, 401, 501])
    .range(colorScheme);

// Load external data
d3.queue()
    .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .defer(d3.json, "data/host_cities_markers.json")
    .defer(d3.csv, "data/country-coord.csv")
    .defer(d3.csv, "data/regions_participants3.csv",
        function(d) { // load data from csv
            if ('$' + d.Year in full_data){
                var yearKey = '$' + d.Year;
                season = d.Season;

                if (season in full_data[yearKey]){
                } else {
                    full_data[yearKey][season] =  {'other': d.id};
                };

                full_data[yearKey][season][d.region] = {
                    participants: d.Name,
                    sports: d.Sport,
                }
            } else {
                full_data.set(d.Year, {});
                var yearKey = '$' + d.Year;
                season = d.Season;
                if (season in full_data[yearKey]){
                } else {
                    full_data[yearKey][season] =  {'other': d.id};
                };
                full_data[yearKey][season][d.region] = {
                    participants: d.Name,
                    sports: d.Sport,
                }
            };
            data = full_data['$' + year][season]
        })
    .await(ready);

// function to load the data
function load_data(){
    data = full_data['$' + year][season];
}
// A helper function for creating the circles, for each country participating in this 
// year's games returns its coordinates from the file country-coord.csv
function getCoordinates(countryData, countries) {
    const coordinates = {};
    // Check if countryData is defined and is an array
    if (!Array.isArray(countryData)) {
      console.error('Country data is not available or is not in the expected format.');
      return coordinates; // Return empty coordinates object
    }
    // Iterate over each entry in the countryData array
    countryData.forEach(entry => {
      const countryName = entry['Country'];
      // Check if the country exists in the countries dataset
      if (countries[countryName]) {
        coordinates[countryName] = {
          latitude: parseFloat(entry['Latitude (average)']),
          longitude: parseFloat(entry['Longitude (average)'])
        };
      } else {
        console.log(`No matching entry found for ${countryName}`);
      }
    });
    return coordinates;
  }
// update map, title and header to user choose.
function ready(error, topo, markers,coord) { 
    if (error) throw error;
 
    console.log(topo.features, "markers: ", markers, "coord: ", coord)
    svg.selectAll("path").remove();
    svg.selectAll("circle").remove()

    // Draw the map
    var delta_x = 10
    var pathBuilder = d3.geoPath(projection);
    var g_map = svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        .attr("d", function (eachFeature){
            return pathBuilder(eachFeature);
        })
        .attr("stroke-opacity", 0.1)
        .style("stroke", "gray")
        .style("fill-opacity", 0.3)
  
        console.log("my olymic data: ");
        console.log(data);

        var data_circles;
        data_circles = getCoordinates(coord,data);

        console.log("my circles data: ");
        console.log(data_circles);

        svg.append("g")
        .selectAll("circle")
        .data(Object.entries(data_circles))
        .enter()
        .append("circle")
        .attr('cx', function(d) { return projection([d[1].longitude, d[1].latitude])[0]; })
        .attr('cy', function(d) { return projection([d[1].longitude, d[1].latitude])[1]; })
        .attr('r', 5) // Adjust the radius for better visibility
        .style('fill', 'orange'); // Add fill color for better visibility
    
        console.log("SVG circles:");
        console.log(svg.selectAll("circle").nodes());
        
        console.log("SVG paths:");
        console.log(svg.selectAll("path").nodes());

    // remove the previous circle in host city
    svg.selectAll("image").remove()
    // get the data for host city
    var data_marker = [markers[year][season]]
    // update host city location
    svg.selectAll("myLocation")
      .data(data_marker)
      .enter()
      .append("svg:image")
        .attr("transform", "translate(" + delta_x + ",0)")
        .attr("x", function(d){ return projection([d.long, d.lat])[0]-7})
        .attr("y", function(d){ return projection([d.long, d.lat])[1]-29})
        .attr('width', 15)
        .attr('height', 30)
        .attr("xlink:href", "images/location_torch_crop.png")

    var edition = markers[year][season]['edition']
    var n_athletes = markers[year][season]['n_athletes']
    var n_countries = markers[year][season]['n_countries']

    // Change info about games (header)
    upload_info_games(year, city, country, edition, season, n_countries, n_athletes);
}
