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
                alias: "图形颜色",
                type: "color",
                default: "#5470C6",
            },
            {
                name: "align-with-label",
                alias: "刻度线与标签对齐",
                type: "boolean",
                default: true,
            },
            {
                name: "back-text",
                alias: "返回文本",
                type: "string",
                default: "Back",
                cluster: { title: "返回文本设置" }
            },
            {
                name: "back-text-color",
                alias: "文本颜色",
                type: "color",
                default: "#aaa",
                cluster: { title: "返回文本设置" }
            },
            {
                name: "back-text-size",
                alias: "字体大小(px)",
                type: "number",
                default: 18,
                cluster: { title: "返回文本设置" }
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let back_text = await ShanhaiBI.getSetting("back-text");
    let back_text_color = await ShanhaiBI.getSetting("back-text-color");
    let back_text_size = await ShanhaiBI.getSetting("back-text-size");
    let rawData = await ShanhaiBI.getData();
    let category_data = rawData.getColumn("axis-category");
    let value_data = rawData.getColumns("axis-value");
    let drilldownData = [], x_axis_data = [], series_data = [];
    if (category_data.length && value_data.length) {
        let value_dims = await ShanhaiBI.getSetting("axis-value");
        value_dims.forEach((value_dim, idx) => {
            // drilldownData
            let data = [];
            for (let i = 0; i < value_data[idx].length; i++) {
                value_data[idx][i] === undefined || data.push([category_data[i], value_data[idx][i]]);
            }
            drilldownData.push({
                dataGroupId: value_dim.alias,
                data: data
            });
            x_axis_data.push(value_dim.alias);
            series_data.push({
                value: data.length,
                groupId: value_dim.alias
            })
        })
    } else {
        drilldownData = [
            {
                dataGroupId: 'animals',
                data: [
                    ['Cats', 4],
                    ['Dogs', 2],
                    ['Cows', 1],
                    ['Sheep', 2],
                    ['Pigs', 1]
                ]
            },
            {
                dataGroupId: 'fruits',
                data: [
                    ['Apples', 4],
                    ['Oranges', 2]
                ]
            },
            {
                dataGroupId: 'cars',
                data: [
                    ['Toyota', 4],
                    ['Opel', 2],
                    ['Volkswagen', 2]
                ]
            }
        ];
        x_axis_data = ['Animals', 'Fruits', 'Cars'];
        series_data = [
            {
                value: 5,
                groupId: 'animals'
            },
            {
                value: 2,
                groupId: 'fruits'
            },
            {
                value: 4,
                groupId: 'cars'
            }
        ];
    }
    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        xAxis: {
            data: x_axis_data,
            axisTick: {
                alignWithLabel: await ShanhaiBI.getSetting("align-with-label")
            }
        },
        yAxis: {},
        dataGroupId: '',
        animationDurationUpdate: 500,
        series: {
            type: 'bar',
            id: 'sales',
            data: series_data,
            universalTransition: {
                enabled: true,
                divideShape: 'clone'
            }
        }
    };
    myChart.setOption(option);

    myChart.on('click', function (event) {
        if (event.data) {
            let subData = drilldownData.find(function (data) {
                return data.dataGroupId === event.data.groupId;
            });
            if (!subData) {
                return;
            }
            myChart.setOption({
                xAxis: {
                    data: subData.data.map(function (item) {
                        return item[0];
                    })
                },
                series: {
                    type: 'bar',
                    id: 'sales',
                    dataGroupId: subData.dataGroupId,
                    data: subData.data.map(function (item) {
                        return item[1];
                    }),
                    universalTransition: {
                        enabled: true,
                        divideShape: 'clone'
                    }
                },
                graphic: [
                    {
                        type: 'text',
                        left: 50,
                        top: 20,
                        style: {
                            text: back_text,
                            fontSize: back_text_size,
                            fill: back_text_color
                        },
                        onclick: function () {
                            myChart.setOption(option);
                        }
                    }
                ]
            });
        }
    });
})();