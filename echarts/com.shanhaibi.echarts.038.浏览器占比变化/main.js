(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-x",
                alias: "x轴字段",
                type: "axis",
            },
            {
                name: "axis-y",
                alias: "y轴字段",
                type: "axis",
            }
        ],
        "format": [
            {
                name: "data-color",
                alias: "数据颜色",
                type: "palette",
                default: ['#67F9D8', '#FFE434', '#56A3F1', '#FF917C', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
            },
            {
                name: "axis-max",
                alias: "刻度最大值",
                type: "number",
                default: 400
            }
        ]
    })
    
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let data = await ShanhaiBI.getData();
    echartsSetOption(myChart, data);

    async function echartsSetOption(echart, data) {
        let option = {
            title: {
                text: 'Proportion of Browsers',
                subtext: 'Fake Data',
                top: 10,
                left: 10
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                type: 'scroll',
                bottom: 10,
                textStyle: {
                    color: "#aaa"
                },
                data: (function () {
                    var list = [];
                    for (var i = 1; i <= 28; i++) {
                        list.push(i + 2000 + '');
                    }
                    return list;
                })()
            },
            visualMap: {
                top: 'middle',
                right: 10,
                color: await ShanhaiBI.getSetting("data-color"),
                calculable: true
            },
            radar: {
                indicator: [
                    { text: 'IE8-', max: 400 },
                    { text: 'IE9+', max: 400 },
                    { text: 'Safari', max: 400 },
                    { text: 'Firefox', max: 400 },
                    { text: 'Chrome', max: 400 }
                ]
            },
            series: (function () {
                var series = [];
                for (var i = 1; i <= 28; i++) {
                    series.push({
                        type: 'radar',
                        symbol: 'none',
                        lineStyle: {
                            width: 1
                        },
                        emphasis: {
                            areaStyle: {
                                color: 'rgba(0,250,0,0.3)'
                            }
                        },
                        data: [
                            {
                                value: [
                                    (40 - i) * 10,
                                    (38 - i) * 4 + 60,
                                    i * 5 + 10,
                                    i * 9,
                                    (i * i) / 2
                                ],
                                name: i + 2000 + ''
                            }
                        ]
                    });
                }
                return series;
            })()
        };
        let x_axis_data = data.getColumn("axis-x");
        let y_axis_data = data.getColumns("axis-y");
        if (x_axis_data.length && y_axis_data.length > 2) {
            let y_dimensions = await ShanhaiBI.getSetting("axis-y");
            let axis_max = await ShanhaiBI.getSetting("axis-max");
            option.legend.data = x_axis_data;
            let series = [];
            let indicator = [];
            y_dimensions.forEach(y_dimension => {
                indicator.push({text: y_dimension.alias, max: axis_max});
            });
            option.radar.indicator = indicator;
            for (let i = 0; i < x_axis_data.length; i++) {
                series.push({
                    type: 'radar',
                    symbol: 'none',
                    lineStyle: {
                        width: 1
                    },
                    emphasis: {
                        areaStyle: {
                            color: 'rgba(0,250,0,0.3)'
                        }
                    },
                    data: [
                        {
                            value: getRow(data, y_dimensions, i),
                            name: x_axis_data[i]
                        }
                    ]
                })
            }
            option.series = series;
        }
        echart.setOption(option);
    }
    function getRow(data, y_dimensions, idx) {
        let row = [];
        y_dimensions.forEach((y_dimension, i) => {
            row.push(data.getColumns("axis-y", i)[idx]);
        });
        return row;
    }

})();