(async function () {
    await ShanhaiBI.initSettings({
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
                name: "symbol",
                alias: "显示端点",
                type: "boolean",
                default: "true",
                cluster: { title: "端点设置" }
            },
            {
                name: "symbol-size",
                alias: "端点大小",
                type: "number",
                default: 5,
                cluster: { title: "端点设置" }
            },
            {
                name: "symbol-color",
                alias: "端点颜色",
                type: "color",
                default: "#fff",
                cluster: { title: "端点设置" }
            },
            {
                name: "axis",
                alias: "显示坐标轴",
                type: "boolean",
                default: true
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let line_color = await ShanhaiBI.getSetting("line-color");
    let symbol_display = await ShanhaiBI.getSetting("symbol");
    let axis_display = await ShanhaiBI.getSetting("axis");
    let data = [];
    for (let i = 0; i <= 100; i++) {
        let theta = (i / 100) * 360;
        let r = 5 * (1 + Math.sin((theta / 180) * Math.PI));
        data.push([r, theta]);
    }
    let option = {
        title: {
            text: 'Two Value-Axes in Polar'
        },
        legend: {
            data: ['line']
        },
        polar: {},
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        angleAxis: {
            show: axis_display,
            type: 'value',
            startAngle: 0
        },
        radiusAxis: { show: axis_display },
        series: [
            {
                coordinateSystem: 'polar',
                name: 'line',
                type: 'line',
                symbol: symbol_display ? "circle" : "none",
                symbolSize: await ShanhaiBI.getSetting("symbol-size"),
                itemStyle: {
                    color: await ShanhaiBI.getSetting("symbol-color"),
                    borderColor: line_color
                },
                lineStyle: {
                    type: await ShanhaiBI.getSetting("line-type"),
                    color: line_color,
                    width: await ShanhaiBI.getSetting("line-width")
                },
                data: data
            }
        ]
    };
    myChart.setOption(option);
})();