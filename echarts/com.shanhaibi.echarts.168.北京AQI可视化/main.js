(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "线条颜色",
                type: "palette",
                default: ["#93CE07", "#FBDB0F", "#FC7D02", "#FD0100", "#AA069F", "#AC3B2A"]
            },
            {
                name: "line-width",
                alias: "线条宽度",
                type: "number",
                default: 3,
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
            },
            {
                name: "mark-line-color",
                alias: "提示线颜色",
                type: "color",
                default: "#333",
            },
            {
                name: "y-split-line",
                alias: "显示分割线",
                type: "boolean",
                default: true
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let line_style = {
        type: await ShanhaiBI.getSetting("line-type"),
        width: await ShanhaiBI.getSetting("line-width")
    };
    let mark_line_color = await ShanhaiBI.getSetting("mark-line-color");
    let y_split_line_display = await ShanhaiBI.getSetting("y-split-line")
    let visual_map_pieces = [
        {
            gt: 0,
            lte: 50
        },
        {
            gt: 50,
            lte: 100
        },
        {
            gt: 100,
            lte: 150
        },
        {
            gt: 150,
            lte: 200
        },
        {
            gt: 200,
            lte: 300
        },
        {
            gt: 300
        }
    ];
    visual_map_pieces = visual_map_pieces.map((piece, idx) => {
        return {
            ...piece,
            color: shape_color[idx] ? shape_color[idx] : "#1890ff"
        }
    })
    $.get(ROOT_PATH + '/data/asset/data/aqi-beijing.json', function (data) {
        let option = {
            title: {
                text: 'Beijing AQI',
                left: '1%'
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '5%',
                right: '15%',
                bottom: '10%'
            },
            xAxis: {
                data: data.map(function (item) {
                    return item[0];
                })
            },
            yAxis: {
                splitLine: {
                    show: y_split_line_display
                }
            },
            toolbox: {
                right: 10,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                }
            },
            dataZoom: [
                {
                    startValue: '2014-06-01'
                },
                {
                    type: 'inside'
                }
            ],
            visualMap: {
                top: 50,
                right: 10,
                pieces: visual_map_pieces,
                textStyle: {
                    color: "#aaa"
                },
                outOfRange: {
                    color: '#999'
                }
            },
            series: {
                name: 'Beijing AQI',
                type: 'line',
                data: data.map(function (item) {
                    return item[1];
                }),
                lineStyle: line_style,
                markLine: {
                    silent: true,
                    lineStyle: {
                        color: mark_line_color
                    },
                    label: {
                        color: "#aaa"
                    },
                    data: [
                        {
                            yAxis: 50
                        },
                        {
                            yAxis: 100
                        },
                        {
                            yAxis: 150
                        },
                        {
                            yAxis: 200
                        },
                        {
                            yAxis: 300
                        }
                    ]
                }
            }
        };
        myChart.setOption(option);
    });

})();