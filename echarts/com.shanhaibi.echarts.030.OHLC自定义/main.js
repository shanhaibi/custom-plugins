(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-x",
                type: "axis",
                alias: "x轴数据"
            },
            {
                name: "axis-y",
                alias: "y轴数据",
                type: "axis"
            }
        ],
        "format": [
            {
                name: "legend",
                alias: "显示图例",
                type: "boolean",
                default: true
            },
            {
                name: "split-area",
                alias: "分割区域",
                type: "boolean",
                default: true
            },
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "color",
                default: "#97a8dc"
            }
        ]
    })
    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let option = {
        animation: false,
        legend: {
            bottom: 10,
            show: await ShanhaiBI.getSetting("legend"),
            left: 'center',
            data: ['Dow-Jones index']
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            position: function (pos, params, el, elRect, size) {
                var obj = { top: 10 };
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                return obj;
            }
        },
        axisPointer: {
            link: [{ xAxisIndex: 'all' }]
        },
        grid: [
            {
                left: '10%',
                right: '8%',
                bottom: 150
            }
        ],
        xAxis: [
            {
                type: 'category',
                scale: true,
                boundaryGap: false,
                axisLine: { onZero: false },
                min: 'dataMin',
                max: 'dataMax',
                axisPointer: {
                    z: 100
                },
                axisLabel: {
                    color: "#ccc"
                }
            }
        ],
        yAxis: [
            {
                scale: true,
                axisLabel: {
                    color: "#ccc"
                },
                splitArea: {
                    show: await ShanhaiBI.getSetting("split-area")
                }
            }
        ],
        dataZoom: [
            {
                type: 'inside',
                start: 98,
                end: 100,
                minValueSpan: 10
            },
            {
                show: true,
                type: 'slider',
                bottom: 60,
                start: 98,
                end: 100,
                minValueSpan: 10
            }
        ],
        series: [
            {
                name: 'Dow-Jones index',
                type: 'custom',
                renderItem: renderItem,
                dimensions: ['-', 'open', 'close', 'lowest', 'highest'],
                encode: {
                    x: 0,
                    y: [1, 2, 3, 4],
                    tooltip: [1, 2, 3, 4]
                },
                color: await ShanhaiBI.getSetting("shape-color")
            }
        ]
    }
    let data = await ShanhaiBI.getData();
    let x_axis_data = data.getColumn("axis-x");
    let y_data = data.getColumns("axis-y");
    if (y_data.length < 4 || !x_axis_data.length) {
        $.get(ROOT_PATH + '/data/asset/data/stock-DJI.json', function (rawData) {
            var data = splitData(rawData);
            option.xAxis[0].data = data.categoryData;
            option.series[0].data = data.values;
            myChart.setOption(option, true);
        });
    } else {
        let y_axis_data = [];
        for (let i = 0; i < y_data[0].length; i++) {
            y_axis_data.push([i, y_data[0][i], y_data[1][i], y_data[2][i], y_data[3][i]]);
        }
        option.xAxis[0].data = x_axis_data;
        option.series[0].data = y_axis_data;
        console.log(y_axis_data)
        myChart.setOption(option, true)
    }

    function splitData(rawData) {
        const categoryData = [];
        const values = [];
        for (var i = 0; i < rawData.length; i++) {
            categoryData.push(rawData[i][0]);
            rawData[i][0] = i;
            values.push(rawData[i]);
        }
        return {
            categoryData: categoryData,
            values: values
        };
    }
    function renderItem(params, api) {
        var xValue = api.value(0);
        var openPoint = api.coord([xValue, api.value(1)]);
        var closePoint = api.coord([xValue, api.value(2)]);
        var lowPoint = api.coord([xValue, api.value(3)]);
        var highPoint = api.coord([xValue, api.value(4)]);
        var halfWidth = api.size([1, 0])[0] * 0.35;
        var style = api.style({
            stroke: api.visual('color')
        });
        return {
            type: 'group',
            children: [
                {
                    type: 'line',
                    shape: {
                        x1: lowPoint[0],
                        y1: lowPoint[1],
                        x2: highPoint[0],
                        y2: highPoint[1]
                    },
                    style: style
                },
                {
                    type: 'line',
                    shape: {
                        x1: openPoint[0],
                        y1: openPoint[1],
                        x2: openPoint[0] - halfWidth,
                        y2: openPoint[1]
                    },
                    style: style
                },
                {
                    type: 'line',
                    shape: {
                        x1: closePoint[0],
                        y1: closePoint[1],
                        x2: closePoint[0] + halfWidth,
                        y2: closePoint[1]
                    },
                    style: style
                }
            ]
        };
    }
})();

let option = {
    animation: false,
    legend: {
        bottom: 10,
        left: 'center',
        data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA30']
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        },
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        textStyle: {
            color: '#000'
        },
        position: function (pos, params, el, elRect, size) {
            const obj = {
                top: 10
            };
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
            return obj;
        }
        // extraCssText: 'width: 170px'
    },
    axisPointer: {
        link: [
            {
                xAxisIndex: 'all'
            }
        ],
        label: {
            backgroundColor: '#777'
        }
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: false
            },
            brush: {
                type: ['lineX', 'clear']
            }
        }
    },
    brush: {
        xAxisIndex: 'all',
        brushLink: 'all',
        outOfBrush: {
            colorAlpha: 0.1
        }
    },
    visualMap: {
        show: false,
        seriesIndex: 5,
        dimension: 2,
        pieces: [
            {
                value: 1,
                color: downColor
            },
            {
                value: -1,
                color: upColor
            }
        ]
    },
    grid: [
        {
            left: '10%',
            right: '8%',
            height: '50%'
        },
        {
            left: '10%',
            right: '8%',
            top: '63%',
            height: '16%'
        }
    ],
    xAxis: [
        {
            type: 'category',
            data: data.categoryData,
            scale: true,
            boundaryGap: false,
            axisLine: { onZero: false },
            splitLine: { show: false },
            min: 'dataMin',
            max: 'dataMax',
            axisPointer: {
                z: 100
            }
        },
        {
            type: 'category',
            gridIndex: 1,
            data: data.categoryData,
            scale: true,
            boundaryGap: false,
            axisLine: { onZero: false },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            min: 'dataMin',
            max: 'dataMax'
        }
    ],
    yAxis: [
        {
            scale: true,
            splitArea: {
                show: true
            }
        },
        {
            scale: true,
            gridIndex: 1,
            splitNumber: 2,
            axisLabel: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false }
        }
    ],
    dataZoom: [
        {
            type: 'inside',
            xAxisIndex: [0, 1],
            start: 98,
            end: 100
        },
        {
            show: true,
            xAxisIndex: [0, 1],
            type: 'slider',
            top: '85%',
            start: 98,
            end: 100
        }
    ],
    series: [
        {
            name: 'Dow-Jones index',
            type: 'candlestick',
            data: data.values,
            itemStyle: {
                color: upColor,
                color0: downColor,
                borderColor: undefined,
                borderColor0: undefined
            },
            tooltip: {
                formatter: function (param) {
                    param = param[0];
                    return [
                        'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                        'Open: ' + param.data[0] + '<br/>',
                        'Close: ' + param.data[1] + '<br/>',
                        'Lowest: ' + param.data[2] + '<br/>',
                        'Highest: ' + param.data[3] + '<br/>'
                    ].join('');
                }
            }
        },
        {
            name: 'MA5',
            type: 'line',
            data: calculateMA(5, data),
            smooth: true,
            lineStyle: {
                opacity: 0.5
            }
        },
        {
            name: 'MA10',
            type: 'line',
            data: calculateMA(10, data),
            smooth: true,
            lineStyle: {
                opacity: 0.5
            }
        },
        {
            name: 'MA20',
            type: 'line',
            data: calculateMA(20, data),
            smooth: true,
            lineStyle: {
                opacity: 0.5
            }
        },
        {
            name: 'MA30',
            type: 'line',
            data: calculateMA(30, data),
            smooth: true,
            lineStyle: {
                opacity: 0.5
            }
        },
        {
            name: 'Volume',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: data.volumes
        }
    ]
}
myChart.setOption(option, true);
myChart.dispatchAction({
    type: 'brush',
    areas: [
        {
            brushType: 'lineX',
            coordRange: ['2016-06-02', '2016-06-20'],
            xAxisIndex: 0
        }
    ]
});