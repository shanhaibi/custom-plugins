(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#5470c6', '#91cc75'],
            },
            {
                name: "line-width",
                alias: "线条宽度(px)",
                type: "number",
                default: 1,
            },
            {
                name: "line-type",
                alias: "线段类型",
                type: "select",
                choices: [
                    {
                        label: "实线",
                        value: "solid"
                    },
                    {
                        label: "虚线",
                        value: "dashed"
                    },
                    {
                        label: "点线",
                        value: "dotted"
                    }
                ],
                default: "solid",
            },
            {
                name: "point-size",
                alias: "端点大小(px)",
                type: "number",
                default: 5,
            },
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let colors = await ShanhaiBI.getSetting("shape-color");
    let line_style = {
        type: await ShanhaiBI.getSetting("line-type"),
        width: await ShanhaiBI.getSetting("line-width")
    };
    let point_size = await ShanhaiBI.getSetting("point-size");
    $.get("./data/rain.json", function (data) {
        let option = {
            color: colors,
            title: {
                text: 'Rainfall and Flow Relationship',
                left: 'center'
            },
            grid: {
                bottom: 80
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    animation: false,
                    label: {
                        backgroundColor: '#505765'
                    }
                }
            },
            legend: {
                data: ['Flow', 'Rainfall'],
                left: 10
            },
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 65,
                    end: 85
                },
                {
                    type: 'inside',
                    realtime: true,
                    start: 65,
                    end: 85
                }
            ],
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: { onZero: false },
                    // prettier-ignore
                    data: data.date.map(function (str) {
                        return str.replace(' ', '\n');
                    })
                }
            ],
            yAxis: [
                {
                    name: 'Flow(m^3/s)',
                    type: 'value',
                    max: 500
                },
                {
                    name: 'Rainfall(mm)',
                    nameLocation: 'start',
                    max: 5,
                    type: 'value',
                    inverse: true
                }
            ],
            series: [
                {
                    name: 'Flow',
                    type: 'line',
                    areaStyle: {},
                    symbolSize: point_size,
                    lineStyle: line_style,
                    emphasis: {
                        focus: 'series'
                    },
                    markArea: {
                        silent: true,
                        itemStyle: {
                            opacity: 0.3
                        },
                        data: [
                            [
                                {
                                    xAxis: '2009/9/12\n7:00'
                                },
                                {
                                    xAxis: '2009/9/22\n7:00'
                                }
                            ]
                        ]
                    },
                    // prettier-ignore
                    data: data.flow
                },
                {
                    name: 'Rainfall',
                    type: 'line',
                    yAxisIndex: 1,
                    areaStyle: {},
                    symbolSize: point_size,
                    lineStyle: line_style,
                    emphasis: {
                        focus: 'series'
                    },
                    markArea: {
                        silent: true,
                        itemStyle: {
                            opacity: 0.3
                        },
                        data: [
                            [
                                {
                                    xAxis: '2009/9/10\n7:00'
                                },
                                {
                                    xAxis: '2009/9/20\n7:00'
                                }
                            ]
                        ]
                    },
                    // prettier-ignore
                    data: data.rainfall
                }
            ]
        };
        myChart.setOption(option);
    })
})();