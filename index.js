fetch(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
)
  .then((res) => res.json())
  .then((res) => {
    movieData = res;

    drawTreeMap(movieData);
  });

const canvas = d3.select("#canvas");
const tooltip = d3.select("#tooltip");

const drawTreeMap = (movieData) => {
  const hierarchy = d3
    .hierarchy(movieData, (node) => node["children"])
    .sum((node) => node["value"])
    .sort((node1, node2) => node2["values"] - node1["values"]);

  const createTreeMap = d3.treemap().size([1000, 600]);

  createTreeMap(hierarchy);

  const movieTitles = hierarchy.leaves();

  const block = canvas
    .selectAll("g")
    .data(movieTitles)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d["x0"]} , ${d["y0"]})`);

  block
    .append("rect")
    .attr("class", "tile")
    .attr("fill", (d) => {
      const category = d["data"]["category"];

      if (category === "Action") {
        return "orange";
      } else if (category === "Drama") {
        return "lightgreen";
      } else if (category === "Adventure") {
        return "coral";
      } else if (category === "Family") {
        return "lightblue";
      } else if (category === "Animation") {
        return "pink";
      } else if (category === "Comedy") {
        return "purple";
      } else if (category === "Biography") {
        return "tan";
      }
    })
    .attr("data-name", (d) => d["data"]["name"])
    .attr("data-category", (d) => d["data"]["category"])
    .attr("data-value", (d) => d["data"]["value"])
    .attr("width", (d) => d["x1"] - d["x0"])
    .attr("height", (d) => d["y1"] - d["y0"])
    .on("mouseover", (d) => {
      tooltip.transition().style("visibility", "visible");

      const revenue = d["data"]["value"]
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      tooltip.html("$" + revenue + "<hr />" + d["data"]["name"]);

      tooltip.attr("data-value", d["data"]["value"]);
    })
    .on("mouseout", (d) => {
      tooltip.transition().style("visibility", "hidden");
    });

  block
    .append("text")
    .text((d) => d["data"]["name"])
    .attr("x", 5)
    .attr("y", 30);
};
