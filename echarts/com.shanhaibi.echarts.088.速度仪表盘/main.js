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
                name: "round-cap",
                alias: "进度条样式",
                type: "select",
                choices: [
                    {
                        label: "直角",
                        value: "right-angle"
                    },
                    {
                        label: "圆角",
                        value: "fillet"
                    }
                ],
                default: "right-angle"
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
                default: 120
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
    let  value = data.length ? data[0] : 50;

    let pointer_length = await ShanhaiBI.getSetting("pointer-length");
    let animation_duration = await ShanhaiBI.getSetting("animation-duration");
    let round_cap = await ShanhaiBI.getSetting("round-cap");

    let option = {
        series: [
            {
                name: 'Pressure',
                type: 'gauge',
                max: await ShanhaiBI.getSetting("max-scale"),
                min: await ShanhaiBI.getSetting("min-scale"),
                progress: {
                    show: true,
                    roundCap: round_cap === "fillet" ? true : false,
                    itemStyle: {
                        color: await ShanhaiBI.getSetting("progress-color")
                    },
                    width: 18
                },
                pointer: {
                    length: pointer_length + "%",
                    width: 16,
                    itemStyle: {
                        color: await ShanhaiBI.getSetting("pointer-color")
                    },
                    offsetCenter: [0, '5%']
                },
                axisLine: {
                    lineStyle: {
                        width: 18,
                        color: [[1, await ShanhaiBI.getSetting("axis-line-color")]]
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    length: 15,
                    lineStyle: {
                        width: 2,
                        color: '#999'
                    }
                },
                axisLabel: {
                    color: "#aaa",
                    distance: 25,
                    fontSize: 20
                },
                anchor: {
                    show: true,
                    showAbove: true,
                    size: 25,
                    itemStyle: {
                        borderWidth: 10
                    }
                },
                data: [
                    {
                        value,
                    }
                ],
                animationDuration: animation_duration * 1000,
                detail: {
                    valueAnimation: true,
                    fontSize: 80,
                    color: await ShanhaiBI.getSetting("data-color"),
                    offsetCenter: [0, '70%']
                },

            }
        ]
    };
    myChart.setOption(option);
})();