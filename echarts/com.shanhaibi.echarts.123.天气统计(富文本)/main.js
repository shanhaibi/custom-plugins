(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-value",
                alias: "取值字段",
                type: "axis"
            },
            {
                name: "axis-rich",
                alias: "富文本字段",
                type: "axis",
                max: 1
            }
        ],
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
            },
            {
                name: "label-color",
                alias: "文本颜色",
                type: "color",
                default: "#fff"
            },
            {
                name: "label-size",
                alias: "文本字体大小",
                type: "number",
                default: 12
            },
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let rawData = await ShanhaiBI.getData();
    let value_data = rawData.getColumns("axis-value");
    let rich_data = rawData.getColumn("axis-rich");
    let legend_data = ['City Beta', 'City Gamma', 'City Alpha'];
    if (!value_data.length) {
        value_data = [[150, 105, 110], [220, 82, 63]]
    }
    if(!rich_data.length) {
        rich_data = [165, 170, 30]
    }
    let seriesLabel = {
        show: true,
        color: await ShanhaiBI.getSetting("label-color"),
        fontSize: await ShanhaiBI.getSetting("label-size")
    };
    let series_option = [];
    for (let i = 0; i < value_data.length; i++) {
        series_option.push({
            name: legend_data[i],
            type: "bar",
            label: seriesLabel,
            data: value_data[i]
        })
    }
    let weatherIcons = {
        Sunny: ROOT_PATH + '/data/asset/img/weather/sunny_128.png',
        Cloudy: ROOT_PATH + '/data/asset/img/weather/cloudy_128.png',
        Showers: ROOT_PATH + '/data/asset/img/weather/showers_128.png'
    };
    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        title: {
            text: 'Weather Statistics'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: legend_data,
            textStyle: {
                color: "#aaa"
            }
        },
        grid: {
            left: 100
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'value',
            name: 'Days',
            axisLabel: {
                formatter: '{value}'
            }
        },
        yAxis: {
            type: 'category',
            inverse: true,
            data: ['Sunny', 'Cloudy', 'Showers'],
            axisLabel: {
                formatter: function (value) {
                    return '{' + value + '| }\n{value|' + value + '}';
                },
                margin: 20,
                rich: {
                    value: {
                        lineHeight: 30,
                        align: 'center'
                    },
                    Sunny: {
                        height: 40,
                        align: 'center',
                        backgroundColor: {
                            image: weatherIcons.Sunny
                        }
                    },
                    Cloudy: {
                        height: 40,
                        align: 'center',
                        backgroundColor: {
                            image: weatherIcons.Cloudy
                        }
                    },
                    Showers: {
                        height: 40,
                        align: 'center',
                        backgroundColor: {
                            image: weatherIcons.Showers
                        }
                    }
                }
            }
        },
        series: [
            {
                name: 'City Alpha',
                type: 'bar',
                data: rich_data,
                label: seriesLabel,
                markPoint: {
                    symbolSize: 1,
                    symbolOffset: [0, '50%'],
                    label: {
                        formatter: '{a|{a}\n}{b|{b} }{c|{c}}',
                        backgroundColor: 'rgb(242,242,242)',
                        borderColor: '#aaa',
                        borderWidth: 1,
                        borderRadius: 4,
                        padding: [4, 10],
                        lineHeight: 26,
                        // shadowBlur: 5,
                        // shadowColor: '#000',
                        // shadowOffsetX: 0,
                        // shadowOffsetY: 1,
                        position: 'right',
                        distance: 20,
                        rich: {
                            a: {
                                align: 'center',
                                color: '#fff',
                                fontSize: 18,
                                textShadowBlur: 2,
                                textShadowColor: '#000',
                                textShadowOffsetX: 0,
                                textShadowOffsetY: 1,
                                textBorderColor: '#333',
                                textBorderWidth: 2
                            },
                            b: {
                                color: '#333'
                            },
                            c: {
                                color: '#ff8811',
                                textBorderColor: '#000',
                                textBorderWidth: 1,
                                fontSize: 22
                            }
                        }
                    },
                    data: [
                        { type: 'max', name: 'max days: ' },
                        { type: 'min', name: 'min days: ' }
                    ]
                }
            },
            ...series_option
        ]
    };
    myChart.setOption(option);
})();