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
                type: "axis"
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
                default: "#aaa"
            },
            {
                name: "label-size",
                alias: "文本字体大小",
                type: "number",
                default: 16
            },
            {
                name: "radius",
                alias: "半径(%)",
                type: "number",
                default: 65
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let radius = await ShanhaiBI.getSetting("radius");
    let rawData = await ShanhaiBI.getData();
    let value_data = rawData.getColumns("axis-value");
    let rich_data = rawData.getColumn("axis-rich");
    let data = [], legend_data = [];
    if (!value_data.length || !rich_data.length) {
        data = [
            { value: 735, name: 'CityC' },
            { value: 510, name: 'CityD' },
            { value: 434, name: 'CityB' },
            { value: 335, name: 'CityA' }
        ];
        rich_data = {
            value: 1548,
            name: 'CityE',
        }
        legend_data = ['CityA', 'CityB', 'CityD', 'CityC', 'CityE'];
    } else {
        let rich_dimensions = await ShanhaiBI.getSetting("axis-rich");
        let value_dimensions = await ShanhaiBI.getSetting("axis-value");
        value_dimensions.forEach((value_dim, i) => {
            data.push({value: value_data[i][0], name: value_dim.alias});
            legend_data.push(value_dim.alias);
        });
        rich_data = { value: rich_data[0], name: rich_dimensions[0].alias };
        legend_data.push(rich_data.name);
    }
    let weatherIcons = {
        Sunny: ROOT_PATH + '/data/asset/img/weather/sunny_128.png',
        Cloudy: ROOT_PATH + '/data/asset/img/weather/cloudy_128.png',
        Showers: ROOT_PATH + '/data/asset/img/weather/showers_128.png'
    };
    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        title: {
            text: 'Weather Statistics',
            subtext: 'Fake Data',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            bottom: 10,
            left: 'center',
            data: legend_data,
            textStyle: {
                color: "#aaa"
            }
        },
        label: {
            color: await ShanhaiBI.getSetting("label-color"),
            fontSize: await ShanhaiBI.getSetting("label-size")
        },
        series: [
            {
                type: 'pie',
                radius: radius + "%",
                center: ['50%', '50%'],
                selectedMode: 'single',
                data: [
                    {
                        ...rich_data,
                        label: {
                            color: "#000",
                            formatter: [
                                '{title|{b}}{abg|}',
                                '  {weatherHead|Weather}{valueHead|Days}{rateHead|Percent}',
                                '{hr|}',
                                '  {Sunny|}{value|202}{rate|55.3%}',
                                '  {Cloudy|}{value|142}{rate|38.9%}',
                                '  {Showers|}{value|21}{rate|5.8%}'
                            ].join('\n'),
                            backgroundColor: '#eee',
                            borderColor: '#777',
                            borderWidth: 1,
                            borderRadius: 4,
                            rich: {
                                title: {
                                    color: '#eee',
                                    align: 'center'
                                },
                                abg: { //头部
                                    backgroundColor: '#333',
                                    width: '100%',
                                    align: 'right',
                                    height: 25,
                                    borderRadius: [4, 4, 0, 0]
                                },
                                Sunny: {
                                    height: 30,
                                    align: 'center',
                                    backgroundColor: {
                                        image: weatherIcons.Sunny
                                    }
                                },
                                Cloudy: {
                                    height: 30,
                                    align: 'center',
                                    backgroundColor: {
                                        image: weatherIcons.Cloudy
                                    }
                                },
                                Showers: {
                                    height: 30,
                                    align: 'center',
                                    backgroundColor: {
                                        image: weatherIcons.Showers
                                    }
                                },
                                weatherHead: {
                                    height: 24,
                                    align: 'center',
                                },
                                hr: {
                                    width: '100%',
                                    borderWidth: 0.5,
                                    height: 0
                                },
                                value: {
                                    width: 20,
                                    padding: [0, 20, 0, 30],
                                    align: 'right'
                                },
                                valueHead: {
                                    width: 20,
                                    padding: [0, 20, 0, 20],
                                    align: 'center'
                                },
                                rate: {
                                    width: 40,
                                    align: 'center',
                                },
                                rateHead: {
                                    width: 40,
                                    align: 'center',
                                    padding: [0, 10, 0, 0]
                                }
                            }
                        }
                    },
                    ...data
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
})();