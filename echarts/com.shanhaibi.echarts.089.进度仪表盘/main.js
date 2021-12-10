(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-value",
                alias: "取值字段",
                type: "axis"
            }
        ],
        "format": [
            {
                name: "data-color",
                alias: "数据颜色",
                type: "color",
                default: "#1890ff"
            },
            {
                name: "progress-color",
                alias: "进度条颜色",
                type: "color",
                default: "#1980ff"
            },
            {
                name: "axis-line-color",
                alias: "刻度线颜色",
                type: "color",
                default: "#ddd"
            },
            {
                name: "pointer-color",
                alias: "指针颜色",
                type: "color",
                default: "#1980ff"
            },
            {
                name: "pointer-length",
                alias: "指针长度(%)",
                type: "number",
                default: 60
            },
            {
                name: "animation-duration",
                alias: "动画持续时间(s)",
                type: "number",
                default: 1
            },
            {
                name: "max-scale",
                alias: "最大刻度",
                type: "number",
                default: 240
            },
            {
                name: "min-scale",
                alias: "最小刻度",
                type: "number",
                default: 0
            }
        ]
    })

    var dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let rawData = await ShanhaiBI.getData();
    let data = rawData.getColumn("axis-value");
    let value = data.length ? data[0] : 100;

    let pointer_length = await ShanhaiBI.getSetting("pointer-length");
    let animation_duration = await ShanhaiBI.getSetting("animation-duration");

    let option = {
        series: [
            {
                name: 'Pressure',
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                max: await ShanhaiBI.getSetting("max-scale"),
                min: await ShanhaiBI.getSetting("min-scale"),
                splitLine: 12,
                itemStyle: {
                    shadowColor: 'rgba(0,138,255,0.45)',
                    shadowBlur: 10,
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                },
                progress: {
                    show: true,
                    roundCap: true,
                    itemStyle: {
                        color: await ShanhaiBI.getSetting("progress-color")
                    },
                    width: 18
                },
                pointer: {
                    icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                    length: pointer_length + "%",
                    width: 16,
                    itemStyle: {
                        color: await ShanhaiBI.getSetting("pointer-color")
                    },
                    offsetCenter: [0, '5%']
                },
                axisLine: {
                    roundCap: true,
                    lineStyle: {
                        width: 18,
                        color: [[1, await ShanhaiBI.getSetting("axis-line-color")]]
                    }
                },
                axisTick: {
                    splitNumber: 2,
                    lineStyle: {
                        width: 2,
                        color: '#999'
                    }
                },
                splitLine: {
                    length: 12,
                    lineStyle: {
                        width: 3,
                        color: '#999'
                    }
                },
                axisLabel: {
                    color: "#999",
                    distance: 30,
                    fontSize: 20
                },
                data: [
                    {
                        value,
                    }
                ],
                animationDuration: animation_duration * 1000,
                detail: {
                    valueAnimation: true,
                    borderColor: '#999',
                    borderWidth: 2,
                    width: '60%',
                    lineHeight: 40,
                    height: 40,
                    borderRadius: 8,
                    padding: 10,
                    offsetCenter: [0, '35%'],
                    formatter: function (value) {
                        return '{value|' + value.toFixed(0) + '}{unit|km/h}';
                    },
                    rich: {
                        value: {
                            fontSize: 50,
                            fontWeight: 'bolder',
                            color: await ShanhaiBI.getSetting("data-color"),
                            padding: [0, 0, -10, 0]
                        },
                        unit: {
                            fontSize: 20,
                            color: '#999',
                            padding: [0, 0, -20, 10]
                        }
                    },
                },

            }
        ]
    };
    myChart.setOption(option);
})();