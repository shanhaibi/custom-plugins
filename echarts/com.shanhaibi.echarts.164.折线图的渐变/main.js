(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-x",
                alias: "x轴字段",
                type: "axis"
            },
            {
                name: "axis-y",
                alias: "y轴字段",
                type: "axis"
            }
        ],
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#5470c6', '#91cc75']
            },
            {
                name: "line-width",
                alias: "线条宽度",
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
                name: "y-gradient-start",
                alias: "渐变起始值",
                type: "number",
                default: 0,
                cluster: {title: "y轴渐变区间"}
            },
            {
                name: "y-gradient-end",
                alias: "渐变结束值",
                type: "number",
                default: 400,
                cluster: {title: "y轴渐变区间"}
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let line_shape_type = await ShanhaiBI.getSetting("series-shape-type");
    let line_style = {
        type: await ShanhaiBI.getSetting("line-type"),
        width: await ShanhaiBI.getSetting("line-width")
    };
    let rawData = await ShanhaiBI.getData();
    let x_data = rawData.getColumn("axis-x");
    let y_data = rawData.getColumn("axis-y");
    if (!x_data.length || !y_data.length) {
        x_data = [
            "2000-06-05", "2000-06-06", "2000-06-07", "2000-06-08", "2000-06-09", "2000-06-10", "2000-06-11", "2000-06-12", "2000-06-13",
            "2000-06-14", "2000-06-15", "2000-06-16", "2000-06-17", "2000-06-18", "2000-06-19", "2000-06-20", "2000-06-21", "2000-06-22",
            "2000-06-23", "2000-06-24", "2000-06-25", "2000-06-26", "2000-06-27", "2000-06-28", "2000-06-29", "2000-06-30", "2000-07-01",
            "2000-07-02", "2000-07-03", "2000-07-04", "2000-07-05", "2000-07-06", "2000-07-07", "2000-07-08", "2000-07-09", "2000-07-10",
            "2000-07-11", "2000-07-12", "2000-07-13", "2000-07-14", "2000-07-15", "2000-07-16", "2000-07-17", "2000-07-18", "2000-07-19", 
            "2000-07-20", "2000-07-21", "2000-07-22", "2000-07-23", "2000-07-24", 
        ];
        y_data = [
            116, 129, 135, 86, 73, 85, 73, 68, 92, 130, 245, 139, 115, 111, 309, 206, 137, 128, 85, 94, 71, 106, 84, 93, 85, 73, 83, 125, 107, 82, 44, 72,
            106, 107, 66, 91, 92, 113, 107, 131, 111, 64, 69, 88, 77, 83, 111, 57, 55, 60
        ];
    }
    let option = {
        // Make gradient line here
        visualMap: [
            {
                show: false,
                type: 'continuous',
                seriesIndex: 0,
                color: shape_color,
                min: await ShanhaiBI.getSetting("y-gradient-start"),
                max: await ShanhaiBI.getSetting("y-gradient-end")
            },
            {
                show: false,
                type: 'continuous',
                seriesIndex: 1,
                dimension: 0,
                color: shape_color,
                min: 0,
                max: x_data.length - 1
            }
        ],
        title: [
            {
                left: 'center',
                text: 'Gradient along the y axis'
            },
            {
                top: '55%',
                left: 'center',
                text: 'Gradient along the x axis'
            }
        ],
        tooltip: {
            trigger: 'axis'
        },
        xAxis: [
            {
                data: x_data
            },
            {
                data: x_data,
                gridIndex: 1
            }
        ],
        yAxis: [
            {},
            {
                gridIndex: 1
            }
        ],
        grid: [
            {
                bottom: '60%'
            },
            {
                top: '60%'
            }
        ],
        series: [
            {
                type: 'line',
                showSymbol: false,
                data: y_data,
                smooth: line_shape_type === "smooth" ? true : false,
                lineStyle: line_style
            },
            {
                type: 'line',
                showSymbol: false,
                data: y_data,
                xAxisIndex: 1,
                yAxisIndex: 1,
                smooth: line_shape_type === "smooth" ? true : false,
                lineStyle: line_style
            }
        ]
    };
    myChart.setOption(option);
})();