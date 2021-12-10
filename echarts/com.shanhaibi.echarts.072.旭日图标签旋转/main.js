(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#5873c6', '#99cc75', '#f5cc6b', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
            },
            {
                name: "font-color",
                alias: "字体颜色",
                type: "color",
                default: "#333"
            },
            {
                name: "font-size",
                alias: "字体大小(px)",
                type: "number",
                default: 12
            },
        ]
    })

    var dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let data = [
        {
            value: 8,
            children: [
                {
                    value: 4,
                    children: [
                        {
                            value: 2
                        },
                        {
                            value: 1
                        },
                        {
                            value: 1
                        },
                        {
                            value: 0.5
                        }
                    ]
                },
                {
                    value: 2
                }
            ]
        },
        {
            value: 4,
            children: [
                {
                    children: [
                        {
                            value: 2
                        }
                    ]
                }
            ]
        },
        {
            value: 4,
            children: [
                {
                    children: [
                        {
                            value: 2
                        }
                    ]
                }
            ]
        },
        {
            value: 3,
            children: [
                {
                    children: [
                        {
                            value: 1
                        }
                    ]
                }
            ]
        }
    ];

    let option = {
        silent: true,
        series: [
            {
                radius: ['15%', '80%'],
                type: 'sunburst',
                sort: undefined,
                emphasis: {
                    focus: 'ancestor'
                },
                data: data,
                label: {
                    color: await ShanhaiBI.getSetting("font-color"),
                    fontSize: await ShanhaiBI.getSetting("font-size"),
                    formatter: function (param) {
                        var depth = param.treePathInfo.length;
                        if (depth === 2) {
                            return 'radial';
                        } else if (depth === 3) {
                            return 'tangential';
                        } else if (depth === 4) {
                            return '0';
                        }
                        return '';
                    }
                },
                levels: [
                    {},
                    {
                        itemStyle: {
                            color: shape_color[0] ? shape_color[0] : "#CD4949"
                        },
                        label: {
                            rotate: 'radial',
                        }
                    },
                    {
                        itemStyle: {
                            color: shape_color[1] ? shape_color[1] : "#F47251"
                        },
                        label: {
                            rotate: 'tangential',
                        }
                    },
                    {
                        itemStyle: {
                            color: shape_color[2] ? shape_color[2] : "#FFC75F"
                        },
                        label: {
                            rotate: 0,
                        }
                    }
                ]
            }
        ]
    };
    myChart.setOption(option);
})();