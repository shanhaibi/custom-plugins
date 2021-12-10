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
                default: ["#ff6e76", "#fddd60", "#58d9f9", "#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de"]
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
                default: 12
            },
            {
                name: "title-color",
                alias: "标题颜色",
                type: "color",
                default: "#aaa"
            },
            {
                name: "title-size",
                alias: "字体颜色",
                type: "number",
                default: 30
            },
            {
                name: "max-scale",
                alias: "最大刻度",
                type: "number",
                default: 1
            },
            {
                name: "min-scale",
                alias: "最小刻度",
                type: "number",
                default: 0
            },
            {
                name: "unit",
                alias: "单位",
                type: "string",
                default: "分"
            }
        ]
    })

    var dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let rawData = await ShanhaiBI.getData();
    let data = rawData.getColumn("axis-value");
    let value = data.length ? data[0] : 0.7;
    let name = "Grade Rating";
    if (data.length) {
        let axis_value = await ShanhaiBI.getSetting("axis-value");
        name = axis_value[0].alias;
    }
    let pointer_length = await ShanhaiBI.getSetting("pointer-length");
    let axis_line_color = await ShanhaiBI.getSetting("axis-line-color");
    let color1 = axis_line_color[0] ? axis_line_color[0] : "#ff6e76";
    let color2 = axis_line_color[1] ? axis_line_color[1] : "#fddd60";
    let color3 = axis_line_color[2] ? axis_line_color[2] : "#58d9f9";
    let color4 = axis_line_color[3] ? axis_line_color[3] : "#7cffb2";
    let unit = await ShanhaiBI.getSetting("unit");
    let max_value = await ShanhaiBI.getSetting("max-scale");

    let option = {
        series: [
            {
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                splitNumber: 8,
                min: await ShanhaiBI.getSetting("min-scale"),
                max: max_value,
                pointer: {
                    icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                    length: pointer_length + "%",
                    width: 20,
                    itemStyle: {
                        color: await ShanhaiBI.getSetting("pointer-color")
                    },
                    offsetCenter: [0, '-60%']
                },
                axisLine: {
                    lineStyle: {
                        width: 6,
                        color: [
                            [0.25, color1],
                            [0.5, color2],
                            [0.75, color3],
                            [1, color4]
                        ]
                    }
                },
                axisTick: {
                    length: 12,
                    lineStyle: {
                        color: '#fff',
                        width: 2
                    }
                },
                splitLine: {
                    length: 20,
                    lineStyle: {
                        color: '#fff',
                        width: 5
                    }
                },
                axisLabel: {
                    show: true,
                    color: "#aaa",
                    distance: -60,
                    fontSize: 20,
                    formatter: value => {
                        if (value === (max_value * 7 / 8)) {
                            return "A";
                        } else if (value === (max_value * 5 / 8)) {
                            return "B";
                        } else if (value === (max_value * 3 / 8)) {
                            return "C";
                        } else if (value === (max_value / 8)) {
                            return "D";
                        }
                        return "";
                    }
                },
                title: {
                    offsetCenter: [0, '-20%'],
                    fontSize: await ShanhaiBI.getSetting("title-size"),
                    color: await ShanhaiBI.getSetting("title-color"),
                },
                data: [
                    {
                        value,
                        name
                    }
                ],
                detail: {
                    fontSize: 50,
                    offsetCenter: [0, '0%'],
                    valueAnimation: true,
                    formatter: value => {
                        if(max_value <= 1) {
                            return Math.round(value * 100) + unit;
                        }
                        return value + unit;
                    },
                    color: await ShanhaiBI.getSetting("data-color"),
                },

            }
        ]
    };
    myChart.setOption(option);
})();