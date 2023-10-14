export default function river(data, indicator, categories) {
  let chart_json = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: "container",
    height: "container",
    title: {
      fontSize: 25,
      text: "Year Trend of number of deaths by risk factor",
    },
    data: { values: data },
    mark: "area",
    params: [
      {
        name: "Legend",
        select: { type: "point", fields: ["Category"] },
        bind: "legend",
      },
      {
        name: "CategorySelect", // 修改为不同的名称
        select: { type: "point", fields: ["Category"] },
        bind: {
          input: "select",
          options: ["All Reason", ...categories],
        },
      },
    ],
    transform: [{ filter: { param: "CategorySelect" } }], // 使用正确的参数名称
    encoding: {
      x: {
        field: "Year",
        axis: { tickSize: 0 },
      },
      y: {
        aggregate: "sum",
        field: "Value",
        stack: "center",
        axis: null,
      },
      color: {
        field: "Category",
        scale: { scheme: "category20b" },
      },
      opacity: {
        condition: { param: "Legend", value: 1 },
        value: 0.2,
      },
      tooltip: [{ field: "Category", type: "nominal" }],
    },
  };
  return chart_json;
}
