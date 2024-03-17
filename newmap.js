var genderOptions = ["Both", "Men", "Women"];
var currentGenderIndex = 0;

function toggleGender() {
    currentGenderIndex = (currentGenderIndex + 1) % genderOptions.length;
    document.getElementById("genderToggle").innerText = genderOptions[currentGenderIndex];

    // Update visualization based on the selected gender option
    updateVisualization();
}

// Load the athlete events data
d3.csv('athlete_events.csv')
    .then(data => {

    // Group data by country and count medals for both summer and winter Olympics
    var medalCountByCountry = {};
    data.forEach(d => {
        var country = d.Team;

        if (country == "United States")
            country = "United States of America"
        if (country == "Great Britain")
            country = "United Kingdom"

        if (d.Medal !== 'NA') {
            medalCountByCountry[country] = medalCountByCountry[country] || { total: 0, gold: 0, silver: 0, bronze: 0 };
            medalCountByCountry[country].total += 1;
            if (d.Medal === 'Gold') {
                medalCountByCountry[country].gold += 1;
            } else if (d.Medal === 'Silver') {
                medalCountByCountry[country].silver += 1;
            } else if (d.Medal === 'Bronze') {
                medalCountByCountry[country].bronze += 1;
            }
        }
    });
    console.log("medalCountByCountry = ", medalCountByCountry);

    // Convert data to an array for D3
    var medalData = Object.keys(medalCountByCountry).map(country => {
        return {
            country: country,
            medalCount: medalCountByCountry[country].total,
            goldCount: medalCountByCountry[country].gold,
            silverCount: medalCountByCountry[country].silver,
            bronzeCount: medalCountByCountry[country].bronze
        };
    });

    // Load the world geometry data
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(data => {

        var geojsonData = topojson.feature(data, data.objects.countries);
        geojsonData.features.forEach(feature => {
            var country = feature.properties.name;
            var medalDataForCountry = medalCountByCountry[country] || { total: 0, gold: 0, silver: 0, bronze: 0 };
            feature.properties.medalData = medalDataForCountry;
        });

        var width = 900;
        var height = 600;

        var projection = d3.geoMercator().scale(140).translate([width / 2, height / 1.4]);
        var path = d3.geoPath(projection);

        var svg = d3.select("#map-container").append("svg")
            .attr("width", width)
            .attr("height", height);

        var mapGroup = svg.append("g");

        var circleGroup = svg.append("g");

        // Define zoom behavior
        var zoom = d3.zoom()
            .scaleExtent([1, 8])  // Set the zoom scale limits
            .on("zoom", zoomed);

        svg.call(zoom);

        // Update the projection on zoom
        function zoomed() {
            mapGroup.attr("transform", d3.event.transform);
            circleGroup.attr("transform", d3.event.transform);

            // Update circle size based on zoom level
            var currentZoomLevel = d3.event.transform.k;
            var circleSize = Math.max(0.8, (5 - currentZoomLevel));
            circleGroup.selectAll("circle.medal-circle")
                .attr("r", d => (d.properties.medalData.total / (110 * currentZoomLevel)) + (circleSize));
        }

        mapGroup.selectAll("path")
            .data(geojsonData.features)
            .enter().append("path")
            .attr("d", path)
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5);

        // Append circles for medal count with tooltips
        circleGroup.selectAll("circle.medal-circle")
            .data(geojsonData.features)
            .enter().append("circle")
            .attr("class", "medal-circle")
            .attr("transform", d => `translate(${path.centroid(d)})`)
            .attr("r", d => (d.properties.medalData.total / 110) + 5) // circle size
            .on("mouseover", showTooltip)
            .on("mouseout", hideTooltip);


        // Function to show tooltip
        function showTooltip(d) {
            var countryName = d.properties.name;
            var medalData = d.properties.medalData;

            var tooltipContent = `${countryName}: ${medalData.total} medals<br>
                🥇Gold: ${medalData.gold} medals<br>
                🥈Silver: ${medalData.silver} medals<br>
                🥉Bronze: ${medalData.bronze} medals`;

            // Position the tooltip
            var tooltip = d3.select("#tooltip");
            tooltip.html(tooltipContent)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 20) + "px")
                .style("display", "block");
        }

        // Function to hide tooltip
        function hideTooltip() {
            d3.select("#tooltip").style("display", "none");
        }

    });
})
.catch(function(error) {
    // Code to handle any errors that occur during loading
    console.log(error);
  });