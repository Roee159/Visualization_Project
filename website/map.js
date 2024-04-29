// set dimensions
var width = 1200;
var height = 700;
var width_window = Math.min(1800, window.innerWidth);
var height_window = window.innerHeight;
var width_adjusted = width_window - 300;

// variables to initialize info
var year = 1896;
var season = "Summer";
var city = "Athina";
var country = "Greece";

// initialize map
var country_code = d3.map();

// svg for the map
var svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width_adjusted)
  .attr("height", height);

// svg for the header
var info_games = d3
  .select("#logo_games")
  .append("svg")
  .attr("width", 750)
  .attr("height", 250)
  .attr(
    "transform",
    "translate(" + (width_adjusted / 2 - 750 / 2) + "," + 10 + ")"
  );

// function to update header
function upload_info_games(year,city,country,edition,season,n_countries,n_athletes) {
  info_games.selectAll("text").remove();
  info_games.selectAll("image").remove();
  // adding game logo or special cases
  if ((year <= 1928) | (year == 1940) | (year == 1944) | (year == 2020)) {
    info_games
      .append("svg:image")
      .attr("x", 50)
      .attr("y", 10)
      .attr("width", 150)
      .attr("height", 150)
      .attr("xlink:href", "logos/" + year + "-" + season + ".jpg");
  } else {
    info_games
      .append("svg:image")
      .attr("x", 50)
      .attr("y", 10)
      .attr("width", 150)
      .attr("height", 150)
      .attr("xlink:href", "logos/" + year + "-" + season + ".png");
  }

  if ((edition == 1) | (edition == 21)) {
    info_games
      .append("text")
      .attr("x", 250)
      .attr("y", 40)
      .text(
        edition + "st EDITION OF " + season.toUpperCase() + " OLYMPIC GAMES"
      )
      .attr("font-family", "Oswald")
      .attr("font-size", "30px")
      .attr("font-weight", 900);
  } else if ((edition == 2) | (edition == 22)) {
    info_games
      .append("text")
      .attr("x", 250)
      .attr("y", 40)
      .text(
        edition + "nd EDITION OF " + season.toUpperCase() + " OLYMPIC GAMES"
      )
      .attr("font-family", "Oswald")
      .attr("font-size", "30px")
      .attr("font-weight", 900);
  } else if ((edition == 3) | (edition == 23)) {
    info_games
      .append("text")
      .attr("x", 250)
      .attr("y", 40)
      .text(
        edition + "rd EDITION OF " + season.toUpperCase() + " OLYMPIC GAMES"
      )
      .attr("font-family", "Oswald")
      .attr("font-size", "30px")
      .attr("font-weight", 900);
  } else if (edition == "Cancelled") {
    if (year == 1916) {
      var text_cancelled = "CANCELLED EDITION: WORLD WAR I";
    } else if ((year == 1940) | (year == 1944)) {
      var text_cancelled = "CANCELLED EDITION: WORLD WAR II";
    } else {
      var text_cancelled = "POSTPONED EDITION: COVID-19";
    }
    info_games
      .append("text")
      .attr("x", 250)
      .attr("y", 40)
      .text(text_cancelled)
      .attr("font-family", "Oswald")
      .attr("font-size", "30px")
      .attr("font-weight", 900);
  } else {
    info_games
      .append("text")
      .attr("x", 250)
      .attr("y", 40)
      .text(
        edition + "th EDITION OF " + season.toUpperCase() + " OLYMPIC GAMES"
      )
      .attr("font-family", "Oswald")
      .attr("font-size", "30px")
      .attr("font-weight", 900);
  }
  // adding the host country flag
  info_games
    .append("svg:image")
    .attr("xlink:href", "country-flags-master/svg/" + country + ".svg")
    .attr("x", 250)
    .attr("y", 55)
    .attr("width", "30")
    .attr("height", "30");
  // adding the host country info
  info_games
    .append("text")
    .attr("x", 290)
    .attr("y", 80)
    .text(city + ", " + country + " - " + year)
    .attr("font-family", "Oswald")
    .attr("font-size", "25px")
    .attr("font-weight", 900);
  // adding info about total number of countries in game
  info_games
    .append("text")
    .attr("x", 250)
    .attr("y", 120)
    .text("Total Number of Countries Participating: " + n_countries)
    .attr("font-family", "Oswald")
    .attr("font-size", "18px")
    .attr("fill", "gray")
    .attr("font-weight", 700);
  // adding info about total number of athletes in game
  info_games
    .append("text")
    .attr("x", 250)
    .attr("y", 150)
    .text( "Total Number of Athletes Participating: " + n_athletes.toLocaleString())
    .attr("font-family", "Oswald")
    .attr("font-size", "18px")
    .attr("fill", "gray")
    .attr("font-weight", 700);
}

// initialize header
upload_info_games(year, "Athina", country, 1, season, 12, 176);

// Map and projection
var path = d3.geoPath();
// Define a geographic projection using the Natural Earth projection method
var projection = d3.geoNaturalEarth()
.scale(width_adjusted / 2 / Math.PI)  // The scale determines the size of the map relative to the SVG container
.translate([width_adjusted / 2, height / 2]);  // The translation determines the center point of the map within the SVG container

var path = d3.geoPath().projection(projection);

// Data and color scale
var data = d3.map();
var full_data = d3.map();

// color
var get_color = function (season) {
  if (season == "Summer") {
    return d3.schemeBlues[8];
  } else {
    return d3.schemePuBu[8];
  }
};

var colorScheme = get_color(season);
colorScheme.unshift("#eee");

var colorScale = d3
  .scaleThreshold()
  .domain([1, 11, 51, 101, 201, 301, 401, 501])
  .range(colorScheme);

// tooltip circles
var tip = d3
  .tip()
  .attr("class", "d3-tip")
  .offset([-10, 0])
  .html(function (d) {
    return (
      "<strong>Country: " + d[0] +
      "<br>Total Medals: " + d[1]["total"] +
      "<br>🥇Gold Medals: " + d[1]["gold"] +
      "<br>🥈Silver Medals: " + d[1]["silver"] +
      "<br>🥉Bronze Medals: " + d[1]["bronze"]
    );
  });

// tooltip host city
var tip2 = d3
  .tip()
  .attr("class", "d3-tip2")
  .offset([-10, 0])
  .html(function (d) {
    let city = d.city;
    let country = d.country;
    return "<strong>Host city: </strong>" + city + ", " + country;
  });

// call Tooltips
svg.call(tip);
svg.call(tip2);

// Load external data
d3.queue()
  .defer(d3.json,"https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
  .defer(d3.json, "data/host_cities_markers.json")
  .defer(d3.csv, "data/country-coord.csv")
  .defer(d3.csv, "data/athlete_events.csv")
  .defer(d3.csv, "data/regions_participants3.csv", function (d) {
    // load data from csv
    if ("$" + d.Year in full_data) {
      var yearKey = "$" + d.Year;
      season = d.Season;

      if (season in full_data[yearKey]) {
      } else {
        full_data[yearKey][season] = { other: d.id };
      }

      full_data[yearKey][season][d.region] = {
        participants: d.Name,
        sports: d.Sport,
      };
    } else {
      full_data.set(d.Year, {});
      var yearKey = "$" + d.Year;
      season = d.Season;
      if (season in full_data[yearKey]) {
      } else {
        full_data[yearKey][season] = { other: d.id };
      }
      full_data[yearKey][season][d.region] = {
        participants: d.Name,
        sports: d.Sport,
      };
    }
    data = full_data["$" + year][season];
  })
  .await(ready);

// Function to load the data
function load_data() {
  data = full_data["$" + year][season];
}

// Function to count medals for each country in the provided athlete event data
function medalCount(athleteEventData, countries) {
    // Extract country names from the countries object
    var countryNames = Object.keys(countries); 
    // Group data by country and count medals for both summer and winter Olympics
    var medalCountByCountry = {};
    // Initialize counts for all countries in the countries object
    countryNames.forEach(country => {
      medalCountByCountry[country] = { total: 0, gold: 0, silver: 0, bronze: 0 };
    });

    athleteEventData.forEach((d) => {
      var country = d.Team;
      var currentYear = d.Year;
      var currentSeason = d.Season;
      if (country === "United States" || country === "United States-2" || country === "United States-1") country = "USA";
      if (country === "Spain-1" || country === "Spain-2") country = "Spain";
      if (country === "China-1" || country === "China-2") country = "China";
      if (country === "Brazil-1" || country === "Brazil-2") country = "Brazil";
      if (country === "Canada-1" || country === "Canada-2") country = "Canada";
      if (country === "South Korea-1"  || country === "outh Korea-3") country = "South Korea";
      if (country === "Russia-1" || country === "Russia-2") country = "Russia";
      if (country === "Soviet Union") country = "Russia";
      if (country === "Argentina-1") country = "Argentina";
      if (country === "Japan-2"  || country === "Japan-1" || country === "Japan-3") country = "Germany";
      if (country === "Germany-2") country = "Germany";
      if (country === "Ireland-2" || country === "Ireland-1" ) country = "Ireland";
      if (country === "Switzerland-1") country = "Switzerland";
      if (country === "France-2") country = "France";
      if (country === "Australia-1") country = "Australia";
      if (country === "Great Britain" || country === "United Kingdom") country = "England";
  
      if (d.Medal !== "NA" && currentYear == year && currentSeason == season) {
        if (countryNames.includes(country)) {
          // Check if the country is in the extracted country names array
          medalCountByCountry[country].total += 1;
          if (d.Medal === "Gold") { medalCountByCountry[country].gold += 1;
          } else if (d.Medal === "Silver") { medalCountByCountry[country].silver += 1;
          } else if (d.Medal === "Bronze") { medalCountByCountry[country].bronze += 1;
          } else {
            // If Medal is not one of 'Gold', 'Silver', or 'Bronze', increment 'total' only
            medalCountByCountry[country].total += 1;
          }
        }
      }
    });
    // Return the object containing medal counts for each country
    return medalCountByCountry;
}

// A helper function for combining data from both param into one array.
function combineArrays(data1, data2) {
  // Ensure both inputs are objects
  if (typeof data1 !== "object" || typeof data2 !== "object") {
    console.error("Both input parameters should be objects.");
    return {};
  }

  var combinedData = {};

  // Iterate through data1 (assumed to have medal counts)
  for (var country in data1) {
    if (data1.hasOwnProperty(country)) {
      combinedData[country] = Object.assign({}, data1[country], data2[country]);
    }
  }
  return combinedData;
}
// A helper Function for creating the circles, for each country participating in this
// year's games returns its coordinates from the file country-coord.csv
function getCoordinates(countryData, countries) {
  const coordinates = {};
  // Check if countryData is defined and is an array
  if (!Array.isArray(countryData)) {
    console.error("Country data is not available or is not in the expected format.");
    return coordinates; // Return empty coordinates object
  }
  // Iterate over each entry in the countryData array
  countryData.forEach((entry) => {
    const countryName = entry["Country"];
    // Check if the country exists in the countries dataset
    if (countries.hasOwnProperty(countryName)) {
        coordinates[countryName] = {
        latitude: parseFloat(entry["Latitude (average)"]),
        longitude: parseFloat(entry["Longitude (average)"]),
        };
    } 
  });
  return coordinates;
}
// update map, title and header to user choose.
function ready(error, topo, markers, coord, athletes) {
  if (error) throw error;

  // remove the previous map and circles.
  svg.selectAll("path").remove();
  svg.selectAll("circle").remove();
  // Define zoom behavior
  var zoom = d3
    .zoom()
    .scaleExtent([1, 4]) // Set the scale extent for zooming
    .on("zoom", zoomed); // Define the function to call when zooming

  // Apply zoom behavior to the SVG container
  svg.call(zoom);

  // Function to handle zooming
  function zoomed() {
    // Update the projection based on the zoom transformation
    var transform = d3.event.transform;
    svg
      .selectAll("path") // Select all paths (map features)
      .attr("transform", transform); // Apply the zoom transformation to paths
    svg
      .selectAll("circle") // Select all circles
      .attr("transform", transform); // Apply the zoom transformation to circles
}
  // Draw the map
  var delta_x = 10;
  var pathBuilder = d3.geoPath(projection);
  svg
    .append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
    .attr("d", function (eachFeature) { return pathBuilder(eachFeature); })
    .attr("stroke-opacity", 0.1)
    .style("stroke", "gray")
    .style("fill-opacity", 0.3);

  var data_circles = getCoordinates(coord, data); 
  var data_medals = medalCount(athletes, data); 
  // Call the combineArrays function to merge data_circles and data_medals
  var combinedData = combineArrays(data_circles, data_medals);

  // Define a function to calculate radius based on total medals
  function calculateRadius(totalMedals) {
    // Define your logic here to calculate the radius scale the radius based on the total number of medals of country
    return 5 + (Math.sqrt(totalMedals) * 2);  
  }

// Define a function to determine the continent based on latitude and longitude
  function getContinentName(latitude, longitude) {
    // Define the continent mapping
    const continents = {
        "NA": "North America",
        "SA": "South America",
        "EU": "Europe",
        "AF": "Africa",
        "AS": "Asia",
        "OC": "Australia",
        "AN": "Antarctica"
    };

    // Calculate the continent code based on latitude and longitude
    const continentCode = getContinentCode(latitude, longitude);

    // Return the continent name from the mapping
    return continents[continentCode] || "Unknown";
}

// Function to determine the continent code based on latitude and longitude coordinates
function getContinentCode(latitude, longitude) {
  // Determine the continent code based on latitude and longitude ranges
  if (latitude >= 0 && latitude <= 90) {
    if (longitude >= -169.5 && longitude <= -65.7) return "NA"; // North America
    if (longitude >= -90 && longitude <= -35) return "SA"; // South America
    if (longitude >= -24 && longitude <= 44) return "EU"; // Europe
    if (longitude >= 44 && longitude <= 180) return "AS"; // Asia
  }
  if (latitude >= -90 && latitude < 0) {
    if (longitude >= -169.5 && longitude <= -35) return "SA"; // South America
    if (longitude >= -25 && longitude <= 51) return "AF"; // Africa
    if (longitude >= -180 && longitude <= -90) return "NA"; // North America
    if (longitude >= -90 && longitude <= 0) return "NA"; // North America
  }
  if (latitude >= -90 && latitude < 0) {
    if (longitude >= 112 && longitude <= 180) return "OC"; // Oceania
  }
  return "AN"; // Antarctica (covers the remaining ranges)
}

// Define a color scheme for each continent based on Olympic colors
var continentColorScheme = {
  "Europe": "#0077ff", // Blue
  "Asia": "#ffd700",   // Yellow
  "North America": "#ff0000", // Red
  "South America": "#ff0000", // Green
  "Africa": "#000000", // Black
  "Australia": "#00ff00", // Pink
  "Antarctica": "#e37017" // White
};

// Define a function to map continent names to their respective colors
function getContinentColor(continentName) {
  return continentColorScheme[continentName] || "#e37017"; // Default color for unknown continents
}
  svg
    .append("g")
    .selectAll("circle")
    .data(Object.entries(combinedData))
    .enter()
    .append("circle")
     // .attr("transform", (d) => `translate(${path.centroid(d)})`)
    .attr("cx", function (d) { return projection([d[1].longitude, d[1].latitude])[0]; })
    .attr("cy", function (d) { return projection([d[1].longitude, d[1].latitude])[1]; })
    .attr("r", function (d) {
      // Set radius based on total medals, handle case when total is 0
      if (isNaN(d[1]["total"]) || d[1]["total"] === 0) {
        return 5; // Set a default radius value
      } else {
        // Calculate radius based on some logic
        return calculateRadius(d[1]["total"]); // You can define your own function to calculate radius based on total medals
      }
    })
    .on("mouseover", function (d) {
      // Change fill color when mouse hovers over the circle and Show tooltip
      d3.select(this).style("fill", "#e37017");
      tip.show(d); 
    })
    .on("mouseleave", function () {
      // Reset fill color when mouse leaves the circle and hide the tooltip
      d3.select(this).style("fill", d => getContinentColor(getContinentName(d[1].latitude, d[1].longitude)));
      tip.hide();
    })
    .attr("fill", d => getContinentColor(getContinentName(d[1].latitude, d[1].longitude))) // Add fill color
    .attr("stroke", function(d){
      if(+d[1]["total"] || d[1]["total"] === 0){
        return "black";
      }else return"none";
    }) 
    .attr("stroke-width", 0.1) 
    .attr("fill-opacity", 0.6);

  // remove the previous circle in host city
  svg.selectAll("image").remove();
  // get the data for host city
  var data_marker = [markers[year][season]];
  // update host city location
  svg
    .selectAll("myLocation")
    .data(data_marker)
    .enter()
    .append("svg:image")
    .attr("transform", "translate(" + delta_x + ",0)")
    .attr("x", function (d) {return projection([d.long, d.lat])[0] - 7;})
    .attr("y", function (d) {return projection([d.long, d.lat])[1] - 29;})
    .attr("width", 15)
    .attr("height", 30)
    .attr("xlink:href", "images/location_torch_crop.png")
    .on("mouseover", tip2.show)
    .on("mouseleave", tip2.hide);

  var edition = markers[year][season]["edition"];
  var n_athletes = markers[year][season]["n_athletes"];
  var n_countries = markers[year][season]["n_countries"];

  // Change info about games (header)
  upload_info_games(year,city,country,edition,season,n_countries,n_athletes);
}
