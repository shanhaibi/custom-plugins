(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ["#af3d49", "#eae39f"]
            },
            {
                name: "coordinate",
                alias: "显示坐标系",
                type: "boolean",
                default: true
            },
            {
                name: "axis-text-color",
                alias: "刻度文本颜色",
                type: "color",
                default: "#aaa"
            },
            {
                name: "axis-text-size",
                alias: "刻度文本大小(px)",
                type: "number",
                default: 12
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let axis_text_color = await ShanhaiBI.getSetting("axis-text-color");
    let axis_text_size = await ShanhaiBI.getSetting("axis-text-size");
    let coordinate_display = await ShanhaiBI.getSetting("coordinate");
    $.get(ROOT_PATH + '/data/asset/data/life-expectancy-table.json', function (data) {
        let option = {
            grid3D: { show: coordinate_display },
            tooltip: {},
            xAxis3D: {
                type: 'category',
            },
            yAxis3D: {
                type: 'category'
            },
            axisLabel: {
                color: axis_text_color,
                fontSize: axis_text_size
            },
            zAxis3D: {},
            visualMap: {
                inRange: {
                    color: shape_color.reverse()
                },
                max: 1e8,
                dimension: 'Population'
            },
            dataset: {
                dimensions: [
                    'Income',
                    'Life Expectancy',
                    'Population',
                    'Country',
                    { name: 'Year', type: 'ordinal' }
                ],
                source: data
            },
            series: [
                {
                    type: 'bar3D',
                    // symbolSize: symbolSize,
                    shading: 'lambert',
                    encode: {
                        x: 'Year',
                        y: 'Country',
                        z: 'Life Expectancy',
                        tooltip: [0, 1, 2, 3, 4]
                    }
                }
            ]
        };
        myChart.setOption(option);
    }
    );
})();