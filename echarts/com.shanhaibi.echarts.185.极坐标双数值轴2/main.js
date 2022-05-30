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
                name: "axis",
                alias: "显示坐标轴",
                type: "boolean",
                default: true
            },
            {
                name: "animation-duration",
                alias: "动画持续时间(s)",
                type: "number",
                default: 2
            }
            
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let axis_display = await ShanhaiBI.getSetting("axis");
    let animation_duration = await ShanhaiBI.getSetting("animation-duration");
    let data = [];
    for (let i = 0; i <= 360; i++) {
        let t = (i / 180) * Math.PI;
        let r = Math.sin(2 * t) * Math.cos(2 * t);
        data.push([r, i]);
    }
    let option = {
        title: {
            text: 'Two Value-Axes in Polar'
        },
        legend: {
            data: ['line']
        },
        polar: {
            center: ['50%', '54%']
        },
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
        radiusAxis: {
            show: axis_display,
            min: 0
        },
        series: [
            {
                coordinateSystem: 'polar',
                name: 'line',
                type: 'line',
                showSymbol: false,
                lineStyle: {
                    type: await ShanhaiBI.getSetting("line-type"),
                    color: await ShanhaiBI.getSetting("line-color"),
                    width: await ShanhaiBI.getSetting("line-width")
                },
                data: data
            }
        ],
        animationDuration: animation_duration * 1000
    };
    myChart.setOption(option);
})();