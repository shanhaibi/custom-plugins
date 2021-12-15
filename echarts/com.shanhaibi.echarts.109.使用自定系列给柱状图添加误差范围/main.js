(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-category",
                alias: "分类字段",
                type: "axis"
            },
            {
                name: "axis-value",
                alias: "取值字段",
                type: "axis"
            },
            {
                name: "axis-min_error",
                alias: "最小误差字段",
                type: "axis"
            },
            {
                name: "axis-max_error",
                alias: "最大误差字段",
                type: "axis"
            }
        ],
        "format": [
            {
                name: "column-color",
                type: "color",
                default: "#82c0f7",
                alias: "柱体颜色"
            },
            {
                name: "symbol-color",
                type: "color",
                default: "#5873c6",
                alias: "自定义图形颜色"
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let rawData = await ShanhaiBI.getData();
    let category_data = rawData.getColumn("axis-category");
    let value_data = rawData.getColumn("axis-value");
    let min_error_data = rawData.getColumn("axis-min_error");
    let max_error_data = rawData.getColumn("axis-max_error");
    let categoryData = [];
    let errorData = [];
    let barData = [];
    if(category_data.length && value_data.length && min_error_data.length && max_error_data.length) {
        categoryData = category_data, barData = value_data;
        for(let i = 0; i < category_data.length; i++) {
            errorData.push([i, min_error_data[i], max_error_data[i]])
        }
    } else {
        let dataCount = 100;
        for (let i = 0; i < dataCount; i++) {
            let val = Math.random() * 1000;
            categoryData.push('category' + i);
            errorData.push([
                i,
                echarts.number.round(Math.max(0, val - Math.random() * 100)),
                echarts.number.round(val + Math.random() * 80)
            ]);
            barData.push(echarts.number.round(val, 2));
        }
    }

    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        title: {
            text: 'Error bar chart'
        },
        legend: {
            data: ['bar', 'error']
        },
        dataZoom: [
            {
                type: 'slider',
                start: 40,
                end: 80
            },
            {
                type: 'inside',
                start: 40,
                end: 80
            }
        ],
        xAxis: {
            data: categoryData
        },
        yAxis: {},
        axisLabel: {
            color: "#aaa"
        },
        series: [
            {
                type: 'bar',
                name: 'bar',
                data: barData,
                itemStyle: {
                    color: await ShanhaiBI.getSetting("column-color")
                }
            },
            {
                type: 'custom',
                name: 'error',
                itemStyle: {
                    borderWidth: 1.5,
                    color: await ShanhaiBI.getSetting("symbol-color")
                },
                renderItem: function (params, api) {
                    let xValue = api.value(0);
                    let highPoint = api.coord([xValue, api.value(1)]);
                    let lowPoint = api.coord([xValue, api.value(2)]);
                    let halfWidth = api.size([1, 0])[0] * 0.1;
                    let style = api.style({
                        stroke: api.visual('color'),
                        fill: undefined
                    });
                    return {
                        type: 'group',
                        children: [
                            {
                                type: 'line',
                                transition: ['shape'],
                                shape: {
                                    x1: highPoint[0] - halfWidth,
                                    y1: highPoint[1],
                                    x2: highPoint[0] + halfWidth,
                                    y2: highPoint[1]
                                },
                                style: style
                            },
                            {
                                type: 'line',
                                transition: ['shape'],
                                shape: {
                                    x1: highPoint[0],
                                    y1: highPoint[1],
                                    x2: lowPoint[0],
                                    y2: lowPoint[1]
                                },
                                style: style
                            },
                            {
                                type: 'line',
                                transition: ['shape'],
                                shape: {
                                    x1: lowPoint[0] - halfWidth,
                                    y1: lowPoint[1],
                                    x2: lowPoint[0] + halfWidth,
                                    y2: lowPoint[1]
                                },
                                style: style
                            }
                        ]
                    };
                },
                encode: {
                    x: 0,
                    y: [1, 2]
                },
                data: errorData,
                z: 100
            }
        ]
    };
    myChart.setOption(option);

})();