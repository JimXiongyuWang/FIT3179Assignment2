import bar from './bar.js'
import river from './river.js'
import map from './map.js'
import lsotype from './lsotype.js'
d3.text(
  "https://raw.githubusercontent.com/JimXiongyuWang/Week10HomeWork/main/number-of-deaths-by-risk-factor.csv"
).then((data) => {
  data = d3.csvParse(data);
  data = pivot_data(data);
  addCategorySelections(data);
  let mapData = data.filter(
    (d) =>
      d.Year === "1990" && d.Category === "high systolic blood pressure"
  );
  let mapJson = map(mapData, "high systolic blood pressure", "1990");

  vegaEmbed("#map", mapJson);

  let barJson = bar(data, "Total");

  vegaEmbed("#bar", barJson);
  let categoryOptions = [...new Set(data.map((d) => d.Category))];

  let riverJson = river(data, "Total", categoryOptions);
  vegaEmbed("#river", riverJson);

  let lsotypedata = handelLsoTypeData(data);
  let lsotypeJson = lsotype(lsotypedata, "", "1990");
  vegaEmbed("#lsotype", lsotypeJson);
});

//the function to select sum of death for each reason's top 3
function handelLsoTypeData(data, year = "1990") {

  
  let lsoData = data.filter((d) => d.Year === year);
  let lsoDataAggregate = d3.rollups(
    lsoData,
    (d) => d3.sum(d, (v) => v.Value),
    (d) => d.Category
  );
  lsoDataAggregate.sort((a, b) => (a[1] > b[1] ? -1 : 1));
  let top3keys = lsoDataAggregate.slice(0, 3).map((d) => d[0]);
  lsoData = lsoData.filter((d) => top3keys.includes(d.Category));
  lsoData.sort((a, b) => (a.Country > b.Country ? -1 : 1));
  return lsoData;
}
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
  let lsotypeFilter = d3.select("#lsotypeFilter").append("select");
  add_selection(lsotypeFilter, years);

  lsotypeFilter.on("change", (event) => {
    // update lso type chart
    year = event.target.value;
    let lsotypedata = handelLsoTypeData(data, year);

    let lsotypeJson = lsotype(lsotypedata, "", year);
    vegaEmbed("#lsotype", lsotypeJson);
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