(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
                cluster: { title: "图形设置" }
            },
            {
                name: "line-width",
                alias: "线段宽度",
                type: "number",
                default: 4,
                cluster: { title: "图形设置" }
            },
            {
                name: "auto-rotate",
                alias: "自动旋转",
                type: "boolean",
                default: false,
                cluster: { title: "图形设置" }
            },
            {
                name: "rotate-direction",
                alias: "旋转方向",
                type: "select",
                cluster: { title: "旋转设置" },
                choices: [
                    {
                        label: "顺时针方向",
                        value: "cw"
                    },
                    {
                        label: "逆时针方向",
                        value: "ccw"
                    }
                ],
                default: "ccw",
                cluster: { title: "图形设置" }
            },
            {
                name: "axis",
                alias: "显示坐标轴",
                type: "boolean",
                default: true,
                cluster: { title: "坐标轴设置" }
            },
            {
                name: "axis-label-color",
                alias: "坐标轴文本颜色",
                type: "color",
                default: "#aaa",
                cluster: { title: "坐标轴设置" }
            },
            {
                name: "axis-pointer",
                alias: "显示坐标轴指示器",
                type: "boolean",
                default: true,
                cluster: { title: "坐标轴设置" }
            }

        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let data = [];
    // Parametric curve
    for (let t = 0; t < 25; t += 0.001) {
        let x = (1 + 0.25 * Math.cos(75 * t)) * Math.cos(t);
        let y = (1 + 0.25 * Math.cos(75 * t)) * Math.sin(t);
        let z = t + 2.0 * Math.sin(75 * t);
        data.push([x, y, z]);
    }
    let option = {
        tooltip: {},
        visualMap: {
            show: false,
            min: 0,
            max: 30,
            inRange: {
                color: await ShanhaiBI.getSetting("shape-color")
            }
        },
        xAxis3D: {
            type: 'value'
        },
        yAxis3D: {
            type: 'value'
        },
        zAxis3D: {
            type: 'value'
        },
        grid3D: {
            show: await ShanhaiBI.getSetting("axis"),
            viewControl: {
                projection: 'orthographic',
                autoRotate: await ShanhaiBI.getSetting("auto-rotate"),
                autoRotateDirection: await ShanhaiBI.getSetting("rotate-direction")
            },
            axisLabel: {
                color: await ShanhaiBI.getSetting("axis-label-color"),
                fontSize: 16
            },
            axisPointer: {
                show: await ShanhaiBI.getSetting("axis-pointer")
            }
        },
        series: [
            {
                type: 'line3D',
                data: data,
                lineStyle: {
                    width: await ShanhaiBI.getSetting("line-width")
                }
            }
        ]
    };
    myChart.setOption(option);
})();