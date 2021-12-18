(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#D33C3E', '#f4e9a3', '#18BF12']
            },
            {
                name: "area-color",
                alias: "面积颜色",
                type: "palette",
                default: ["rgba(88,160,253,1)", "rgba(88,160,253,0.7)", "rgba(88,160,253,0)"]
            },
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let area_color = await ShanhaiBI.getSetting("area-color");
    $.getJSON(
        ROOT_PATH + '/data/asset/data/wind-barb-hobart.json',
        function (rawData) {
            let weatherIcons = {
                Showers: ROOT_PATH + '/data/asset/img/weather/showers_128.png',
                Sunny: ROOT_PATH + '/data/asset/img/weather/sunny_128.png',
                Cloudy: ROOT_PATH + '/data/asset/img/weather/cloudy_128.png'
            };
            let directionMap = {};
            // prettier-ignore
            ['W', 'WSW', 'SW', 'SSW', 'S', 'SSE', 'SE', 'ESE', 'E', 'ENE', 'NE', 'NNE', 'N', 'NNW', 'NW', 'WNW'].forEach(function (name, index) {
                directionMap[name] = Math.PI / 8 * index;
            });
            let data = rawData.data.map(function (entry) {
                return [entry.time, entry.windSpeed, entry.R, entry.waveHeight];
            });
            let weatherData = rawData.forecast.map(function (entry) {
                return [
                    entry.localDate,
                    0,
                    weatherIcons[entry.skyIcon],
                    entry.minTemp,
                    entry.maxTemp
                ];
            });
            let dims = {
                time: 0,
                windSpeed: 1,
                R: 2,
                waveHeight: 3,
                weatherIcon: 2,
                minTemp: 3,
                maxTemp: 4
            };
            let arrowSize = 18;
            let weatherIconSize = 45;
            let renderArrow = function (param, api) {
                let point = api.coord([
                    api.value(dims.time),
                    api.value(dims.windSpeed)
                ]);
                return {
                    type: 'path',
                    shape: {
                        pathData: 'M31 16l-15-15v9h-26v12h26v9z',
                        x: -arrowSize / 2,
                        y: -arrowSize / 2,
                        width: arrowSize,
                        height: arrowSize
                    },
                    rotation: directionMap[api.value(dims.R)],
                    position: point,
                    style: api.style({
                        stroke: '#555',
                        lineWidth: 1
                    })
                };
            };
            let renderWeather = function (param, api) {
                let point = api.coord([
                    api.value(dims.time) + (3600 * 24 * 1000) / 2,
                    0
                ]);
                return {
                    type: 'group',
                    children: [
                        {
                            type: 'image',
                            style: {
                                image: api.value(dims.weatherIcon),
                                x: -weatherIconSize / 2,
                                y: -weatherIconSize / 2,
                                width: weatherIconSize,
                                height: weatherIconSize
                            },
                            position: [point[0], 110]
                        },
                        {
                            type: 'text',
                            style: {
                                text:
                                    api.value(dims.minTemp) + ' - ' + api.value(dims.maxTemp) + '°',
                                textFont: api.font({ fontSize: 14 }),
                                textAlign: 'center',
                                textVerticalAlign: 'bottom'
                            },
                            position: [point[0], 80]
                        }
                    ]
                };
            };
            let option = {
                title: {
                    text: '天气 风向 风速 海浪 预报',
                    subtext: '示例数据源于 www.seabreeze.com.au',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        return [
                            echarts.format.formatTime(
                                'yyyy-MM-dd',
                                params[0].value[dims.time]
                            ) +
                            ' ' +
                            echarts.format.formatTime('hh:mm', params[0].value[dims.time]),
                            '风速：' + params[0].value[dims.windSpeed],
                            '风向：' + params[0].value[dims.R],
                            '浪高：' + params[0].value[dims.waveHeight]
                        ].join('<br>');
                    }
                },
                grid: {
                    top: 160,
                    bottom: 125
                },
                xAxis: {
                    type: 'time',
                    maxInterval: 3600 * 1000 * 24,
                    splitLine: {
                        lineStyle: {
                            color: '#ddd'
                        }
                    }
                },
                yAxis: [
                    {
                        name: '风速（节）',
                        nameLocation: 'middle',
                        nameGap: 35,
                        axisLine: {
                            lineStyle: {
                                color: '#666'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#ddd'
                            }
                        }
                    },
                    {
                        name: '浪高（米）',
                        nameLocation: 'middle',
                        nameGap: 35,
                        max: 6,
                        axisLine: {
                            lineStyle: {
                                color: '#015DD5'
                            }
                        },
                        splitLine: { show: false }
                    },
                    {
                        axisLine: { show: false },
                        axisTick: { show: false },
                        axisLabel: { show: false },
                        splitLine: { show: false }
                    }
                ],
                visualMap: {
                    type: 'piecewise',
                    // show: false,
                    orient: 'horizontal',
                    inRange: {
                        color: shape_color
                    },
                    left: 'center',
                    bottom: 10,
                    pieces: [
                        {
                            gte: 17,
                            label: '大风（>=17节）'
                        },
                        {
                            gte: 11,
                            lt: 17,
                            label: '中风（11  ~ 17 节）'
                        },
                        {
                            lt: 11,
                            label: '微风（小于 11 节）'
                        }
                    ],
                    seriesIndex: 1,
                    dimension: 1
                },
                dataZoom: [
                    {
                        type: 'inside',
                        xAxisIndex: 0,
                        minSpan: 5
                    },
                    {
                        type: 'slider',
                        xAxisIndex: 0,
                        minSpan: 5,
                        bottom: 50
                    }
                ],
                series: [
                    {
                        type: 'line',
                        yAxisIndex: 1,
                        showSymbol: false,
                        emphasis: {
                            scale: false
                        },
                        symbolSize: 10,
                        areaStyle: {
                            color: generateLinearGradient(area_color)
                        },
                        lineStyle: {
                            color: 'rgba(88,160,253,1)'
                        },
                        itemStyle: {
                            color: 'rgba(88,160,253,1)'
                        },
                        encode: {
                            x: dims.time,
                            y: dims.waveHeight
                        },
                        data: data,
                        z: 2
                    },
                    {
                        type: 'custom',
                        renderItem: renderArrow,
                        encode: {
                            x: dims.time,
                            y: dims.windSpeed
                        },
                        data: data,
                        z: 10
                    },
                    {
                        type: 'line',
                        symbol: 'none',
                        encode: {
                            x: dims.time,
                            y: dims.windSpeed
                        },
                        lineStyle: {
                            color: '#aaa',
                            type: 'dotted'
                        },
                        data: data,
                        z: 1
                    },
                    {
                        type: 'custom',
                        renderItem: renderWeather,
                        data: weatherData,
                        tooltip: {
                            trigger: 'item',
                            formatter: function (param) {
                                return (
                                    param.value[dims.time] +
                                    ': ' +
                                    param.value[dims.minTemp] +
                                    ' - ' +
                                    param.value[dims.maxTemp] +
                                    '°'
                                );
                            }
                        },
                        yAxisIndex: 2,
                        z: 11
                    }
                ]
            };
            myChart.setOption(option);
        }
    );

    function generateLinearGradient(colors) {
        if (colors.length < 2) return colors[0] ? colors[0] : "#1890ff";
        let color_arr = [], colors_len = colors.length;
        for (let i = 0; i < colors_len; i++) {
            color_arr.push({
                offset: i / (colors_len - 1),
                color: colors[i]
            })
        }
        return new echarts.graphic.LinearGradient(0, 0, 0, 1, color_arr);
    }
})();