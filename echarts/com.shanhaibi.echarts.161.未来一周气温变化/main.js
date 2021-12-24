(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-date",
                alias: "日期字段",
                type: "axis"
            },
            {
                name: "axis-lowest-value",
                alias: "最低温度字段",
                type: "axis"
            },
            {
                name: "axis-highest-value",
                alias: "最高温度字段",
                type: "axis"
            }
        ],
        "format": [
            {
                name: "line-color",
                alias: "线条颜色",
                type: "palette",
                default: ['#5470c6', '#91cc75'],
            },
            {
                name: "point-size",
                alias: "端点大小",
                type: "number",
                default: 5
            },
            {
                name: "label-color",
                alias: "文本颜色",
                type: "color",
                default: "#fff",
                cluster: {title: "文本设置"}
            },
            {
                name: "label-size",
                alias: "字体大小(px)",
                type: "number",
                default: 16,
                cluster: {title: "文本设置"}
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let point_size = await ShanhaiBI.getSetting("point-size");
    let label_style = {
        color: await ShanhaiBI.getSetting("label-color"),
        fontSize: await ShanhaiBI.getSetting("label-size")
    };
    let rawData = await ShanhaiBI.getData();
    let date_data = rawData.getColumn("axis-date");
    let lowest_value_data = rawData.getColumn("axis-lowest-value");
    let highest_value_data = rawData.getColumn("axis-highest-value");
    if(date_data.length && lowest_value_data.length && highest_value_data.length) {
        date_data = date_data.map(date_str => {
            let date = new Date(date_str);
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        });
    } else {
        highest_value_data = [10, 11, 13, 11, 12, 12, 9];
        lowest_value_data = [1, -2, 2, 5, 3, 2, 0];
        date_data = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    }

    let option = {
        color: await ShanhaiBI.getSetting("line-color"),
        title: {
            text: 'Temperature Change in the Coming Week'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            textStyle: {
                color: "#aaa"
            }
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                magicType: { type: ['line', 'bar'] },
                restore: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date_data
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} °C'
            }
        },
        series: [
            {
                name: 'Highest',
                type: 'line',
                symbolSize: point_size,
                data: highest_value_data,
                markPoint: {
                    data: [
                        { type: 'max', name: 'Max' },
                        { type: 'min', name: 'Min' }
                    ],
                    label: label_style
                },
                markLine: {
                    data: [{ type: 'average', name: 'Avg' }],
                    label: {
                        color: "#666"
                    }
                }
            },
            {
                name: 'Lowest',
                type: 'line',
                symbolSize: point_size,
                data: lowest_value_data,
                markPoint: {
                    data: [{ type: 'min', name: 'Min' }],
                    label: label_style
                },
                markLine: {
                    data: [
                        { type: 'average', name: 'Avg' },
                        [
                            {
                                symbol: 'none',
                                x: '90%',
                                yAxis: 'max'
                            },
                            {
                                symbol: 'circle',
                                label: {
                                    position: 'start',
                                    formatter: 'Max'
                                },
                                type: 'max',
                                name: '最高点'
                            }
                        ]
                    ],
                    label: {
                        color: "#666"
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
})();