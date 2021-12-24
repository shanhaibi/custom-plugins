(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
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
                name: "axis",
                alias: "显示坐标系",
                type: "boolean",
                default: true,
            },
            {
                name: "auto-rotate",
                alias: "自动旋转",
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
                color: await ShanhaiBI.getSetting("shape-color")
            }
        },
        xAxis3D: {},
        yAxis3D: {},
        zAxis3D: {},
        grid3D: {
            show: await ShanhaiBI.getSetting("axis"),
            viewControl: {
                autoRotate: await ShanhaiBI.getSetting("auto-rotate")
            },
        },
        series: [
            {
                type: 'surface',
                parametric: true,
                // shading: 'albedo',
                wireframe: {
                    show: await ShanhaiBI.getSetting("wireframe")
                },
                
                parametricEquation: {
                    u: {
                        min: -Math.PI,
                        max: Math.PI,
                        step: Math.PI / 20
                    },
                    v: {
                        min: 0,
                        max: Math.PI,
                        step: Math.PI / 20
                    },
                    x: function (u, v) {
                        return Math.sin(v) * Math.sin(u);
                    },
                    y: function (u, v) {
                        return Math.sin(v) * Math.cos(u);
                    },
                    z: function (u, v) {
                        return Math.cos(v);
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
})();