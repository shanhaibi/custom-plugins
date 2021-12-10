(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#dddddd', '#F54F4A', '#FF8C75', '#FFB499', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
            },
            {
                name: "inner-ring-radius",
                alias: "内圈半径(%)",
                type: "number",
                default: 15
            }
        ]
    })

    var dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let inner_ring_radius = (await ShanhaiBI.getSetting("inner-ring-radius")) + "%";
    let item1 = {
        color: shape_color[1] ? shape_color[1] : '#F54F4A'
    };
    let item2 = {
        color: shape_color[2] ? shape_color[2] : '#FF8C75'
    };
    let item3 = {
        color: shape_color[3] ? shape_color[3] : '#FFB499'
    };
    let data = [
        {
            children: [
                {
                    value: 5,
                    children: [
                        {
                            value: 1,
                            itemStyle: item1
                        },
                        {
                            value: 2,
                            children: [
                                {
                                    value: 1,
                                    itemStyle: item2
                                }
                            ]
                        },
                        {
                            children: [
                                {
                                    value: 1
                                }
                            ]
                        }
                    ],
                    itemStyle: item1
                },
                {
                    value: 10,
                    children: [
                        {
                            value: 6,
                            children: [
                                {
                                    value: 1,
                                    itemStyle: item1
                                },
                                {
                                    value: 1
                                },
                                {
                                    value: 1,
                                    itemStyle: item2
                                },
                                {
                                    value: 1
                                }
                            ],
                            itemStyle: item3
                        },
                        {
                            value: 2,
                            children: [
                                {
                                    value: 1
                                }
                            ],
                            itemStyle: item3
                        },
                        {
                            children: [
                                {
                                    value: 1,
                                    itemStyle: item2
                                }
                            ]
                        }
                    ],
                    itemStyle: item1
                }
            ],
            itemStyle: item1
        },
        {
            value: 9,
            children: [
                {
                    value: 4,
                    children: [
                        {
                            value: 2,
                            itemStyle: item2
                        },
                        {
                            children: [
                                {
                                    value: 1,
                                    itemStyle: item1
                                }
                            ]
                        }
                    ],
                    itemStyle: item1
                },
                {
                    children: [
                        {
                            value: 3,
                            children: [
                                {
                                    value: 1
                                },
                                {
                                    value: 1,
                                    itemStyle: item2
                                }
                            ]
                        }
                    ],
                    itemStyle: item3
                }
            ],
            itemStyle: item2
        },
        {
            value: 7,
            children: [
                {
                    children: [
                        {
                            value: 1,
                            itemStyle: item3
                        },
                        {
                            value: 3,
                            children: [
                                {
                                    value: 1,
                                    itemStyle: item2
                                },
                                {
                                    value: 1
                                }
                            ],
                            itemStyle: item2
                        },
                        {
                            value: 2,
                            children: [
                                {
                                    value: 1
                                },
                                {
                                    value: 1,
                                    itemStyle: item1
                                }
                            ],
                            itemStyle: item1
                        }
                    ],
                    itemStyle: item3
                }
            ],
            itemStyle: item1
        },
        {
            children: [
                {
                    value: 6,
                    children: [
                        {
                            value: 1,
                            itemStyle: item2
                        },
                        {
                            value: 2,
                            children: [
                                {
                                    value: 2,
                                    itemStyle: item2
                                }
                            ],
                            itemStyle: item1
                        },
                        {
                            value: 1,
                            itemStyle: item3
                        }
                    ],
                    itemStyle: item3
                },
                {
                    value: 3,
                    children: [
                        {
                            value: 1
                        },
                        {
                            children: [
                                {
                                    value: 1,
                                    itemStyle: item2
                                }
                            ]
                        },
                        {
                            value: 1
                        }
                    ],
                    itemStyle: item3
                }
            ],
            itemStyle: item1
        }
    ];

    let option = {
        series: {
            radius: [inner_ring_radius, '80%'],
            type: 'sunburst',
            sort: undefined,
            emphasis: {
                focus: 'ancestor'
            },
            data: data,
            levels: [],
            itemStyle: {
                color: shape_color[0] ? shape_color[0] : '#ddd',
                borderWidth: 2
            }
        }
    };
    myChart.setOption(option);
})();