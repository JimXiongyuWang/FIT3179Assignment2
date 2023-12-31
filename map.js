export default function map(data, indicator, year) {
  let maps = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title: `Deaths by ${indicator} based on Country (${year})  `,
    width: "container",
    height: "container",
    projection: {
      type: "equalEarth",
    },

    layer: [
      {
        data: {
          url: "https://raw.githubusercontent.com/JimXiongyuWang/FIT3179Week9Homework/main/js/ne_110m.json",
          format: {
            type: "topojson",
            feature: "ne_110m_graticules_30",
          },
        },
        mark: {
          type: "geoshape",
          fill: null,
          stroke: "lightgray",
        },
      },
      {
        data: {
          url: "https://raw.githubusercontent.com/JimXiongyuWang/FIT3179Week9Homework/main/js/ne_110m_ocean.json",
          format: {
            type: "topojson",
            feature: "oceans",
          },
        },
        mark: {
          type: "geoshape",
          fill: "skyblue",
        },
      },
      {
        data: {
          url: "https://raw.githubusercontent.com/JimXiongyuWang/FIT3179Week9Homework/main/js/ne_110m.json",
          format: {
            type: "topojson",
            feature: "ne_110m_admin_0_countries",
          },
        },

        transform: [
          {
            lookup: "properties.ADM0_ISO",
            from: {
              data: { values: data },
              key: "Code",
              fields: ["Value", "Country"],
            },
          },
        ],

        mark: {
          type: "geoshape",
          stroke: "gray",
        },
        encoding: {
          color: {
            field: "Value",
            type: "quantitative",
            scale: {
              schema: "greens",
            },
          },

          tooltip: [
          
            { field: "Country", type: "nominal" },
            { field: "Value", type: "quantitative" },
          ],
        },
      },
    ],
  };
  return maps;
}
