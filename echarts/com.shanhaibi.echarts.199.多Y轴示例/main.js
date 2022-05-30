(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-category",
                alias: "分类字段",
                type: "axis"
            },
            {
                name: "axis-precipitation",
                alias: "降水量字段",
                type: "axis"
            },
            {
                name: "axis-evaporation",
                alias: "蒸发量字段",
                type: "axis"
            },
            {
                name: "axis-temperature",
                alias: "温度字段",
                type: "axis"
            }
        ],
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#5470C6', '#91CC75', '#EE6666'],
            },
            {
                name: "align-with-label",
                alias: "刻度线与标签对齐",
                type: "boolean",
                default: true,
            },
            {
                name: "legend-label-color",
                alias: "文本颜色",
                type: "color",
                default: "#aaa",
                cluster: { title: "图例设置" }
            },
            {
                name: "legend-label-size",
                alias: "字体大小(px)",
                type: "number",
                default: 12,
                cluster: { title: "图例设置" }
            },
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let colors = await ShanhaiBI.getSetting("shape-color");
    let rawData = await ShanhaiBI.getData();
    let category_data = rawData.getColumn("axis-category");
    let precipitation_data = rawData.getColumn("axis-precipitation");
    let evaporation_data = rawData.getColumn("axis-evaporation");
    let temperature_data = rawData.getColumn("axis-temperature");
    if (!category_data.length || !precipitation_data.length || !evaporation_data.length || !temperature_data.length) {
        category_data = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        precipitation_data = [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3];
        evaporation_data = [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3];
        temperature_data = [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2];
    }

    let option = {
        color: colors,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        grid: {
            right: '20%'
        },
        legend: {
            data: ['Evaporation', 'Precipitation', 'Temperature'],
            textStyle: {
                color: await ShanhaiBI.getSetting("legend-label-color"),
                fontSize: await ShanhaiBI.getSetting("legend-label-size")
            }
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: await ShanhaiBI.getSetting("align-with-label")
                },
                // prettier-ignore
                data: category_data
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: 'Evaporation',
                min: 0,
                max: 250,
                position: 'right',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors[0]
                    }
                },
                axisLabel: {
                    formatter: '{value} ml'
                }
            },
            {
                type: 'value',
                name: 'Precipitation',
                min: 0,
                max: 250,
                position: 'right',
                offset: 80,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors[1]
                    }
                },
                axisLabel: {
                    formatter: '{value} ml'
                }
            },
            {
                type: 'value',
                name: '温度',
                min: 0,
                max: 25,
                position: 'left',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors[2]
                    }
                },
                axisLabel: {
                    formatter: '{value} °C'
                }
            }
        ],
        series: [
            {
                name: 'Evaporation',
                type: 'bar',
                data: evaporation_data
            },
            {
                name: 'Precipitation',
                type: 'bar',
                yAxisIndex: 1,
                data: precipitation_data
            },
            {
                name: 'Temperature',
                type: 'line',
                yAxisIndex: 2,
                data: temperature_data
            }
        ]
    };
    myChart.setOption(option);
})();