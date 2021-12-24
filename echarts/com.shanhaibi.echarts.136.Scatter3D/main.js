(async function () {
    let schema = [
        { name: 'name', index: 0 },
        { name: 'group', index: 1 },
        { name: 'protein', index: 2 },
        { name: 'calcium', index: 3 },
        { name: 'sodium', index: 4 },
        { name: 'fiber', index: 5 },
        { name: 'vitaminc', index: 6 },
        { name: 'potassium', index: 7 },
        { name: 'carbohydrate', index: 8 },
        { name: 'sugars', index: 9 },
        { name: 'fat', index: 10 },
        { name: 'water', index: 11 },
        { name: 'calories', index: 12 },
        { name: 'saturated', index: 13 },
        { name: 'monounsat', index: 14 },
        { name: 'polyunsat', index: 15 },
        { name: 'id', index: 16 }
    ];
    let choices = [];
    schema.forEach(item => {
        choices.push({value: item.name, label: item.name});
    })
    choices = choices.slice(2, choices.length - 2);
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#1710c0', '#0b9df0', '#00fea8', '#00ff0d', '#f5f811', '#f09a09', '#fe0300']
            },
            {
                name: "label-color",
                alias: "图形文本颜色",
                type: "color",
                default: "#900"
            },
            {
                name: "label-size",
                alias: "图形文本大小(px)",
                type: "number",
                default: 20
            },
            {
                name: "axis-label-color",
                alias: "坐标轴文本颜色",
                type: "color",
                default: "#aaa"
            },
            {
                name: "axis-label-size",
                alias: "坐标轴文本大小(px)",
                type: "number",
                default: 16
            },
            {
                name: "axis-label-weight",
                alias: "坐标轴文本加粗",
                type: "boolean",
                default: true
            },
            {
                name: "x-axis-3d",
                alias: "xAis3D配置",
                type: "select",
                choices: choices,
                default: "protein"
            },
            {
                name: "y-axis-3d",
                alias: "yAis3D配置",
                type: "select",
                choices: choices,
                default: "fiber"
            },
            {
                name: "z-axis-3d",
                alias: "zAis3D配置",
                type: "select",
                choices: choices,
                default: "sodium"
            },
            {
                name: "color",
                alias: "color配置",
                type: "select",
                choices: choices,
                default: "fiber"
            },
            {
                name: "symbol-size",
                alias: "symbolSize配置",
                type: "select",
                choices: choices,
                default: "vitaminc"
            },
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let label_color = await ShanhaiBI.getSetting("label-color");
    let label_size = await ShanhaiBI.getSetting("label-size");
    let axis_label_color = await ShanhaiBI.getSetting("axis-label-color");
    let axis_label_size = await ShanhaiBI.getSetting("axis-label-size");
    let axis_label_weight = await ShanhaiBI.getSetting("axis-label-weight");
    let config_xAxis3D = await ShanhaiBI.getSetting("x-axis-3d");
    let config_yAxis3D = await ShanhaiBI.getSetting("y-axis-3d");
    let config_zAxis3D = await ShanhaiBI.getSetting("z-axis-3d");
    let config_color = await ShanhaiBI.getSetting("color");
    let config_symbolSize = await ShanhaiBI.getSetting("symbol-size");
    let fieldIndices = schema.reduce(function (obj, item) {
        obj[item.name] = item.index;
        return obj;
    }, {});
    $.getJSON(ROOT_PATH + '/data/asset/data/nutrients.json', function (_data) {
        let data = _data;
        let max = getMaxOnExtent(data);
        let option = {
            tooltip: {},
            visualMap: [
                {
                    top: 10,
                    calculable: true,
                    dimension: 3,
                    max: max.color / 2,
                    inRange: {
                        color: shape_color
                    },
                    textStyle: {
                        color: '#fff'
                    }
                },
                {
                    bottom: 10,
                    calculable: true,
                    dimension: 4,
                    max: max.symbolSize / 2,
                    inRange: {
                        symbolSize: [10, 40]
                    },
                    textStyle: {
                        color: '#fff'
                    }
                }
            ],
            xAxis3D: {
                name: config_xAxis3D,
                type: 'value'
            },
            yAxis3D: {
                name: config_yAxis3D,
                type: 'value'
            },
            zAxis3D: {
                name: config_zAxis3D,
                type: 'value'
            },
            grid3D: {
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisPointer: {
                    lineStyle: {
                        color: '#ffbd67'
                    }
                },
                axisLabel: {
                    color: axis_label_color,
                    fontSize: axis_label_size,
                    fontWeight: axis_label_weight ? "bolder" : "normal"
                },
                viewControl: {
                    // autoRotate: true
                    // projection: 'orthographic'
                }
            },
            series: [
                {
                    type: 'scatter3D',
                    dimensions: [
                        config_xAxis3D,
                        config_yAxis3D,
                        config_yAxis3D,
                        config_color,
                        config_symbolSize
                    ],
                    data: data.map(function (item, idx) {
                        return [
                            item[fieldIndices[config_xAxis3D]],
                            item[fieldIndices[config_yAxis3D]],
                            item[fieldIndices[config_zAxis3D]],
                            item[fieldIndices[config_color]],
                            item[fieldIndices[config_symbolSize]],
                            idx
                        ];
                    }),
                    label: {
                        color: label_color,
                        fontSize: label_size
                    },
                    symbolSize: 12,
                    // symbol: 'triangle',
                    itemStyle: {
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.8)'
                    },
                    emphasis: {
                        itemStyle: {
                            color: '#fff'
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
    });
    function getMaxOnExtent(data) {
        let colorMax = -Infinity;
        let symbolSizeMax = -Infinity;
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            let colorVal = item[fieldIndices[config_color]];
            let symbolSizeVal = item[fieldIndices[config_symbolSize]];
            colorMax = Math.max(colorVal, colorMax);
            symbolSizeMax = Math.max(symbolSizeVal, symbolSizeMax);
        }
        return {
            color: colorMax,
            symbolSize: symbolSizeMax
        };
    }
})();