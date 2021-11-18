(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "emphasis-color",
                alias: "高亮颜色",
                default: "#dcbf1e",
                type: "color"
            },
            {
                name: "selected-color",
                alias: "选中颜色",
                default: "#b50205",
                type: "color"
            }
        ]
    })
    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let emphasis_color = await ShanhaiBI.getSetting("emphasis-color");
    let selected_color = await ShanhaiBI.getSetting("selected-color");

    $.get(ROOT_PATH + '/data/asset/geo/Sicily_prehellenic_topographic_map.svg', function (svg) {
        echarts.registerMap('sicily', { svg: svg });
        let option = {
            tooltip: {
                formatter: function (params) {
                    console.log(params);
                    return [
                        params.name + ':',
                        'xxxxxxxxxxxxxxxx',
                        'xxxxxxxxxxxxxxxx',
                        'xxxxxxxxxxxxxxxx'
                    ].join('<br>');
                }
            },
            geo: [
                {
                    map: 'sicily',
                    roam: true,
                    layoutCenter: ['50%', '50%'],
                    layoutSize: '100%',
                    selectedMode: 'single',
                    tooltip: {
                        show: true,
                        confine: true,
                        formatter: function (params) {
                            return [
                                'This is the introduction:',
                                'xxxxxxxxxxxxxxxxxxxxx',
                                'xxxxxxxxxxxxxxxxxxxxx',
                                'xxxxxxxxxxxxxxxxxxxxx',
                                'xxxxxxxxxxxxxxxxxxxxx',
                                'xxxxxxxxxxxxxxxxxxxxx',
                                'xxxxxxxxxxxxxxxxxxxxx',
                                'xxxxxxxxxxxxxxxxxxxxx',
                                'xxxxxxxxxxxxxxxxxxxxx',
                                'xxxxxxxxxxxxxxxxxxxxx',
                                'xxxxxxxxxxxxxxxxxxxxx'
                            ].join('<br>');
                        }
                    },
                    itemStyle: {
                        color: undefined
                    },
                    emphasis: {
                        itemStyle: {
                            color: emphasis_color
                        },
                        label: {
                            show: false
                        }
                    },
                    select: {
                        itemStyle: {
                            color: selected_color
                        },
                        label: {
                            show: false
                        }
                    },
                    regions: [
                        {
                            name: 'route1',
                            itemStyle: {
                                borderWidth: 0
                            },
                            select: {
                                itemStyle: {
                                    color: selected_color,
                                    borderWidth: 0
                                }
                            },
                            tooltip: {
                                position: 'right',
                                alwaysShowContent: true,
                                enterable: true,
                                extraCssText: 'user-select: text',
                                formatter: [
                                    'Route 1:',
                                    'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
                                    'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
                                    'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
                                    'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
                                    'xxxxxxxxxxxxxxxxxxxxxxxxxxx'
                                ].join('<br>')
                            }
                        },
                        {
                            name: 'route2',
                            itemStyle: {
                                borderWidth: 0
                            },
                            select: {
                                itemStyle: {
                                    color: '#b5280d',
                                    borderWidth: 0
                                }
                            },
                            tooltip: {
                                position: 'left',
                                alwaysShowContent: true,
                                enterable: true,
                                extraCssText: 'user-select: text',
                                formatter: [
                                    'Route 2:',
                                    'xxxxxxxxxxxxxx',
                                    'xxxxxxxxxxxxxx',
                                    'xxxxxxxxxxxxxx',
                                    'xxxxxxxxxxxxxx',
                                    'xxxxxxxxxxxxxx',
                                    'xxxxxxxxxxxxxx',
                                    'xxxxxxxxxxxxxx',
                                    'xxxxxxxxxxxxxx'
                                ].join('<br>')
                            }
                        }
                    ]
                }
            ],
            // -------------
            // Make buttons
            grid: {
                top: 10,
                left: 'center',
                width: 80,
                height: 20
            },
            xAxis: {
                axisLine: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                axisTick: { show: false }
            },
            yAxis: {
                axisLine: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                axisTick: { show: false }
            },
            series: {
                type: 'scatter',
                itemStyle: {},
                symbolOffset: [0, 20],
                label: {
                    show: true,
                    borderColor: '#999',
                    borderWidth: 1,
                    borderRadius: 2,
                    backgroundColor: '#fff',
                    padding: [3, 5],
                    fontSize: 18,
                    opacity: 1,
                    color: '#333'
                },
                encode: {
                    label: 2
                },
                symbolSize: 0,
                tooltip: { show: false },
                selectedMode: 'single',
                select: {
                    label: {
                        color: '#fff',
                        borderColor: '#555',
                        backgroundColor: '#555'
                    }
                },
                data: [
                    [0, 0, 'route1'],
                    [1, 0, 'route2']
                ]
            }
            // Make buttons end
            // -----------------
        };
        myChart.setOption(option);
        myChart.on('selectchanged', function (params) {
            if (!params.selected.length) {
              myChart.dispatchAction({
                type: 'hideTip'
              });
              myChart.dispatchAction({
                type: 'geoSelect',
                geoIndex: 0
                // Use no name to unselect.
              });
            } else {
              var btnDataIdx = params.selected[0].dataIndex[0];
              var name = option.series.data[btnDataIdx][2];
              myChart.dispatchAction({
                type: 'geoSelect',
                geoIndex: 0,
                name: name
              });
              myChart.dispatchAction({
                type: 'showTip',
                geoIndex: 0,
                name: name
              });
            }
          });
    });
})();