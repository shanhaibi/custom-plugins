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
                name: "symbol-size",
                alias: "端点大小",
                type: "number",
                default: 10,
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
                name: "text-color",
                alias: "文本颜色",
                type: "color",
                default: "#333",
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let option = {
        legend: {
            data: ['Altitude (km) vs Temperature (°C)']
        },
        tooltip: {
            trigger: 'axis',
            formatter: 'Temperature : <br/>{b}km : {c}°C',
            confine: true
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
            boundaryGap: true,
            data: ['0', '10', '20', '30', '40', '50', '60', '70', '80']
        },
        graphic: [
            {
                type: 'group',
                rotation: Math.PI / 4,
                bounding: 'raw',
                right: 110,
                bottom: 110,
                z: 100,
                children: [
                    {
                        type: 'rect',
                        left: 'center',
                        top: 'center',
                        z: 100,
                        shape: {
                            width: 400,
                            height: 50
                        },
                        style: {
                            fill: 'rgba(0,0,0,0.3)'
                        }
                    },
                    {
                        type: 'text',
                        left: 'center',
                        top: 'center',
                        z: 100,
                        style: {
                            fill: '#fff',
                            text: 'ECHARTS LINE CHART',
                            font: 'bold 26px sans-serif'
                        }
                    }
                ]
            },
            {
                type: 'group',
                left: '10%',
                top: 'center',
                children: [
                    {
                        type: 'rect',
                        z: 100,
                        left: 'center',
                        top: 'middle',
                        shape: {
                            width: 240,
                            height: 90
                        },
                        style: {
                            fill: '#fff',
                            stroke: '#555',
                            lineWidth: 1,
                            shadowBlur: 8,
                            shadowOffsetX: 3,
                            shadowOffsetY: 3,
                            shadowColor: 'rgba(0,0,0,0.2)'
                        }
                    },
                    {
                        type: 'text',
                        z: 100,
                        left: 'center',
                        top: 'middle',
                        style: {
                            fill: await ShanhaiBI.getSetting("text-color"),
                            width: 220,
                            overflow: 'break',
                            text: 'xAxis represents temperature in °C, yAxis represents altitude in km, An image watermark in the upper right, This text block can be placed in any place',
                            font: '14px Microsoft YaHei'
                        }
                    }
                ]
            }
        ],
        series: [
            {
                name: '高度(km)与气温(°C)变化关系',
                type: 'line',
                smooth: true,
                symbolSize: await ShanhaiBI.getSetting("symbol-size"),
                lineStyle: {
                    type: await ShanhaiBI.getSetting("line-type"),
                    color: await ShanhaiBI.getSetting("line-color"),
                    width: await ShanhaiBI.getSetting("line-width"),
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