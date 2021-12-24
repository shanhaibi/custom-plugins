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
                name: "axis",
                alias: "显示坐标轴",
                type: "boolean",
                default: true
            },
            {
                name: "particle-type",
                alias: "粒子类型",
                type: "select",
                choices: [
                    {
                        label: "线性粒子",
                        value: "line"
                    },
                    {
                        label: "圆点粒子",
                        value: "point"
                    }
                ],
                default: "point"
            },
            {
                name: "particle-size",
                alias: "粒子大小",
                type: "number",
                default: 5
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let axis_display = await ShanhaiBI.getSetting("axis");
    let noise = new SimplexNoise(Math.random);
    let noise2 = new SimplexNoise(Math.random);
    function generateData() {
        let data = [];
        for (let i = 0; i <= 50; i++) {
            for (let j = 0; j <= 50; j++) {
                let dx = noise.noise2D(i / 30, j / 30);
                let dy = noise2.noise2D(i / 30, j / 30);
                let mag = Math.sqrt(dx * dx + dy * dy);
                valMax = Math.max(valMax, mag);
                valMin = Math.min(valMin, mag);
                data.push([i, j, dx, dy, mag]);
            }
        }
        return data;
    }

    let valMin = Infinity;
    let valMax = -Infinity;
    let data = generateData();
    let option = {
        visualMap: {
            show: false,
            min: valMin,
            max: valMax,
            dimension: 4,
            inRange: {
                color: await ShanhaiBI.getSetting("shape-color")
            }
        },
        xAxis: {
            show: axis_display,
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: 'rgba(255,255,255,0.2)'
                }
            }
        },
        yAxis: {
            show: axis_display,
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: 'rgba(255,255,255,0.2)'
                }
            }
        },
        series: [
            {
                type: 'flowGL',
                data: data,
                particleDensity: 64,
                particleType: await ShanhaiBI.getSetting("particle-type"),
                particleSize: await ShanhaiBI.getSetting("particle-size"),
                itemStyle: {
                    opacity: 0.5
                }
            },
            {
                type: 'custom',
                data: data,
                encode: {
                    x: 0,
                    y: 0
                },
                renderItem: function (params, api) {
                    let x = api.value(0),
                        y = api.value(1),
                        dx = api.value(2),
                        dy = api.value(3);
                    let start = api.coord([x - dx / 2, y - dy / 2]);
                    let end = api.coord([x + dx / 2, y + dy / 2]);
                    return {
                        type: 'line',
                        shape: {
                            x1: start[0],
                            y1: start[1],
                            x2: end[0],
                            y2: end[1]
                        },
                        style: {
                            lineWidth: 2,
                            stroke: '#fff',
                            opacity: 0.2
                        }
                    };
                }
            }
        ]
    };
    myChart.setOption(option);
})();