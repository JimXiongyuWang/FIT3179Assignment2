export default function (data, indicator) {
  let chart_json = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title: `Deaths to Unhealty `,
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
        groupby: ["Year", "Category"],
      },
    ],
    params: [
      {
        name: "Category",
        select: { type: "point", fields: ["Category"] },
        bind: "legend",
      },
    ],
    mark: {
      type: "line",
      point: true,
    },
    encoding: {
      y: {
        field: "Value",
        type: "quantitative",
      },
      x: {
        field: "Year",
        type: "nominal",
      },
      color: {
        field: "Category",
        type: "nominal",
      },
      opacity: {
        condition: { param: "Category", value: 1 },
        value: 0.2,
      },
      tooltip: [
        { field: "Category", type: "nominal" },
        { field: "Year", type: "nominal" },
        { field: "Value", type: "quantitative" },
      ],
    },
  };
  return chart_json;
}
