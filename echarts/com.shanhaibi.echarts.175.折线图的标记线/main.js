(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "line-color",
                alias: "线条颜色",
                type: "color",
                default: "#5873c6",
                cluster: {title: "线条设置"}
            },
            {
                name: "line-width",
                alias: "线条宽度(px)",
                type: "number",
                default: 2,
                cluster: {title: "线条设置"}
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
                cluster: {title: "线条设置"}
            },
            {
                name: "label-color",
                alias: "文本颜色",
                type: "color",
                default: "#aaa",
                cluster: {title: "图形文本设置"}
            },
            {
                name: "label-size",
                alias: "字体大小",
                type: "number",
                default: 16,
                cluster: {title: "图形文本设置"}
            },
            {
                name: "mark-line-color",
                alias: "标记线颜色",
                type: "color",
                default: "#5873c6",
                cluster: {title: "标记线设置"}
            },
            {
                name: "mark-line-width",
                alias: "标记线宽度(px)",
                type: "number",
                default: 2,
                cluster: {title: "标记线设置"}
            },
            {
                name: "mark-line-type",
                alias: "标记线类别",
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
                default: "dashed",
                cluster: {title: "标记线设置"}
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let markLine = [];
    let positions = [
        'start',
        'middle',
        'end',
        'insideStart',
        'insideStartTop',
        'insideStartBottom',
        'insideMiddle',
        'insideMiddleTop',
        'insideMiddleBottom',
        'insideEnd',
        'insideEndTop',
        'insideEndBottom'
    ];
    for (let i = 0; i < positions.length; ++i) {
        markLine.push({
            name: positions[i],
            yAxis: 1.8 - 0.2 * Math.floor(i / 3),
            label: {
                formatter: '{b}',
                position: positions[i],
            }
        });
        if (positions[i] !== 'middle') {
            let name = positions[i] === 'insideMiddle' ? 'insideMiddle / middle' : positions[i];
            markLine.push([
                {
                    name: 'start: ' + positions[i], 
                    coord: [0, 0.3],
                    label: {
                        formatter: name,
                        position: positions[i],
                    }
                },
                {
                    name: 'end: ' + positions[i],
                    coord: [3, 1]
                }
            ]);
        }
    }
    let option = {
        animation: false,
        textStyle: {
            fontSize: 14
        },
        xAxis: {
            data: ['A', 'B', 'C', 'D', 'E'],
            boundaryGap: true,
            splitArea: {
                show: true
            }
        },
        yAxis: {
            max: 2
        },
        series: [
            {
                name: 'line',
                type: 'line',
                stack: 'all',
                symbolSize: 6,
                data: [0.3, 1.4, 1.2, 1, 0.6],
                lineStyle: {
                    type: await ShanhaiBI.getSetting("line-type"),
                    color: await ShanhaiBI.getSetting("line-color"),
                    width: await ShanhaiBI.getSetting("line-width")
                },
                markLine: {
                    data: markLine,
                    label: {
                        distance: [20, 8],
                        color: await ShanhaiBI.getSetting("label-color"),
                        fontSize: await ShanhaiBI.getSetting("label-size")
                    },
                    lineStyle: {
                        type: await ShanhaiBI.getSetting("mark-line-type"),
                        color: await ShanhaiBI.getSetting("mark-line-color"),
                        width: await ShanhaiBI.getSetting("mark-line-width")
                    }
                }
            }
        ],
        grid: {
            top: 30,
            left: 60,
            right: 60,
            bottom: 40
        }
    };
    myChart.setOption(option);
})();