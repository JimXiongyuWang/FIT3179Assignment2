export default  function lsotype(data, indicator, year) {
  let chart = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    config: { view: { stroke: "" } },
    width: 800,
    height: 200,
    data: {
      values: data,
    },
    title: {
      fontSize: 25,
      text: `Top 3 Risk Factor by number of deaths  in ${year}`,
      subtitle:
        "Modify the map's year filter to update the year of this data",
    },
    transform: [
      {
        window: [{ op: "rank", as: "rank" }],
        groupby: ["Category"],
      },
      { calculate: "ceil (datum.rank/10)", as: "col" },
      { calculate: "datum.rank - datum.col*10", as: "row" },
    ],
    mark: { type: "point", fill: true },
    encoding: {
      x: { field: "col", type: "ordinal", axis: null },
      y: { field: "row", type: "ordinal", axis: null },
      row: { field: "Category", header: { title: "" } },
      text: { field: "Category", type: "nominal" },
      size: { value: 65 },
      color: { field: "Category" },
      fill: { field: "Category" },
      tooltip: [
        { field: "Category", type: "norminal" },
        { field: "Country", type: "norminal" },
        { field: "Value", type: "quantitative" },
        { field: "Year", type: "norminal" },
      ],
    },
  };
  return chart;
}
