(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-catagory",
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
                name: "align-with-label",
                alias: "刻度线与标签对齐",
                type: "boolean",
                default: true
            },
            {
                name: "category-scale",
                alias: "类目轴刻度(\",\"隔开)",
                type: "string",
                default: "优,良,轻度,中度,重度,严重"
            },
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
            },
            {
                name: "axis-text-color",
                alias: "轴文本颜色",
                type: "color",
                default: "#fff"
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let rawData = await ShanhaiBI.getData();
    let category_data = rawData.getColumn("axis-category");
    let value_data = rawData.getColumns("axis-value");
    let value_dims = await ShanhaiBI.getSetting("axis-value");
    let data = {}, schema = [], parallel_axis = [];
    let legend_data = [...new Set(category_data)];
    if (value_data.length && category_data.length) {
        for (let i = 0; i < category_data.length; i++) {
            let row = [];
            for (let index = 1; index < value_data.length; index++) {
                row.push(value_data[index][i]);
            }
            row.push(category_data[i]);
            data.push(row);
        }
        for (let i = 1; i < value_dims.length; i++) {
            schema.push(value_dims[i].alias);
        }
    } else {
        legend_data = ['北京', '上海', '广州'];
        data = [
            [55, 9, 56, 0.46, 18, 6, '良', '北京'],
            [25, 11, 21, 0.65, 34, 9, '优', '北京'],
            [56, 7, 63, 0.3, 14, 5, '良', '北京'],
            [33, 7, 29, 0.33, 16, 6, '优', '北京'],
            [42, 24, 44, 0.76, 40, 16, '优', '北京'],
            [82, 58, 90, 1.77, 68, 33, '良', '北京'],
            [74, 49, 77, 1.46, 48, 27, '良', '北京'],
            [78, 55, 80, 1.29, 59, 29, '良', '北京'],
            [267, 216, 280, 4.8, 108, 64, '重度', '北京'],
            [185, 127, 216, 2.52, 61, 27, '中度', '北京'],
            [39, 19, 38, 0.57, 31, 15, '优', '北京'],
            [41, 11, 40, 0.43, 21, 7, '优', '北京'],
            [64, 38, 74, 1.04, 46, 22, '良', '北京'],
            [108, 79, 120, 1.7, 75, 41, '轻度', '北京'],
            [108, 63, 116, 1.48, 44, 26, '轻度', '北京'],
            [33, 6, 29, 0.34, 13, 5, '优', '北京'],
            [94, 66, 110, 1.54, 62, 31, '良', '北京'],
            [186, 142, 192, 3.88, 93, 79, '中度', '北京'],
            [57, 31, 54, 0.96, 32, 14, '良', '北京'],
            [22, 8, 17, 0.48, 23, 10, '优', '北京'],
            [39, 15, 36, 0.61, 29, 13, '优', '北京'],
            [94, 69, 114, 2.08, 73, 39, '良', '北京'],
            [99, 73, 110, 2.43, 76, 48, '良', '北京'],
            [31, 12, 30, 0.5, 32, 16, '优', '北京'],
            [42, 27, 43, 1, 53, 22, '优', '北京'],
            [154, 117, 157, 3.05, 92, 58, '中度', '北京'],
            [234, 185, 230, 4.09, 123, 69, '重度', '北京'],
            [160, 120, 186, 2.77, 91, 50, '中度', '北京'],
            [134, 96, 165, 2.76, 83, 41, '轻度', '北京'],
            [52, 24, 60, 1.03, 50, 21, '良', '北京'],
            [46, 5, 49, 0.28, 10, 6, '优', '北京'],
            [26, 37, 27, 1.163, 27, 13, '优', '广州'],
            [85, 62, 71, 1.195, 60, 8, '良', '广州'],
            [78, 38, 74, 1.363, 37, 7, '良', '广州'],
            [21, 21, 36, 0.634, 40, 9, '优', '广州'],
            [41, 42, 46, 0.915, 81, 13, '优', '广州'],
            [56, 52, 69, 1.067, 92, 16, '良', '广州'],
            [64, 30, 28, 0.924, 51, 2, '良', '广州'],
            [55, 48, 74, 1.236, 75, 26, '良', '广州'],
            [76, 85, 113, 1.237, 114, 27, '良', '广州'],
            [91, 81, 104, 1.041, 56, 40, '良', '广州'],
            [84, 39, 60, 0.964, 25, 11, '良', '广州'],
            [64, 51, 101, 0.862, 58, 23, '良', '广州'],
            [70, 69, 120, 1.198, 65, 36, '良', '广州'],
            [77, 105, 178, 2.549, 64, 16, '良', '广州'],
            [109, 68, 87, 0.996, 74, 29, '轻度', '广州'],
            [73, 68, 97, 0.905, 51, 34, '良', '广州'],
            [54, 27, 47, 0.592, 53, 12, '良', '广州'],
            [51, 61, 97, 0.811, 65, 19, '良', '广州'],
            [91, 71, 121, 1.374, 43, 18, '良', '广州'],
            [73, 102, 182, 2.787, 44, 19, '良', '广州'],
            [73, 50, 76, 0.717, 31, 20, '良', '广州'],
            [84, 94, 140, 2.238, 68, 18, '良', '广州'],
            [93, 77, 104, 1.165, 53, 7, '良', '广州'],
            [99, 130, 227, 3.97, 55, 15, '良', '广州'],
            [146, 84, 139, 1.094, 40, 17, '轻度', '广州'],
            [113, 108, 137, 1.481, 48, 15, '轻度', '广州'],
            [81, 48, 62, 1.619, 26, 3, '良', '广州'],
            [56, 48, 68, 1.336, 37, 9, '良', '广州'],
            [82, 92, 174, 3.29, 0, 13, '良', '广州'],
            [106, 116, 188, 3.628, 101, 16, '轻度', '广州'],
            [118, 50, 0, 1.383, 76, 11, '轻度', '广州'],
            [91, 45, 125, 0.82, 34, 23, '良', '上海'],
            [65, 27, 78, 0.86, 45, 29, '良', '上海'],
            [83, 60, 84, 1.09, 73, 27, '良', '上海'],
            [109, 81, 121, 1.28, 68, 51, '轻度', '上海'],
            [106, 77, 114, 1.07, 55, 51, '轻度', '上海'],
            [109, 81, 121, 1.28, 68, 51, '轻度', '上海'],
            [106, 77, 114, 1.07, 55, 51, '轻度', '上海'],
            [89, 65, 78, 0.86, 51, 26, '良', '上海'],
            [53, 33, 47, 0.64, 50, 17, '良', '上海'],
            [80, 55, 80, 1.01, 75, 24, '良', '上海'],
            [117, 81, 124, 1.03, 45, 24, '轻度', '上海'],
            [99, 71, 142, 1.1, 62, 42, '良', '上海'],
            [95, 69, 130, 1.28, 74, 50, '良', '上海'],
            [116, 87, 131, 1.47, 84, 40, '轻度', '上海'],
            [108, 80, 121, 1.3, 85, 37, '轻度', '上海'],
            [134, 83, 167, 1.16, 57, 43, '轻度', '上海'],
            [79, 43, 107, 1.05, 59, 37, '良', '上海'],
            [71, 46, 89, 0.86, 64, 25, '良', '上海'],
            [97, 71, 113, 1.17, 88, 31, '良', '上海'],
            [84, 57, 91, 0.85, 55, 31, '良', '上海'],
            [87, 63, 101, 0.9, 56, 41, '良', '上海'],
            [104, 77, 119, 1.09, 73, 48, '轻度', '上海'],
            [87, 62, 100, 1, 72, 28, '良', '上海'],
            [168, 128, 172, 1.49, 97, 56, '中度', '上海'],
            [65, 45, 51, 0.74, 39, 17, '良', '上海'],
            [39, 24, 38, 0.61, 47, 17, '优', '上海'],
            [39, 24, 39, 0.59, 50, 19, '优', '上海'],
            [93, 68, 96, 1.05, 79, 29, '良', '上海'],
            [188, 143, 197, 1.66, 99, 51, '中度', '上海'],
            [174, 131, 174, 1.55, 108, 50, '中度', '上海'],
            [187, 143, 201, 1.39, 89, 53, '中度', '上海']
        ];
        schema = ["AQI", "PM 2.5", "PM 10", "CO", "NO2", "SO2", "等级"];
    }
    let category_scale = await ShanhaiBI.getSetting("category-scale");
    let axis_text_color = await ShanhaiBI.getSetting("axis-text-color");
    for(let i = 0; i < schema.length; i++) {
        let item = {
            dim: i,
            name: schema[i],
            nameTextStyle: {
                color: axis_text_color
            },
        }
        if(i === schema.length - 1) {
            item.type = "category",
            item.data = category_scale.split(",");
        }
        parallel_axis.push(item)
    }

    let CATEGORY_DIM_COUNT = 6;
    let GAP = 2;
    let BASE_LEFT = 5;
    let BASE_TOP = 10;
    let GRID_WIDTH = (100 - BASE_LEFT - GAP) / CATEGORY_DIM_COUNT - GAP;
    let GRID_HEIGHT = (100 - BASE_TOP - GAP) / CATEGORY_DIM_COUNT - GAP;
    let CATEGORY_DIM = 7;
    let SYMBOL_SIZE = 4;

    let gridOption = generateGrids();
    let option = {
        animation: false,
        brush: {
            brushLink: 'all',
            xAxisIndex: gridOption.xAxis.map(function (_, idx) {
                return idx;
            }),
            yAxisIndex: gridOption.yAxis.map(function (_, idx) {
                return idx;
            }),
            inBrush: {
                opacity: 1
            }
        },
        visualMap: {
            type: 'piecewise',
            categories: legend_data,
            dimension: CATEGORY_DIM,
            orient: 'horizontal',
            top: 0,
            left: 'center',
            inRange: {
                color: await ShanhaiBI.getSetting("shape-color")
            },
            outOfRange: {
                color: '#ddd'
            },
            seriesIndex: gridOption.series.map(function (_, idx) {
                return idx;
            })
        },
        tooltip: {
            trigger: 'item'
        },
        parallelAxis: parallel_axis,
        parallel: {
            bottom: '5%',
            left: '2%',
            height: '30%',
            width: '55%',
            parallelAxisDefault: {
                type: 'value',
                name: 'AQI指数',
                nameLocation: 'end',
                nameGap: 20,
                splitNumber: 3,
                nameTextStyle: {
                    fontSize: 14
                },
                axisLine: {
                    lineStyle: {
                        color: '#555'
                    }
                },
                axisTick: {
                    alignWithLabel: await ShanhaiBI.getSetting("align-with-label"),
                    lineStyle: {
                        color: '#555'
                    }
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    color: axis_text_color
                }
            }
        },
        xAxis: gridOption.xAxis,
        yAxis: gridOption.yAxis,
        grid: gridOption.grid,
        series: [
            {
                name: 'parallel',
                type: 'parallel',
                smooth: true,
                lineStyle: {
                    width: 1,
                    opacity: 0.3
                },
                data: data
            },
            ...gridOption.series
        ]
    };
    myChart.setOption(option);

    function retrieveScatterData(data, dimX, dimY) {
        let result = [];
        for (let i = 0; i < data.length; i++) {
            let item = [data[i][dimX], data[i][dimY]];
            item[CATEGORY_DIM] = data[i][CATEGORY_DIM];
            result.push(item);
        }
        return result;
    }
    function generateGrids() {
        let index = 0;
        let grid = [];
        let xAxis = [];
        let yAxis = [];
        let series = [];
        for (let i = 0; i < CATEGORY_DIM_COUNT; i++) {
            for (let j = 0; j < CATEGORY_DIM_COUNT; j++) {
                if (CATEGORY_DIM_COUNT - i + j >= CATEGORY_DIM_COUNT) {
                    continue;
                }
                grid.push({
                    left: BASE_LEFT + i * (GRID_WIDTH + GAP) + '%',
                    top: BASE_TOP + j * (GRID_HEIGHT + GAP) + '%',
                    width: GRID_WIDTH + '%',
                    height: GRID_HEIGHT + '%'
                });
                xAxis.push({
                    splitNumber: 3,
                    position: 'top',
                    axisLine: {
                        show: j === 0,
                        onZero: false
                    },
                    axisTick: {
                        show: j === 0,
                        inside: true
                    },
                    axisLabel: {
                        color: axis_text_color,
                        show: j === 0
                    },
                    type: 'value',
                    gridIndex: index,
                    scale: true
                });
                yAxis.push({
                    splitNumber: 3,
                    position: 'right',
                    axisLine: {
                        show: i === CATEGORY_DIM_COUNT - 1,
                        onZero: false
                    },
                    axisTick: {
                        show: i === CATEGORY_DIM_COUNT - 1,
                        inside: true
                    },
                    axisLabel: {
                        color: axis_text_color,
                        show: i === CATEGORY_DIM_COUNT - 1
                    },
                    type: 'value',
                    gridIndex: index,
                    scale: true
                });
                series.push({
                    type: 'scatter',
                    symbolSize: SYMBOL_SIZE,
                    xAxisIndex: index,
                    yAxisIndex: index,
                    data: retrieveScatterData(data, i, j)
                });
                index++;
            }
        }
        return {
            grid,
            xAxis,
            yAxis,
            series
        };
    }
})();