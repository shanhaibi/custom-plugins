(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "color",
                default: "#1890ff"
            },
            {
                name: "shape-size",
                alias: "图形大小(px)",
                type: "number",
                default: 20
            },
            {
                name: "regression-color",
                alias: "回归线颜色",
                type: "color",
                default: "#9ece7b"
            },
            {
                name: "function-text-size",
                alias: "函数文本大小(px)",
                type: "number",
                default: 16
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);
    echarts.registerTransform(ecStat.transform.regression);

    let data = (await ShanhaiBI.getData()).getColumns();
    if (data.length < 2) {
        data = [
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
            [4862.4, 5294.7, 5934.5, 7171, 8964.4, 10202.2, 11962.5, 14928.3, 16909.2, 18547.9, 21617.8, 26638.1, 34634.4, 46759.4, 58478.1, 67884.6, 74462.6, 79395.7]
        ]
    }
    let source_data = [];
    for (let i = 0; i < data[0].length; i++) {
        source_data.push([data[0][i], data[1][i]]);
    }

    let option = {
        dataset: [
            {
                source: source_data
            },
            {
                transform: {
                    type: 'ecStat:regression',
                    config: {
                        method: 'exponential',
                        // 'end' by default
                        // formulaOn: 'start'
                    }
                }
            }
        ],
        title: {
            text: '1981 - 1998 gross domestic product GDP (trillion yuan)',
            subtext: 'By ecStat.regression',
            sublink: 'https://github.com/ecomfe/echarts-stat',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        xAxis: {
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        yAxis: {
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                name: 'scatter',
                type: 'scatter',
                datasetIndex: 0,
                color: await ShanhaiBI.getSetting("shape-color"),
                symbolSize: await ShanhaiBI.getSetting("shape-size")
            },
            {
                name: 'line',
                type: 'line',
                smooth: true,
                color: await ShanhaiBI.getSetting("regression-color"),
                datasetIndex: 1,
                symbolSize: 0.1,
                symbol: 'circle',
                label: {
                    show: true,
                    fontSize: await ShanhaiBI.getSetting("function-text-size"),
                    color: "#fff"
                },
                labelLayout: { dx: -20 },
                encode: { label: 2, tooltip: 1 }
            }
        ]
    };
    myChart.setOption(option);
})();