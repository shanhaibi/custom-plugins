(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#5873c6', '#99cc75', '#f5cc6b', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
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
            }
        ]
    })

    var dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let data = [
        {
            name: 'Grandpa',
            children: [
                {
                    name: 'Uncle Leo',
                    value: 15,
                    children: [
                        {
                            name: 'Cousin Jack',
                            value: 2
                        },
                        {
                            name: 'Cousin Mary',
                            value: 5,
                            children: [
                                {
                                    name: 'Jackson',
                                    value: 2
                                }
                            ]
                        },
                        {
                            name: 'Cousin Ben',
                            value: 4
                        }
                    ]
                },
                {
                    name: 'Father',
                    value: 10,
                    children: [
                        {
                            name: 'Me',
                            value: 5
                        },
                        {
                            name: 'Brother Peter',
                            value: 1
                        }
                    ]
                }
            ]
        },
        {
            name: 'Nancy',
            children: [
                {
                    name: 'Uncle Nike',
                    children: [
                        {
                            name: 'Cousin Betty',
                            value: 1
                        },
                        {
                            name: 'Cousin Jenny',
                            value: 2
                        }
                    ]
                }
            ]
        }
    ];
    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        series: {
            type: 'sunburst',
            // emphasis: {
            //     focus: 'ancestor'
            // },
            data: data,
            radius: [0, '90%'],
            label: {
                rotate: 'radial',
                color: await ShanhaiBI.getSetting("font-color"),
                fontSize: await ShanhaiBI.getSetting("font-size")
            }
        }
    };
    myChart.setOption(option);
})();