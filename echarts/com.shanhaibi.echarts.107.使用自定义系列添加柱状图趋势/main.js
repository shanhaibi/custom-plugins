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
            }
        ],
        "format": [
            {
                name: "shape-color",
                type: "palette",
                default: ["#5873c6", "#cce5ba", "#f9e2ab", "#f1b0b2", "#bfe0ee", "#a7d0b8", "#f8bfa8", "#cab0d9"],
                alias: "图形颜色"
            },
            {
                name: "split-line",
                alias: "分隔线显示",
                default: true,
                type: "boolean"
            },
            {
                name: "split-line-color",
                alias: "分隔线颜色",
                default: "#aaa",
                type: "color"
            },
            {
                name: "split-line-type",
                alias: "分割线类型",
                type: "select",
                choices: [
                    {
                        value: "solid",
                        label: "直线"
                    },
                    {
                        value: "dotted",
                        label: "虚线"
                    }
                ],
                default: "solid"
            },
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let rawData = await ShanhaiBI.getData();
    let category_data = rawData.getColumn("axis-category");
    let value_data = rawData.getColumns("axis-value");
    let yearCount = 7;
    let categoryCount = 30;
    let xAxisData = [];
    let customData = [];
    let legendData = [];
    let dataList = [];
    legendData.push('trend');
    let encodeY = [];
    if(category_data.length && value_data.length) {
        let value_axis = await ShanhaiBI.getSetting("axis-value");
        xAxisData = category_data;
        dataList = value_data;
        for(let i = 0; i < value_axis.length; i++) {
            legendData.push(value_axis[i].alias + "");
            encodeY.push(i + 1);
        }
        for(let i = 0; i < category_data.length; i++) {
            let item = [i];
            for(let index = 0; index < value_axis.length; index++) {
                item.push(value_data[index][i]);
            }
            customData.push(item);
        }
    } else {
        for (let i = 0; i < yearCount; i++) {
            legendData.push(2010 + i + '');
            dataList.push([]);
            encodeY.push(1 + i);
        }
        for (let i = 0; i < categoryCount; i++) {
            let val = Math.random() * 1000;
            xAxisData.push('category' + i);
            let customVal = [i];
            customData.push(customVal);
            for (let j = 0; j < dataList.length; j++) {
                let value =
                    j === 0
                        ? echarts.number.round(val, 2)
                        : echarts.number.round(
                            Math.max(0, dataList[j - 1][i] + (Math.random() - 0.5) * 200),
                            2
                        );
                dataList[j].push(value);
                customVal.push(value);
            }
        }
    }

    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: legendData,
            textStyle: {
                color: "#aaa"
            }
        },
        dataZoom: [
            {
                type: 'slider',
                start: 50,
                end: 80
            },
            {
                type: 'inside',
                start: 50,
                end: 80
            }
        ],
        xAxis: {
            data: xAxisData
        },
        yAxis: {
            splitLine: {
                show: await ShanhaiBI.getSetting("split-line"),
                lineStyle: {
                    color: await ShanhaiBI.getSetting("split-line-color"),
                    type: await ShanhaiBI.getSetting("split-line-type")
                }
            }
        },
        axisLabel: {
            color: "#aaa"
        },
        series: [
            {
                type: 'custom',
                name: 'trend',
                renderItem: function (params, api) {
                    let xValue = api.value(0);
                    let currentSeriesIndices = api.currentSeriesIndices();
                    let barLayout = api.barLayout({
                        barGap: '30%',
                        barCategoryGap: '20%',
                        count: currentSeriesIndices.length - 1
                    });
                    let points = [];
                    for (let i = 0; i < currentSeriesIndices.length; i++) {
                        let seriesIndex = currentSeriesIndices[i];
                        if (seriesIndex !== params.seriesIndex) {
                            let point = api.coord([xValue, api.value(seriesIndex)]);
                            point[0] += barLayout[i - 1].offsetCenter;
                            point[1] -= 20;
                            points.push(point);
                        }
                    }
                    let style = api.style({
                        stroke: api.visual('color'),
                        fill: 'none'
                    });
                    return {
                        type: 'polyline',
                        shape: {
                            points: points
                        },
                        style: style
                    };
                },
                itemStyle: {
                    borderWidth: 2
                },
                encode: {
                    x: 0,
                    y: encodeY
                },
                data: customData,
                z: 100
            },
            ...dataList.map(function (data, index) {
                return {
                    type: 'bar',
                    animation: false,
                    name: legendData[index + 1],
                    itemStyle: {
                        opacity: 0.5
                    },
                    data: data
                };
            })
        ]
    };
    myChart.setOption(option);

})();