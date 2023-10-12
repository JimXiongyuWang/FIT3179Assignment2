const country = "China";
export default function (data, indicator) {
  let chart_json = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title: `Region death Overview `,
    width: "container",
    height: "container",
    data: { values: data },
    transform: [
      {
        aggregate: [
          {
            op: "sum",
            field: "Value",
            as: "Value",
          },
        ],
        groupby: ["Year"],
      },
    ],
    encoding: {
      y: {
        field: "Value",
        type: "quantitative",
      },
      x: {
        field: "Year",
        type: "nominal",
      },
      tooltip: [
        { field: "Year", type: "nominal" },
        { field: "Value", type: "quantitative" },
      ],
    },
    layer: [
      {
        mark:{type: "bar" ,fill:"#6A9C89" },
      },
      {
        mark: { type: "line", stroke: "#CD5C08" },
      },
    ],
  };
  return chart_json;
}
