import map from "./map.js";
import bar from "./bar.js";
import river from "./river.js";
import line from "./line.js";
d3.csv("./number-of-deaths-by-risk-factor.csv").then((data) => {
  data = pivot_data(data);
  addCategorySelections(data);
  let mapData = data.filter(
    (d) => d.Year === "1990" && d.Category === "high systolic blood pressure"
  );
  let mapJson = map(mapData, "high systolic blood pressure", "1990");

  vegaEmbed("#map", mapJson);

  let barJson = bar(data, "Total");

  vegaEmbed("#bar", barJson);

  let riverJson = river(data, "Total");
  vegaEmbed("#river", riverJson);

  let lineJson = line(data, "Total");
  vegaEmbed("#line", lineJson);
});

function pivot_data(data) {
  let pivot_data = [];
  let keys = Object.keys(data[0]);

  data.forEach((d) => {
    keys.forEach((key) => {
      if (key.startsWith("Deaths")) {
        d[key] = +d[key];
        pivot_data.push({
          Country: d.Entity,
          Category: key
            .replace("Deaths that are from all causes attributed to", "")
            .replace(" in both sexes aged all ages", "")
            .replace(",", "")
            .trim(),
          Value: d[key],
          Year: d.Year,
          Code: d.Code,
        });
      }
    });
  });

  return pivot_data;
}
function addCategorySelections(data) {
  const add_selection = (selection, options) => {
    selection
      .selectAll("option")
      .data(options)
      .join("option")
      .attr("value", (d) => d)
      .html((d) => d);
  };

  let categoryOptions = [...new Set(data.map((d) => d.Category))];
  let categorySelection = d3.select(".categoryFilters").append("select");
  let category = categoryOptions[0];

  add_selection(categorySelection, categoryOptions);
  let years = [...new Set(data.map((d) => d.Year))];
  let year = years[0];
  let yearSelection = d3.select(".yearFilters").append("select");
  add_selection(yearSelection, years);

  categorySelection.on("change", (event) => {
    category = event.target.value;
    let mapData = data.filter(
      (d) => d.Year === year && d.Category === category
    );
    let mapJson = map(mapData, category, year);
    vegaEmbed("#map", mapJson);
  });

  yearSelection.on("change", (event) => {
    year = event.target.value;

    let mapData = data.filter(
      (d) => d.Year === year && d.Category === category
    );
    let mapJson = map(mapData, category, year);

    vegaEmbed("#map", mapJson);
  });

  let regions = [...new Set(data.map((d) => d.Country))];
  let regionSelection = d3.select("#regionFilter").append("select");
  let region = regions[0];
  add_selection(regionSelection, regions);
  regionSelection.on("change", (event) => {
    region = event.target.value;
    let barData = data.filter((d) => d.Country === region);
    let barJson = bar(barData, "Total");
    vegaEmbed("#bar", barJson);
  });
}
