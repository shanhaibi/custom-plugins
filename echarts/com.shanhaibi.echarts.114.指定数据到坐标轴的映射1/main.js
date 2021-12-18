(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#65B581', '#FFCE34', '#FD665F', '#5873c6', '#85cce9']
            },
            {
                name: "symbol-size",
                alias: "散点大小(px)",
                type: "number",
                default: 2.5
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color")
    let sizeValue = '57%';
    let symbolSize = await ShanhaiBI.getSetting("symbol-size");

    $.get(ROOT_PATH + '/data/asset/data/life-expectancy-table.json', function (data) {
        let option = {
            color: shape_color,
            legend: {},
            tooltip: {},
            toolbox: {
                left: 'center',
                feature: {
                    dataZoom: {}
                }
            },
            grid: [
                { right: sizeValue, bottom: sizeValue },
                { left: sizeValue, bottom: sizeValue },
                { right: sizeValue, top: sizeValue },
                { left: sizeValue, top: sizeValue }
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
            axisLabel: {
                color: "#aaa"
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
                    type: 'scatter',
                    symbolSize: symbolSize,
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
                    symbolSize: symbolSize,
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
                    symbolSize: symbolSize,
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
                    symbolSize: symbolSize,
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
    }
    );
})()