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
                name: "line-color",
                alias: "线条颜色",
                type: "color",
                default: "#5470C6",
                cluster: { title: "线条设置" }
            },
            {
                name: "line-width",
                alias: "线条宽度(px)",
                type: "number",
                default: 4,
                cluster: { title: "线条设置" }
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
                default: "dashed",
                cluster: { title: "线条设置" }
            },
            {
                name: "symbol-shape",
                alias: "标记图形",
                type: "select",
                choices: [{
                    label: "实心圆",
                    value: "circle"
                }, {
                    label: "空心圆",
                    value: "emptyCircle"
                }, {
                    label: "矩形",
                    value: "rect"
                }, {
                    label: "空",
                    value: "none"
                }, {
                    label: "三角形",
                    value: "triangle"
                }],
                default: "triangle",
                cluster: { title: "标记图形设置" }
            },
            {
                name: "symbol-size",
                alias: "图形大小",
                type: "number",
                default: 20,
                cluster: { title: "标记图形设置" }
            },
            {
                name: "symbol-fill-color",
                alias: "图形颜色",
                type: "color",
                default: "#ffff00",
                cluster: { title: "标记图形设置" }
            },
            {
                name: "symbol-border-width",
                alias: "图形边框宽度",
                type: "number",
                default: 3,
                cluster: { title: "标记图形设置" }
            },
            {
                name: "symbol-border-color",
                alias: "图形边框颜色",
                type: "color",
                default: "#ee6666",
                cluster: { title: "标记图形设置" }
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let rawData = await ShanhaiBI.getData();
    let x_data = rawData.getColumn("axis-x");
    let y_data = rawData.getColumn("axis-y");
    if (!x_data.length || !y_data.length) {
        x_data = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        y_data = [120, 200, 150, 80, 70, 110, 130];
    }
    let option = {
        tooltip: {},
        xAxis: {
            type: 'category',
            data: x_data
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: y_data,
                type: 'line',
                symbol: await ShanhaiBI.getSetting("symbol-shape"),
                symbolSize: await ShanhaiBI.getSetting("symbol-size"),
                lineStyle: {
                    color: await ShanhaiBI.getSetting("line-color"),
                    width: await ShanhaiBI.getSetting("line-width"),
                    type: await ShanhaiBI.getSetting("line-type")
                },
                itemStyle: {
                    borderWidth: await ShanhaiBI.getSetting("symbol-border-width"),
                    borderColor: await ShanhaiBI.getSetting("symbol-border-color"),
                    color: await ShanhaiBI.getSetting("symbol-fill-color")
                }
            }
        ]
    };
    myChart.setOption(option);
})();