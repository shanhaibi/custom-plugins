(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-x",
                alias: "x轴字段",
                type: "axis",
                max: 2
            },
            {
                name: "axis-y",
                alias: "y轴字段",
                type: "axis",
                max: 2
            }
        ],
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#5470C6', '#EE6666'],
            },
            {
                name: "line-width",
                alias: "线条宽度(px)",
                type: "number",
                default: 3,
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
                name: "series-shape-type",
                alias: "折线形状",
                type: "select",
                default: "smooth",
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
            },
            {
                name: "point-size",
                alias: "端点大小(px)",
                type: "number",
                default: 5,
            },
            {
                name: "align-with-label",
                alias: "刻度线与标签对齐",
                type: "boolean",
                default: true
            },
            {
                name: "tooltip-text",
                alias: "提示信息文本",
                type: "string",
                default: "Precipitation"
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let colors = await ShanhaiBI.getSetting("shape-color");
    let line_shape_type = await ShanhaiBI.getSetting("series-shape-type");
    let line_style = {
        type: await ShanhaiBI.getSetting("line-type"),
        width: await ShanhaiBI.getSetting("line-width")
    };
    let point_size = await ShanhaiBI.getSetting("point-size");
    let align_with_label = await ShanhaiBI.getSetting("align-with-label");
    let tooltip_text = await ShanhaiBI.getSetting("tooltip-text");
    let rawData = await ShanhaiBI.getData();
    let x_data = rawData.getColumns("axis-x");
    let y_data = rawData.getColumns("axis-y");
    if (!x_data.length || !y_data.length) {
        x_data = [
            ['2015-1', '2015-2', '2015-3', '2015-4', '2015-5', '2015-6', '2015-7', '2015-8', '2015-9', '2015-10', '2015-11', '2015-12'],
            ['2016-1', '2016-2', '2016-3', '2016-4', '2016-5', '2016-6', '2016-7', '2016-8', '2016-9', '2016-10', '2016-11', '2016-12']
        ];
        y_data = [
            [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
            [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7]
        ]
    };
    let x_dims = (await ShanhaiBI.getSetting("axis-x")) || [];
    x_dims.forEach((x_dim, idx) => {
        if (x_dim.type === "date") {
            let x_col = x_data[idx];
            for (let i = 0; i < x_col.length; i++) {
                let date = new Date(x_col[i]);
                x_col[i] = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            }
        }
    })
    let option = {
        color: colors,
        tooltip: {
            trigger: 'none',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            textStyle: {
                color: "#aaa"
            }
        },
        grid: {
            top: 70,
            bottom: 50
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: align_with_label
                },
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: colors[1]
                    }
                },
                axisPointer: {
                    label: {
                        formatter: function (params) {
                            return (
                                'Precipitation  ' +
                                params.value +
                                (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                            );
                        }
                    }
                },
                // prettier-ignore
                data: x_data[1]
            },
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: align_with_label
                },
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: colors[0]
                    }
                },
                axisPointer: {
                    label: {
                        formatter: function (params) {
                            return (
                                tooltip_text + " " + params.value + (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                            );
                        }
                    }
                },
                // prettier-ignore
                data: x_data[0]
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'Precipitation(2015)',
                type: 'line',
                xAxisIndex: 1,
                symbolSize: point_size,
                smooth: line_shape_type === "smooth" ? true : false,
                emphasis: {
                    focus: 'series'
                },
                lineStyle: line_style,
                data: y_data[0]
            },
            {
                name: 'Precipitation(2016)',
                type: 'line',
                symbolSize: point_size,
                smooth: line_shape_type === "smooth" ? true : false,
                emphasis: {
                    focus: 'series'
                },
                lineStyle: line_style,
                data: y_data[1]
            }
        ]
    };
    myChart.setOption(option);
})();