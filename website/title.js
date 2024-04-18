// set dimensions
var width_title = Math.min(1800, window.innerWidth) - 270;
var height_title = 80;

// svg for the title
var title_games = d3.select("#title")
                .append("svg")
                .attr("width", width_title)
                .attr("height", height_title)
                .attr("transform","translate(" + 0 +",0)");
var openNewTab = function openInNewTab(url) {
                        var win = window.open(url, '_blank');
                        win.focus();
                        }
// add icon github repository
      title_games
        .append("svg:image")
        .attr('x', 20)
        .attr('y', 20)
        .attr('width', 20)
        .attr('height', 20)
        .attr("xlink:href", "images/github.jpeg")
        .on("click", function(){openNewTab("https://github.com/com-480-data-visualization/com-480-project-knn-viz")});

// add icon process book
      title_games
        .append("svg:image")
        .attr('x', 60)
        .attr('y', 20)
        .attr('width', 20)
        .attr('height', 20)
        .attr("xlink:href", "images/process.jpeg")
        .on("click", function(){openNewTab("https://github.com/com-480-data-visualization/com-480-project-knn-viz/blob/master/Process_Book_knn.pdf")});

// add icon video
      title_games
            .append("svg:image")
            .attr('x', 100)
            .attr('y', 20)
            .attr('width', 20)
            .attr('height', 20)
            .attr("xlink:href", "images/video.png")
            .on("click", function(){openNewTab("https://youtu.be/xWv1JyJC_aY")});


// change the title when selecting a game
function update_title(year, city, country){
  title_games.selectAll("text").remove();
    // add text
      title_games.append("text")
            .attr("x", (width_title)/2)
            .attr("y", 50)
            .text("Discovering the Olympic games of " + year + " (" + city + ", " + country + ")")
            .attr("font-family", "Oswald")
            .attr("font-size", function(){if(width_title < 700){
                    return "20px";
            } else {
                    return "25px";
            }})
            .attr("font-weight", 900)
            .attr("alignment-baseline","middle")
            .attr("text-anchor", "middle");
}

// initialize
update_title(1896, "Athina", "Greece");
