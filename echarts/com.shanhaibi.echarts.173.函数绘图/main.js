(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "line-color",
                alias: "线段颜色",
                type: "color",
                default: "#5873c6",
            },
            {
                name: "line-width",
                alias: "线条宽度(px)",
                type: "number",
                default: 3,
            },
            {
                name: "grid-line-color",
                alias: "网格线颜色",
                type: "color",
                default: "rgba(255, 255, 255, 0.1)"
            },
            {
                name: "x-start-value",
                alias: "x起始值",
                type: "number",
                default: -200
            },
            {
                name: "x-end-value",
                alias: "x结束值",
                type: "number",
                default: 200
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let x_start_value = Math.ceil(await ShanhaiBI.getSetting("x-start-value"));
    let x_end_value = Math.floor(await ShanhaiBI.getSetting("x-end-value"));
    function func(x) {
        x /= 10;
        return Math.sin(x) * Math.cos(x * 2 + 1) * Math.sin(x * 3 + 2) * 50;
    }
    function generateData() {
        let data = [];
        for (let i = x_start_value; i <= x_end_value; i += 0.1) {
            data.push([i, func(i)]);
        }
        return data;
    }

    let grid_line_color = await ShanhaiBI.getSetting("grid-line-color");
    let option = {
        animation: false,
        grid: {
            top: 40,
            left: 50,
            right: 40,
            bottom: 50
        },
        xAxis: {
            name: 'x',
            minorTick: {
                show: true,
            },
            minorSplitLine: {
                show: true,
                lineStyle: {
                    color: grid_line_color
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: grid_line_color
                }
            }
        },
        yAxis: {
            name: 'y',
            min: -100,
            max: 100,
            minorTick: {
                show: true,
            },
            minorSplitLine: {
                show: true,
                lineStyle: {
                    color: grid_line_color
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: grid_line_color
                }
            }
        },
        dataZoom: [
            {
                show: true,
                type: 'inside',
                filterMode: 'none',
                xAxisIndex: [0],
                startValue: -20,
                endValue: 20
            },
            {
                show: true,
                type: 'inside',
                filterMode: 'none',
                yAxisIndex: [0],
                startValue: -20,
                endValue: 20
            }
        ],
        series: [
            {
                type: 'line',
                showSymbol: false,
                clip: true,
                lineStyle: {
                    color: await ShanhaiBI.getSetting("line-color"),
                    width: await ShanhaiBI.getSetting("line-width"),
                },
                data: generateData()
            }
        ]
    };
    myChart.setOption(option);
})();