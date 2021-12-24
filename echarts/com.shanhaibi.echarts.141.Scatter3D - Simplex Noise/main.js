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
                default: 16
            },
            {
                name: "axis",
                alias: "显示坐标轴",
                type: "boolean",
                default: true
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
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

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
                symbolSize: [0.5, 25],
                color: await ShanhaiBI.getSetting("shape-color"),
                colorAlpha: [0.2, 1]
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
            axisLine: {
                lineStyle: { color: '#fff' }
            },
            axisPointer: {
                lineStyle: { color: '#fff' }
            },
            axisLabel: {
                color: await ShanhaiBI.getSetting("axis-label-color"),
                fontSize: await ShanhaiBI.getSetting("axis-label-size"),
            },
            viewControl: {
                // autoRotate: true
            }
        },
        series: [
            {
                type: 'scatter3D',
                data: data,
                label: {
                    color: await ShanhaiBI.getSetting("label-color"),
                    fontSize: await ShanhaiBI.getSetting("label-size")
                }
            }
        ]
    };
    myChart.setOption(option);

    function generateData(theta, min, max) {
        let data = [];
        for (let i = 0; i <= 20; i++) {
            for (let j = 0; j <= 20; j++) {
                for (let k = 0; k <= 20; k++) {
                    let value = noise.noise3D(i / 10, j / 10, k / 10);
                    valMax = Math.max(valMax, value);
                    valMin = Math.min(valMin, value);
                    data.push([i, j, k, value * 2 + 4]);
                }
            }
        }
        return data;
    }
})();