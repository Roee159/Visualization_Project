// set dimensions for title svg
var width_title = Math.min(1800, window.innerWidth) - 270;
var height_title = 80;

// svg for the title
var title_games = d3
  .select("#title")
  .append("svg")
  .attr("width", width_title)
  .attr("height", height_title)
  .attr("transform", "translate(" + 0 + ",0)");
var openNewTab = function openInNewTab(url) {
  var win = window.open(url, "_blank");
  win.focus();
};

// change the title when selecting a game
function update_title(year, city, country) {
  title_games.selectAll("text").remove();
  // add text
  title_games
    .append("text")
    .attr("x", width_title / 2)
    .attr("y", 50)
    .text(
      "Visualization the Olympic Games of " +
        year +
        " (" +
        city +
        ", " +
        country +
        ")"
    )
    .attr("font-family", "Oswald")
    .attr("font-size", function () {
      if (width_title < 700) {
        return "20px";
      } else {
        return "25px";
      }
    })
    .attr("font-weight", 900)
    .attr("alignment-baseline", "middle")
    .attr("text-anchor", "middle");
}

// initialize
update_title(1896, "Athina", "Greece");
