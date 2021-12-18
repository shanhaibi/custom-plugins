(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-x",
                alias: "x轴字段",
                type: "axis"
            },
            {
                name: "axis-y",
                alias: "y轴字段",
                type: "axis"
            },
        ],
        "format": [
            {
                name: "circle-color",
                alias: "端点颜色",
                type: "color",
                default: "#fff"
            },
            {
                name: "shape-size",
                alias: "图形大小",
                type: "number",
                default: 20,
            },
            {
                name: "line-color",
                alias: "线段颜色",
                type: "color",
                default: "#1890ff"
            },
            {
                name: "x-min-scale",
                alias: "x轴最小刻度",
                type: "number",
                default: -100
            },
            {
                name: "x-max-scale",
                alias: "x轴最大刻度",
                type: "number",
                default: 70
            },
            {
                name: "y-min-scale",
                alias: "y轴最小刻度",
                type: "number",
                default: -30
            },
            {
                name: "y-max-scale",
                alias: "y轴最大刻度",
                type: "number",
                default: 60
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let symbolSize = await ShanhaiBI.getSetting("shape-size");
    let line_color = await ShanhaiBI.getSetting("line-color");
    let rawData = await ShanhaiBI.getData();
    let x_data = rawData.getColumn("axis-x");
    let y_data = rawData.getColumn("axis-y");
    let data = [];
    if (x_data.length && y_data.length) {
        for (let i = 0; i < x_data.length; i++) {
            data.push([x_data[i], y_data[i]]);
        }
    } else {
        data = [
            [40, -10],
            [-30, -5],
            [-76.5, 20],
            [-63.5, 40],
            [-22.1, 50]
        ];
    }
    let option = {
        title: {
            text: 'Try Dragging these Points',
            left: 'center'
        },
        tooltip: {
            triggerOn: 'none',
            formatter: function (params) {
                return (
                    'X: ' +
                    params.data[0].toFixed(2) +
                    '<br>Y: ' +
                    params.data[1].toFixed(2)
                );
            }
        },
        grid: {
            top: '8%',
            bottom: '12%'
        },
        xAxis: {
            min: await ShanhaiBI.getSetting("x-min-scale"),
            max: await ShanhaiBI.getSetting("x-max-scale"),
            type: 'value',
            axisLine: { onZero: false }
        },
        yAxis: {
            min: await ShanhaiBI.getSetting("y-min-scale"),
            max: await ShanhaiBI.getSetting("y-max-scale"),
            type: 'value',
            axisLine: { onZero: false }
        },
        series: [
            {
                id: 'a',
                type: 'line',
                smooth: true,
                symbol: "circle",
                symbolSize: symbolSize,
                itemStyle: {
                    color: await ShanhaiBI.getSetting("circle-color"),
                    borderColor: line_color
                },
                lineStyle: {
                    color: line_color,
                },
                data: data
            }
        ]
    };
    setTimeout(function () {
        // Add shadow circles (which is not visible) to enable drag.
        myChart.setOption({
            graphic: data.map(function (item, dataIndex) {
                return {
                    type: 'circle',
                    position: myChart.convertToPixel('grid', item),
                    shape: {
                        cx: 0,
                        cy: 0,
                        r: symbolSize / 2
                    },
                    invisible: true,
                    draggable: true,
                    ondrag: function (dx, dy) {
                        onPointDragging(dataIndex, [this.x, this.y]);
                    },
                    onmousemove: function () {
                        showTooltip(dataIndex);
                    },
                    onmouseout: function () {
                        hideTooltip(dataIndex);
                    },
                    z: 100
                };
            })
        });
    }, 0);
    window.addEventListener('resize', updatePosition);
    myChart.on('dataZoom', updatePosition);
    myChart.setOption(option);

    function updatePosition() {
        myChart.setOption({
            graphic: data.map(function (item, dataIndex) {
                return {
                    position: myChart.convertToPixel('grid', item)
                };
            })
        });
    }
    function showTooltip(dataIndex) {
        myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: dataIndex
        });
    }
    function hideTooltip(dataIndex) {
        myChart.dispatchAction({
            type: 'hideTip'
        });
    }
    function onPointDragging(dataIndex, pos) {
        data[dataIndex] = myChart.convertFromPixel('grid', pos);
        // Update data
        myChart.setOption({
            series: [
                {
                    id: 'a',
                    data: data
                }
            ]
        });
    }
})();