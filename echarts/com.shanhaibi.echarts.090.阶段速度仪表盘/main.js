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
                name: "axis-line-color",
                alias: "刻度线颜色",
                type: "palette",
                default: ["#67e0e3", "#37a2da", "#fd666d", "#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de"]
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
                name: "max-scale",
                alias: "最大刻度",
                type: "number",
                default: 100
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
    let value = data.length ? data[0] : 70;
    let pointer_length = await ShanhaiBI.getSetting("pointer-length");
    let axis_line_color = await ShanhaiBI.getSetting("axis-line-color");
    let color1 = axis_line_color[0] ? axis_line_color[0] : "#67e0e3";
    let color2 = axis_line_color[1] ? axis_line_color[1] : "#37a2da";
    let color3 = axis_line_color[2] ? axis_line_color[2] : "#fd666d";
    let min_value = await ShanhaiBI.getSetting("min-scale");
    let max_value = await ShanhaiBI.getSetting("max-scale");

    let option = {
        series: [
            {
                name: 'Pressure',
                type: 'gauge',
                max: max_value,
                min: min_value,
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
                        width: 30,
                        color: [
                            [0.3, color1],
                            [0.7, color2],
                            [1, color3]
                        ]
                    }
                },
                axisTick: {
                    distance: -30,
                    length: 8,
                    lineStyle: {
                        color: '#fff',
                        width: 2
                    }
                },
                splitLine: {
                    distance: -30,
                    length: 30,
                    lineStyle: {
                        color: '#fff',
                        width: 4
                    }
                },
                axisLabel: {
                    color: "#aaa",
                    distance: 40,
                    fontSize: 20
                },
                data: [
                    {
                        value,
                    }
                ],
                detail: {
                    valueAnimation: true,
                    formatter: '{value} km/h',
                    color: await ShanhaiBI.getSetting("data-color"),
                },

            }
        ]
    };
    myChart.setOption(option);

    setInterval(function () {
        let value = (Math.random() * max_value + min_value).toFixed(2);
        myChart.setOption({
            series: [{
                data: [{ value }]
            }]
        });
    }, 2000);
})();