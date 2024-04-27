// Load data
d3.csv("./data/athlete_events.csv", function(data) {

    var years = Array.from(new Set(data.map(function(d) { return d.Year; }))); // years in the csv file
    var malePercentage = [];
    var femalePercentage = [];

    years.forEach(function(year) {
        var yearData = data.filter(function(d) { return d.Year === year; });
        var totalParticipants = yearData.length;
        var maleCount = yearData.filter(function(d) { return d.Sex === 'M'; }).length;
        var femaleCount = yearData.filter(function(d) { return d.Sex === 'F'; }).length;

        var malePercent = (maleCount / totalParticipants) * 100;
        var femalePercent = (femaleCount / totalParticipants) * 100;

        malePercentage.push({ Year: year, Percentage: malePercent });
        femalePercentage.push({ Year: year, Percentage: femalePercent });

        // Sort male and female percentages by year
        malePercentage.sort(function(a, b) { return a.Year - b.Year; });
        femalePercentage.sort(function(a, b) { return a.Year - b.Year; });
    });

    // Create visualization
    var margin = { top: 10, right: 50, bottom: 60, left: 50 },
        width = 1000 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var svg = d3.select("#male_VS_female")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Initialize the tooltip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>Year:</strong> <span style='color:red'>" + d.Year + 
            "</span><br><strong>Percentage:</strong> <span style='color:red'>" + Math.round(d.Percentage) +" %"+ "</span>";
        });
    svg.call(tip);
    svg.selectAll(".line")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);



    // X Axis
    var x = d3.scaleLinear()
        .domain(d3.extent(years))
        .range([0, width]);

    // Y Axis
    var y = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0])


    var lineMale = d3.line()
        .x(function(d) { return x(d.Year); })
        .y(function(d) { return y(d.Percentage); })
        .curve(d3.curveCardinal);


    var lineFemale = d3.line()
        .x(function(d) { return x(d.Year); })
        .y(function(d) { return y(d.Percentage); })
        .curve(d3.curveCardinal);


    var thickness = 4;

    svg.append("path")
        .datum(malePercentage)
        .attr("fill", "none")
        .attr("stroke", "#0049aa")
        .attr("stroke-width", thickness)
        .attr("d", lineMale);

    svg.append("path")
        .datum(femalePercentage)
        .attr("fill", "none")
        .attr("stroke", "#c01c2e")
        .attr("stroke-width", thickness)
        .attr("d", lineFemale);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d3.format("d"))); // Format the X axis labels as integers so it won't show 2,010 instead of 2010

    svg.append("g")
        .call(d3.axisLeft(y));



    // Add X axis label
    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Year");

    // Add Y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Percentage (%)");


    // Append horizontal line at 50%
    svg.append("line")
    .attr("x1", 0)
    .attr("y1", y(50))
    .attr("x2", width)
    .attr("y2", y(50))
    .style("stroke", "#ccc") // Gray color
    .style("stroke-width", 2)
    .style("stroke-dasharray", "5,2"); // Dashed line




    // Create legend for male line
    svg.append("text")
    .attr("x", width - 20)
    .attr("y", 20)
    .attr("fill", "blue")
    .text("♂️ Male");

    // Create legend for female line
    svg.append("text")
    .attr("x", width - 20)
    .attr("y", 40)
    .attr("fill", "red")
    .text("♀️ Female");

    // Append tooltips to male line
    svg.selectAll(".male-circle")
    .data(malePercentage)
    .enter().append("circle")
    .attr("class", "male-circle")
    .attr("cx", function(d) { return x(d.Year); })
    .attr("cy", function(d) { return y(d.Percentage); })
    .attr("r", thickness/2)
    .style("fill", "#0049aa")
    .on('mouseover', function(d) {
        tip.show(d);
    })
    .on('mouseout', tip.hide);

    // Append tooltips to female line
    svg.selectAll(".female-circle")
    .data(femalePercentage)
    .enter().append("circle")
    .attr("class", "female-circle")
    .attr("cx", function(d) { return x(d.Year); })
    .attr("cy", function(d) { return y(d.Percentage); })
    .attr("r", thickness/2)
    .style("fill", "#c01c2e")
    .on('mouseover', function(d) {
        tip.show(d);
    })
    .on('mouseout', tip.hide);


});
