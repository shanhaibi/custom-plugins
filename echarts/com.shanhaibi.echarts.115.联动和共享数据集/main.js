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
                type: "palette",
                default: ['#65B581', '#FFCE34', '#FD665F', '#5873c6', '#85cce9']
            },
            {
                name: "lebel-text-color",
                alias: "图形文本颜色",
                type: "color",
                default: "#aaa"
            },
            {
                name: "radius",
                alias: "半径(%)",
                type: "number",
                default: 30
            },
            {
                name: "series-shape-type",
                alias: "折线形状",
                type: "select",
                default: "smooth",
                choices: [
                    {
                        label: "折线",
                        value: "line"
                    },
                    {
                        label: "平滑",
                        value: "smooth"
                    }
                ]
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let radius = await ShanhaiBI.getSetting("radius");
    let label_text_color = await ShanhaiBI.getSetting("lebel-text-color");
    let rawData = await ShanhaiBI.getData();
    let category_data = rawData.getColumn("axis-category");
    let value_data = rawData.getColumns("axis-value");
    let encode_name, source = [], encode_value;
    if (category_data.length && value_data.length) {
        let category_axis = await ShanhaiBI.getSetting("axis-category");
        let value_axis = await ShanhaiBI.getSetting("axis-value");
        source = [[category_axis[0].alias, ...new Set(category_data)]];
        value_axis.forEach((item, i) => {
            source.push([item.alias, ...value_data[i]]);
        });
        encode_name = category_axis[0].alias;
        encode_value = category_data[0];
    } else {
        source = [
            ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
            ['Milk Tea', 86.5, 92.1, 85.7, 83.1, 73.4, 55.1],
            ['Matcha Latte', 41.1, 30.4, 65.1, 53.3, 83.8, 98.7],
            ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4, 65.2, 82.5],
            ['Walnut Brownie', 55.2, 67.1, 69.2, 72.4, 53.9, 39.1]
        ];
        encode_name = "product";
        encode_value = "2012";
    }
    let series_line = [];
    for (let i = 1; i < source.length; i++) {
        series_line.push({
            type: "line",
            smooth: await ShanhaiBI.getSetting("series-shape-type") === "line" ? false : true,
            seriesLayoutBy: "row",
            emphasis: { focus: "series" }
        });
    }
    let option = {
        legend: {
            textStyle: {
                color: "#aaa",
            }
        },
        tooltip: {
            trigger: 'axis',
            showContent: false
        },
        dataset: {
            source: source
        },
        xAxis: { type: 'category' },
        yAxis: { gridIndex: 0 },
        label: {
            color: label_text_color
        },
        grid: { top: '55%' },
        series: [
            ...series_line,
            {
                type: 'pie',
                id: 'pie',
                radius: radius + '%',
                center: ['50%', '25%'],
                emphasis: {
                    focus: 'self'
                },
                label: {
                    formatter: '{b}: {@' + encode_value + '} ({d}%)'
                },
                encode: {
                    itemName: encode_name,
                    value: encode_value,
                    tooltip: encode_value
                }
            },
        ]
    };
    myChart.on('updateAxisPointer', function (event) {
        const xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
            const dimension = xAxisInfo.value + 1;
            myChart.setOption({
                series: {
                    id: 'pie',
                    label: {
                        formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                    },
                    encode: {
                        value: dimension,
                        tooltip: dimension
                    }
                }
            });
        }
    });
    myChart.setOption(option);
})();