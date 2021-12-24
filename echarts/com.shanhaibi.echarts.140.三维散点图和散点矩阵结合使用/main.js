(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
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
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let symbol_size = await ShanhaiBI.getSetting("symbol-size");
    let label_color = await ShanhaiBI.getSetting("label-color");
    let label_size = await ShanhaiBI.getSetting("label-size");
    let sizeValue = '57%';
    $.getJSON("./resource/life-expectancy-table.json", function (data) {
        let option = {
            color: shape_color,
            tooltip: {},
            grid3D: {
                width: '50%',
                axisLabel: {
                    color: "#aaa",
                    fontSize: 12,
                },
                axisPointer: {
                    lineStyle: { color: '#fff' }
                },
            },
            xAxis3D: {},
            yAxis3D: {},
            zAxis3D: {},
            grid: [
                { left: '50%', width: '20%', bottom: sizeValue },
                { left: '75%', width: '20%', bottom: sizeValue },
                { left: '50%', width: '20%', top: sizeValue },
                { left: '75%', width: '20%', top: sizeValue }
            ],
            xAxis: [
                {
                    type: 'value',
                    gridIndex: 0,
                    name: 'Income',
                    axisLabel: { rotate: 50, interval: 0 }
                },
                {
                    type: 'category',
                    gridIndex: 1,
                    name: 'Country',
                    boundaryGap: false,
                    axisLabel: { rotate: 50, interval: 0 }
                },
                {
                    type: 'value',
                    gridIndex: 2,
                    name: 'Income',
                    axisLabel: { rotate: 50, interval: 0 }
                },
                {
                    type: 'value',
                    gridIndex: 3,
                    name: 'Life Expectancy',
                    axisLabel: { rotate: 50, interval: 0 }
                }
            ],
            yAxis: [
                { type: 'value', gridIndex: 0, name: 'Life Expectancy' },
                { type: 'value', gridIndex: 1, name: 'Income' },
                { type: 'value', gridIndex: 2, name: 'Population' },
                { type: 'value', gridIndex: 3, name: 'Population' }
            ],
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
                    type: 'scatter3D',
                    symbolSize: symbol_size,
                    encode: {
                        x: 'Population',
                        y: 'Life Expectancy',
                        z: 'Income',
                        tooltip: [0, 1, 2, 3, 4]
                    },
                    label: {
                        color: label_color,
                        fontSize: label_size
                    }
                },
                {
                    type: 'scatter',
                    symbolSize: symbol_size,
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    encode: {
                        x: 'Income',
                        y: 'Life Expectancy',
                        tooltip: [0, 1, 2, 3, 4]
                    }
                },
                {
                    type: 'scatter',
                    symbolSize: symbol_size,
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    encode: {
                        x: 'Country',
                        y: 'Income',
                        tooltip: [0, 1, 2, 3, 4]
                    }
                },
                {
                    type: 'scatter',
                    symbolSize: symbol_size,
                    xAxisIndex: 2,
                    yAxisIndex: 2,
                    encode: {
                        x: 'Income',
                        y: 'Population',
                        tooltip: [0, 1, 2, 3, 4]
                    }
                },
                {
                    type: 'scatter',
                    symbolSize: symbol_size,
                    xAxisIndex: 3,
                    yAxisIndex: 3,
                    encode: {
                        x: 'Life Expectancy',
                        y: 'Population',
                        tooltip: [0, 1, 2, 3, 4]
                    }
                }
            ]
        };
        myChart.setOption(option);
    });
})();