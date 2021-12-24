(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "color",
                default: "#5974c7"
            },
            {
                name: "symbol-size",
                alias: "图形大小",
                type: "number",
                default: 2.5
            },
            {
                name: "label-color",
                alias: "图形文本颜色",
                type: "color",
                default: "#aaa"
            },
            {
                name: "label-size",
                alias: "图形文本大小(px)",
                type: "number",
                default: 20
            },
            {
                name: "axis-label-color",
                alias: "坐标轴文本颜色",
                type: "color",
                default: "#aaa"
            },
            {
                name: "axis-label-size",
                alias: "坐标轴文本大小(px)",
                type: "number",
                default: 16
            },
            {
                name: "axis-label-weight",
                alias: "坐标轴文本加粗",
                type: "boolean",
                default: true
            },
            {
                name: "axis-pointer",
                alias: "显示坐标轴指示器",
                type: "boolean",
                default: true
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let symbol_size = await ShanhaiBI.getSetting("symbol-size");
    let label_color = await ShanhaiBI.getSetting("label-color");
    let label_size = await ShanhaiBI.getSetting("label-size");
    let axis_label_color = await ShanhaiBI.getSetting("axis-label-color");
    let axis_label_size = await ShanhaiBI.getSetting("axis-label-size");
    let axis_label_weight = await ShanhaiBI.getSetting("axis-label-weight");
    let axis_pointer_display = await ShanhaiBI.getSetting("axis-pointer");
    $.getJSON("./resource/life-expectancy-table.json", function (data) {
        let option = {
            color: shape_color,
            grid3D: {
                axisLabel: {
                    color: axis_label_color,
                    fontSize: axis_label_size,
                    fontWeight: axis_label_weight ? "bolder" : "normal"
                },
                axisPointer: {
                    show: axis_pointer_display,
                    lineStyle: { color: '#fff' }
                },
            },
            xAxis3D: {
                type: 'category'
            },
            yAxis3D: {},
            zAxis3D: {},
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
            label: {
                color: label_color,
                fontSize: label_size
            },
            series: [
                {
                    type: 'scatter3D',
                    symbolSize: symbol_size,
                    encode: {
                        x: 'Country',
                        y: 'Life Expectancy',
                        z: 'Income',
                        tooltip: [0, 1, 2, 3, 4]
                    }
                }
            ]
        };
        myChart.setOption(option);
    });
})();