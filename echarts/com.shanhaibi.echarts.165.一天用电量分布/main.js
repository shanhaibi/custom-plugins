(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "line-color",
                alias: "线段颜色",
                type: "color",
                default: "#2a8000",
                cluster: {title: "线段颜色"}
            },
            {
                name: "peak-color",
                alias: "高峰颜色",
                type: "color",
                default: "#f20101",
                cluster: {title: "线段颜色"}
            },
            {
                name: "line-width",
                alias: "线条宽度(px)",
                type: "number",
                default: 3,
                cluster: { title: "线段设置" }
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
                cluster: { title: "线段设置" }
            },
            {
                name: "series-shape-type",
                alias: "折线形状",
                type: "select",
                default: "line",
                choices: [
                    {
                        label: "折线",
                        value: "line"
                    },
                    {
                        label: "平滑",
                        value: "smooth"
                    }
                ],
                cluster: { title: "线段设置" }
            },
            {
                name: "point-size",
                alias: "端点大小(px)",
                type: "number",
                default: 5,
                cluster: {title: "线段设置"}
            },
            {
                name: "area-color",
                alias: "高峰区间颜色",
                type: "color",
                default: 'rgba(255, 173, 177, 0.4)',
            },
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let line_color = await ShanhaiBI.getSetting("line-color");
    let peak_color = await ShanhaiBI.getSetting("peak-color");
    let line_shape_type = await ShanhaiBI.getSetting("series-shape-type");
    let line_style = {
        type: await ShanhaiBI.getSetting("line-type"),
        width: await ShanhaiBI.getSetting("line-width")
    };
    let data = (await ShanhaiBI.getData()).getColumns();
    if(!data.length) {
        data = [[300, 280, 250, 260, 270, 300, 550, 500, 400, 390, 380, 390, 400, 500, 600, 750, 800, 700, 600, 400]];
    }
    let option = {
        title: {
            text: 'Distribution of Electricity',
            subtext: 'Fake Data'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            // prettier-ignore
            data: ['00:00', '01:15', '02:30', '03:45', '05:00', '06:15', '07:30', '08:45', '10:00', '11:15', '12:30', '13:45', '15:00', '16:15', '17:30', '18:45', '20:00', '21:15', '22:30', '23:45']
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} W'
            },
            axisPointer: {
                snap: true
            }
        },
        visualMap: {
            show: false,
            dimension: 0,
            pieces: [
                {
                    lte: 6,
                    color: line_color
                },
                {
                    gt: 6,
                    lte: 8,
                    color: peak_color
                },
                {
                    gt: 8,
                    lte: 14,
                    color: line_color
                },
                {  
                    gt: 14,
                    lte: 17,
                    color: peak_color
                },
                {
                    gt: 17,
                    color: line_color
                }
            ]
        },
        series: [
            {
                name: 'Electricity',
                type: 'line',
                smooth: line_shape_type === "smooth" ? true : false,
                // prettier-ignore
                data: data[0],
                lineStyle: line_style,
                symbolSize: await ShanhaiBI.getSetting("point-size"),
                markArea: {
                    itemStyle: {
                        color: await ShanhaiBI.getSetting("area-color")
                    },
                    label: {
                        color: "#aaa"
                    },
                    data: [
                        [
                            {
                                name: 'Morning Peak',
                                xAxis: '07:30'
                            },
                            {
                                xAxis: '10:00'
                            }
                        ],
                        [
                            {
                                name: 'Evening Peak',
                                xAxis: '17:30'
                            },
                            {
                                xAxis: '21:15'
                            }
                        ]
                    ]
                }
            }
        ]
    };
    myChart.setOption(option);
})();