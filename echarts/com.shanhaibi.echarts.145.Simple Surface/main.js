(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "rose-color",
                alias: "玫瑰颜色",
                type: "palette",
                default: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            },
            {
                name: "wireframe",
                alias: "显示线框",
                type: "boolean",
                default: true
            },
            {
                name: "axis-pointer",
                alias: "显示坐标轴指示器",
                type: "boolean",
                default: true
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let option = {
        tooltip: {},
        visualMap: {
            show: false,
            dimension: 2,
            min: -1,
            max: 1,
            inRange: {
                color: await ShanhaiBI.getSetting("rose-color")
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
            viewControl: {
                // projection: 'orthographic'
            },
            axisPointer: {
                show: await ShanhaiBI.getSetting("axis-pointer")
            }
        },
        series: [
            {
                type: 'surface',
                wireframe: {
                    show: await ShanhaiBI.getSetting("wireframe")
                },
                equation: {
                    x: {
                        step: 0.05
                    },
                    y: {
                        step: 0.05
                    },
                    z: function (x, y) {
                        if (Math.abs(x) < 0.1 && Math.abs(y) < 0.1) {
                            return '-';
                        }
                        return Math.sin(x * Math.PI) * Math.sin(y * Math.PI);
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
})();