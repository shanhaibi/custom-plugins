(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-category",
                alias: "分类字段",
                type: "axis"
            },
            {
                name: "axis-start",
                alias: "期初字段",
                type: "axis"
            },
            {
                name: "axis-end",
                alias: "期末字段",
                type: "axis"
            },
            {
                name: "axis-profit",
                alias: "利润字段",
                type: "axis"
            }
        ],
        "format": [
            {
                name: "shape-color",
                type: "palette",
                default: ['#4f81bd', '#c0504d', '#9bbb59', '#604a7b', '#948a54', '#e46c0b'],
                alias: "图形颜色"
            },
            {
                name: "label",
                alias: "显示文本",
                default: true,
                type: "boolean"
            },
            // {
            //     name: "label-color",
            //     alias: "文本颜色",
            //     type: "color",
            //     default: "#aaa"
            // },
            {
                name: "label-size",
                alias: "文本字体大小(px)",
                type: "number",
                default: 16
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);
    
    let colors = await ShanhaiBI.getSetting("shape-color");
    let label_display = await ShanhaiBI.getSetting("label");
    let label_size = await ShanhaiBI.getSetting("label-size");
    let rawData = await ShanhaiBI.getData();
    let category_data = rawData.getColumn("axis-category");
    let start_data = rawData.getColumn("axis-start");
    let end_data = rawData.getColumn("axis-end");
    let profit_data = rawData.getColumn("axis-profit");
    let data = [], dimensions = [];
    if(category_data.length && start_data.length && end_data.length && profit_data.length) {
        for(let i = 0; i < category_data.length; i++) {
            data.push([start_data[i], end_data[i], profit_data[i], category_data[i]]);
        }
        let start_axis = await ShanhaiBI.getSetting("axis-start");
        let end_axis = await ShanhaiBI.getSetting("axis-end");
        let profit_axis = await ShanhaiBI.getSetting("axis-profit");
        dimensions = [start_axis[0].alias, end_axis[0].alias, profit_axis[0].alias];
    } else {
        data = [
            [10, 16, 3, 'A'],
            [16, 18, 15, 'B'],
            [18, 26, 12, 'C'],
            [26, 32, 22, 'D'],
            [32, 56, 7, 'E'],
            [56, 62, 17, 'F']
        ];
        dimensions = ['from', 'to', 'profit'];
    }
    data = data.map(function (item, index) {
        return {
            value: item,
            itemStyle: {
                color: colors[index]
            }
        };
    });
    let option = {
        title: {
            text: 'Profit',
            left: 'center'
        },
        tooltip: {},
        xAxis: {
            scale: true
        },
        yAxis: {},
        axisLabel: {color: "#aaa"},
        series: [
            {
                type: 'custom',
                renderItem: function (params, api) {
                    var yValue = api.value(2);
                    var start = api.coord([api.value(0), yValue]);
                    var size = api.size([api.value(1) - api.value(0), yValue]);
                    var style = api.style();
                    return {
                        type: 'rect',
                        shape: {
                            x: start[0],
                            y: start[1],
                            width: size[0],
                            height: size[1]
                        },
                        style: style
                    };
                },
                label: {
                    position: 'top',
                    show: label_display,
                    fontSize: label_size
                },
                dimensions: dimensions,
                encode: {
                    x: [0, 1],
                    y: 2,
                    tooltip: [0, 1, 2],
                    itemName: 3
                },
                data: data
            }
        ]
    };
    myChart.setOption(option);

})();