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
            },
        ],
        "format": [
            {
                name: "line-color",
                alias: "线段颜色",
                type: "color",
                default: "#5470c6",
                cluster: { title: "线段设置" }
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
                cluster: { title: "线段设置" }
            },
            {
                name: "symbol-size",
                alias: "端点大小",
                type: "number",
                default: 20,
                cluster: { title: "端点设置" }
            },
            {
                name: "symbol-color",
                alias: "端点颜色",
                type: "color",
                default: "#5470c6",
                cluster: { title: "端点设置" }
            },
            {
                name: "x-min-scale",
                alias: "x轴最小刻度",
                type: "number",
                default: -60,
                cluster: {title: "刻度轴设置"}
            },
            {
                name: "x-max-scale",
                alias: "x轴最大刻度",
                type: "number",
                default: 20,
                cluster: {title: "刻度轴设置"}
            },
            {
                name: "y-min-scale",
                alias: "y轴最小刻度",
                type: "number",
                default: 0,
                cluster: {title: "刻度轴设置"}
            },
            {
                name: "y-max-scale",
                alias: "y轴最大刻度",
                type: "number",
                default: 40,
                cluster: {title: "刻度轴设置"}
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let line_color = await ShanhaiBI.getSetting("line-color");
    let series_shape_type = await ShanhaiBI.getSetting("series-shape-type");
    let symbolSize = await ShanhaiBI.getSetting("symbol-size");
    let x_min_scale = await ShanhaiBI.getSetting("x-min-scale");
    let x_max_scale = await ShanhaiBI.getSetting("x-max-scale");
    let y_min_scale = await ShanhaiBI.getSetting("y-min-scale");
    let y_max_scale = await ShanhaiBI.getSetting("y-max-scale");
    let rawData = await ShanhaiBI.getData();
    let x_data = rawData.getColumn("axis-x");
    let y_data = rawData.getColumn("axis-y");
    let data = [
        [15, 0],
        [-50, 10],
        [-56.5, 20],
        [-46.5, 30],
        [-22.1, 40]
    ];
    if (x_data.length && y_data.length) {
        data = [];
        for (let i = 0; i < x_data.length; i++) {
            x_min_scale = x_min_scale < x_data[i] ? x_min_scale : x_data[i];
            x_max_scale = x_max_scale > x_data[i] ? x_max_scale : x_data[i];
            y_min_scale = y_min_scale < y_data[i] ? y_min_scale : y_data[i];
            y_max_scale = y_max_scale > y_data[i] ? y_max_scale : y_data[i];
            data.push([x_data[i], y_data[i]]);
        }
    }
    
    let option = {
        title: {
            text: 'Click to Add Points'
        },
        tooltip: {
            formatter: function (params) {
                let data = params.data || [0, 0];
                return data[0].toFixed(2) + ', ' + data[1].toFixed(2);
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            min: x_min_scale,
            max: x_max_scale,
            type: 'value',
            axisLine: { onZero: false }
        },
        yAxis: {
            min: y_min_scale,
            max: y_max_scale,
            type: 'value',
            axisLine: { onZero: false }
        },
        series: [
            {
                id: 'a',
                type: 'line',
                smooth: series_shape_type === "smooth" ? true : false,
                symbol: "circle",
                itemStyle: {
                    color: await ShanhaiBI.getSetting("symbol-color"),
                    borderColor: line_color
                },
                lineStyle: {
                    type: await ShanhaiBI.getSetting("line-type"),
                    color: line_color,
                    width: await ShanhaiBI.getSetting("line-width"),
                },
                symbolSize: symbolSize,
                data: data
            }
        ]
    };
    let zr = myChart.getZr();
    zr.on('click', function (params) {
        let pointInPixel = [params.offsetX, params.offsetY];
        let pointInGrid = myChart.convertFromPixel('grid', pointInPixel);
        if (myChart.containPixel('grid', pointInPixel)) {
            data.push(pointInGrid);
            myChart.setOption({
                series: [
                    {
                        id: 'a',
                        data: data
                    }
                ]
            });
        }
    });
    zr.on('mousemove', function (params) {
        let pointInPixel = [params.offsetX, params.offsetY];
        zr.setCursorStyle(
            myChart.containPixel('grid', pointInPixel) ? 'copy' : 'default'
        );
    });
    myChart.setOption(option);
})();