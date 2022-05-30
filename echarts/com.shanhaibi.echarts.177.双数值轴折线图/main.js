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
            },
            {
                name: "line-width",
                alias: "线条宽度(px)",
                type: "number",
                default: 2,
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
                name: "symbol",
                alias: "显示端点",
                type: "boolean",
                default: true,
                cluster: {title: "端点设置"}
            },
            {
                name: "symbol-size",
                alias: "端点大小(px)",
                type: "number",
                default: 5,
                cluster: {title: "端点设置"}
            },
            {
                name: "symbol-color",
                alias: "端点颜色",
                type: "color",
                default: "#5470C6",
                cluster: {title: "端点设置"}
            },
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let symbol_display = await ShanhaiBI.getSetting("symbol");
    let rawData = await ShanhaiBI.getData();
    let x_data = rawData.getColumn("axis-x");
    let y_data = rawData.getColumn("axis-y");
    if (!x_data.length || !y_data.length) {
        x_data = [10, 50, 40];
        y_data = [40, 100, 20];
    };
    let data = [];
    for(let i = 0; i < x_data.length; i++) {
        data.push([x_data[i], y_data[i]])
    }
    let option = {
        tooltip: {},
        xAxis: {},
        yAxis: {},
        series: [
            {
                data: data,
                type: 'line',
                symbol: symbol_display ? "circle" : "none",
                symbolSize: await ShanhaiBI.getSetting("symbol-size"),
                lineStyle: {
                    type: await ShanhaiBI.getSetting("line-type"),
                    color: await ShanhaiBI.getSetting("line-color"),
                    width: await ShanhaiBI.getSetting("line-width")
                },
                itemStyle: {
                    color: await ShanhaiBI.getSetting("symbol-color")
                }
            }
        ]
    };
    myChart.setOption(option);
})();