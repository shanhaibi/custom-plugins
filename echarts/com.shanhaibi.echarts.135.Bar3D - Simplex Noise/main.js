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
                name: "label-color",
                alias: "图形文本颜色",
                type: "color",
                default: "#900"
            },
            {
                name: "label-size",
                alias: "图形文本大小(px)",
                type: "number",
                default: 20
            },
            {
                name: "axis-label-color",
                alias: "坐标轴文本颜色",
                type: "color",
                default: "#aaa"
            },
            {
                name: "axis-label-size",
                alias: "坐标轴文本大小(px)",
                type: "number",
                default: 16
            },
            {
                name: "axis-label-weight",
                alias: "坐标轴文本加粗",
                type: "boolean",
                default: true
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let axis_label_weight = await ShanhaiBI.getSetting("axis-label-weight");
    let noise = new SimplexNoise(Math.random);
   
    let valMin = Infinity;
    let valMax = -Infinity;
    let data = generateData(2, -5, 5);
    let option = {
        visualMap: {
            show: false,
            min: 2,
            max: 6,
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
            type: 'value',
            max: 10,
            min: 0
        },
        grid3D: {
            axisLine: {
                lineStyle: { color: '#fff' }
            },
            axisPointer: {
                lineStyle: { color: '#fff' }
            },
            axisLabel: {
                color: await ShanhaiBI.getSetting("axis-label-color"),
                fontSize: await ShanhaiBI.getSetting("axis-label-size"),
                fontWeight: axis_label_weight ? "bolder" : "normal"
            },
            light: {
                main: {
                    shadow: true,
                    quality: 'ultra',
                    intensity: 1.5
                }
            }
        },
        series: [
            {
                type: 'bar3D',
                data: data,
                shading: 'lambert',
                label: {
                    formatter: function (param) {
                        return param.value[2].toFixed(1);
                    },
                    color: await ShanhaiBI.getSetting("label-color"),
                    fontSize: await ShanhaiBI.getSetting("label-size")
                }
            }
        ]
    };
    myChart.setOption(option);

    function generateData(theta, min, max) {
        let data = [];
        for (let i = 0; i <= 50; i++) {
            for (let j = 0; j <= 50; j++) {
                let value = noise.noise2D(i / 20, j / 20);
                valMax = Math.max(valMax, value);
                valMin = Math.min(valMin, value);
                data.push([i, j, value * 2 + 4]);
            }
        }
        return data;
    }
})();