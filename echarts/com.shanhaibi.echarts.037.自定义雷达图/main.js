(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-x",
                alias: "x轴字段",
                type: "axis",
            },
            {
                name: "axis-y",
                alias: "y轴字段",
                type: "axis",
            }
        ],
        "format": [
            {
                name: "data-color",
                alias: "数据颜色",
                type: "palette",
                default: ['#67F9D8', '#FFE434', '#56A3F1', '#FF917C', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
            },
            {
                name: "area-color",
                alias: "雷达图背景色",
                type: "palette",
                default: ['#77EADF', '#26C3BE', '#64AFE9', '#428BD4', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
            },
            {
                name: "axis-label",
                alias: "轴刻度值",
                type: "boolean",
                default: true
            }
        ]
    })
    
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let axis_label_display = await ShanhaiBI.getSetting("axis-label")
    let data = await ShanhaiBI.getData();
    echartsSetOption(myChart, data);

    async function echartsSetOption(echart, data) {
        let option = {
            color: await ShanhaiBI.getSetting("data-color"),
            title: {
                text: 'Customized Radar Chart'
            },
            legend: {
                textStyle: {
                    color: "#aaa"
                },
            },
            radar: [
                {
                    indicator: [
                        { text: 'Indicator1' },
                        { text: 'Indicator2' },
                        { text: 'Indicator3' },
                        { text: 'Indicator4' },
                        { text: 'Indicator5' }
                    ],
                    center: ['25%', '50%'],
                    radius: 120,
                    startAngle: 90,
                    splitNumber: 4,
                    shape: 'circle',
                    axisName: {
                        formatter: '【{value}】',
                        color: '#428BD4'
                    },
                    splitArea: {
                        areaStyle: {
                            color: await ShanhaiBI.getSetting("area-color"),
                            shadowColor: 'rgba(0, 0, 0, 0.2)',
                            shadowBlur: 10
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(211, 253, 250, 0.8)'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(211, 253, 250, 0.8)'
                        }
                    }
                },
                {
                    indicator: [
                        { text: 'Indicator1', max: 150 },
                        { text: 'Indicator2', max: 150 },
                        { text: 'Indicator3', max: 150 },
                        { text: 'Indicator4', max: 120 },
                        { text: 'Indicator5', max: 108 },
                        { text: 'Indicator6', max: 72 }
                    ],
                    center: ['75%', '50%'],
                    radius: 120,
                    axisName: {
                        show: axis_label_display,
                        color: '#fff',
                        backgroundColor: '#666',
                        borderRadius: 3,
                        padding: [3, 5]
                    }
                }
            ],
            series: [
                {
                    type: 'radar',
                    emphasis: {
                        lineStyle: {
                            width: 4
                        }
                    },
                    data: [
                        {
                            value: [100, 8, 0.4, -80, 2000],
                            name: 'Data A'
                        },
                        {
                            value: [60, 5, 0.3, -100, 1500],
                            name: 'Data B',
                            areaStyle: {
                                color: 'rgba(255, 228, 52, 0.6)'
                            }
                        }
                    ]
                },
                {
                    type: 'radar',
                    radarIndex: 1,
                    data: [
                        {
                            value: [120, 118, 130, 100, 99, 70],
                            name: 'Data C',
                            symbol: 'rect',
                            symbolSize: 12,
                            lineStyle: {
                                type: 'dashed'
                            },
                            label: {
                                show: true,
                                color: "#fff",
                                formatter: function (params) {
                                    return params.value;
                                }
                            }
                        },
                        {
                            value: [100, 93, 50, 90, 70, 60],
                            name: 'Data D',
                            areaStyle: {
                                color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
                                    {
                                        color: 'rgba(255, 145, 124, 0.1)',
                                        offset: 0
                                    },
                                    {
                                        color: 'rgba(255, 145, 124, 0.9)',
                                        offset: 1
                                    }
                                ])
                            }
                        }
                    ]
                }
            ]
        };
        let x_axis_data = data.getColumn("axis-x");
        let y_axis_data = data.getColumns("axis-y");
        let y_dimensions = await ShanhaiBI.getSetting("axis-y");
        if (x_axis_data.length && y_axis_data.length) {
            let indicator = [];
            for(let i = 0; i < x_axis_data.length; i++) {
                indicator.push({text: x_axis_data[i]});
            }
            for(let i = 0; i < option.radar.length; i++) {
                option.radar[i].indicator = indicator;
                let series_data = option.series[i].data;
                y_dimensions.forEach((y_dimension, idx) => {
                    series_data[idx].value = data.getColumns("axis-y", i);
                    series_data[idx].name = y_dimension.alias;
                  
                })
            }
        }
        echart.setOption(option);
    }
})();