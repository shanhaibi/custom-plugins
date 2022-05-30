(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "line-color",
                alias: "线段颜色",
                type: "color",
                default: "#5470c6",
                cluster: {title: "线段设置"}
            },
            {
                name: "line-width",
                alias: "线条宽度(px)",
                type: "number",
                default: 3,
                cluster: {title: "线段设置"}
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
                cluster: {title: "线段设置"}
            },
            {
                name: "symbol-size",
                alias: "端点大小",
                type: "number",
                default: 10,
                cluster: {title: "端点设置"}
            },
            {
                name: "symbol-color",
                alias: "端点颜色",
                type: "color",
                default: "#5470c6",
                cluster: {title: "端点设置"}
            },
            {
                name: "line-shadow-color",
                alias: "线段阴影颜色",
                type: "color",
                default: "rgba(0,0,0,0.3)",
                cluster: {title: "阴影设置"}
            },
            {
                name: "line-shadow-blur",
                alias: "阴影模糊度",
                type: "number",
                default: 10,
                cluster: {title: "阴影设置"}
            },
            {
                name: "line-shadow-offset-y",
                alias: "阴影y轴偏移(px)",
                type: "number",
                default: 8,
                cluster: {title: "阴影设置"}
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let option = {
        legend: {
            data: ['Altitude (km) vs. temperature (°C)'],
            textStyle: {
                color: "#aaa"
            }
        },
        tooltip: {
            trigger: 'axis',
            formatter: 'Temperature : <br/>{b}km : {c}°C'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} °C'
            }
        },
        yAxis: {
            type: 'category',
            axisLine: { onZero: false },
            axisLabel: {
                formatter: '{value} km'
            },
            boundaryGap: false,
            data: ['0', '10', '20', '30', '40', '50', '60', '70', '80']
        },
        series: [
            {
                name: 'Altitude (km) vs. temperature (°C)',
                type: 'line',
                symbolSize: await ShanhaiBI.getSetting("symbol-size"),
                symbol: 'circle',
                smooth: true,
                lineStyle: {
                    type: await ShanhaiBI.getSetting("line-type"),
                    color: await ShanhaiBI.getSetting("line-color"),
                    width: await ShanhaiBI.getSetting("line-width"),
                    shadowColor: await ShanhaiBI.getSetting("line-shadow-color"),
                    shadowBlur: await ShanhaiBI.getSetting("line-shadow-blur"),
                    shadowOffsetY: await ShanhaiBI.getSetting("line-shadow-offset-y")
                },
                itemStyle: {
                    color: await ShanhaiBI.getSetting("symbol-color")
                },
                data: [15, -50, -56.5, -46.5, -22.1, -2.5, -27.7, -55.7, -76.5]
            }
        ]
    };
    myChart.setOption(option);
})();