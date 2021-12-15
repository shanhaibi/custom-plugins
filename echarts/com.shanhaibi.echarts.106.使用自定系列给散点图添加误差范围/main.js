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
                type: "color",
                default: "#77bef7",
                alias: "图形颜色"
            },
            {
                name: "scatter-size",
                alias: "散点大小(px)",
                type: "number",
                default: 12
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let rawData = await ShanhaiBI.getData();
    let category_data = rawData.getColumn("axis-category");
    let value_data = rawData.getColumns("axis-value");
    let dimensions = [
        'name', 'Price', 'Prime cost', 'Prime cost min', 'Prime cost max', 'Price min', 'Price max'
    ];
    let data = [
        ['Blouse "Blue Viola"', 101.88, 99.75, 76.75, 116.75, 69.88, 119.88],
        ['Dress "Daisy"', 155.8, 144.03, 126.03, 156.03, 129.8, 188.8],
        ['Trousers "Cutesy Classic"', 203.25, 173.56, 151.56, 187.56, 183.25, 249.25],
        ['Dress "Morning Dew"', 256, 120.5, 98.5, 136.5, 236, 279],
        ['Turtleneck "Dark Chocolate"', 408.89, 294.75, 276.75, 316.75, 385.89, 427.89],
        ['Jumper "Early Spring"', 427.36, 430.24, 407.24, 452.24, 399.36, 461.36],
        ['Breeches "Summer Mood"', 356, 135.5, 123.5, 151.5, 333, 387],
        ['Dress "Mauve Chamomile"', 406, 95.5, 73.5, 111.5, 366, 429],
        ['Dress "Flying Tits"', 527.36, 503.24, 488.24, 525.24, 485.36, 551.36],
        ['Dress "Singing Nightingales"', 587.36, 543.24, 518.24, 555.24, 559.36, 624.36],
        ['Sundress "Cloudy weather"', 603.36, 407.24, 392.24, 419.24, 581.36, 627.36],
        ['Sundress "East motives"', 633.36, 477.24, 445.24, 487.24, 594.36, 652.36],
        ['Sweater "Cold morning"', 517.36, 437.24, 416.24, 454.24, 488.36, 565.36],
        ['Trousers "Lavender Fields"', 443.36, 387.24, 370.24, 413.24, 412.36, 484.36],
        ['Jumper "Coffee with Milk"', 543.36, 307.24, 288.24, 317.24, 509.36, 574.36],
        ['Blouse "Blooming Cactus"', 790.36, 277.24, 254.24, 295.24, 764.36, 818.36],
        ['Sweater "Fluffy Comfort"', 790.34, 678.34, 660.34, 690.34, 762.34, 824.34]
    ];
    if(category_data.length && value_data.length) {
        data = [];
        for(let i = 0; i < category_data.length; i++) {
            let item = [category_data[i]];
            value_data.forEach((value, idx) => {
                item.push(value_data[idx][i]);
            })
            data.push(item);
        }
        let category_axis = await ShanhaiBI.getSetting("axis-category");
        let value_axis = await ShanhaiBI.getSetting("axis-value");
        dimensions = [category_axis[0].alias];
        value_axis.forEach(dim => {
            dimensions.push(dim.alias);
        })
    }

    let option = {
        color: shape_color,
        tooltip: {},
        legend: {
            data: ['bar', 'error'],
        },
        dataZoom: [
            {
                type: 'slider'
            },
            {
                type: 'inside'
            }
        ],
        grid: {
            bottom: 80
        },
        xAxis: {},
        yAxis: {},
        series: [
            {
                type: 'scatter',
                name: 'error',
                data: data,
                dimensions: dimensions,
                symbolSize: await ShanhaiBI.getSetting("scatter-size"),
                encode: {
                    x: 2,
                    y: 1,
                    tooltip: [2, 1, 3, 4, 5, 6],
                    itemName: 0
                },
            },
            {
                type: 'custom',
                name: 'error',
                renderItem: renderItem,
                dimensions: dimensions,
                encode: {
                    x: [2, 3, 4],
                    y: [1, 5, 6],
                    tooltip: [2, 1, 3, 4, 5, 6],
                    itemName: 0
                },
                data: data,
                z: 100
            }
        ]
    };
    myChart.setOption(option);

    function renderItem(params, api) {
        let group = {
            type: 'group',
            children: []
        };
        let coordDims = ['x', 'y'];
        for (let baseDimIdx = 0; baseDimIdx < 2; baseDimIdx++) {
            let otherDimIdx = 1 - baseDimIdx;
            let encode = params.encode;
            let baseValue = api.value(encode[coordDims[baseDimIdx]][0]);
            let param = [];
            param[baseDimIdx] = baseValue;
            param[otherDimIdx] = api.value(encode[coordDims[otherDimIdx]][1]);
            let highPoint = api.coord(param);
            param[otherDimIdx] = api.value(encode[coordDims[otherDimIdx]][2]);
            let lowPoint = api.coord(param);
            let halfWidth = 5;
            let style = api.style({
                stroke: api.visual('color'),
                fill: undefined
            });
            group.children.push(
                {
                    type: 'line',
                    transition: ['shape'],
                    shape: makeShape(
                        baseDimIdx,
                        highPoint[baseDimIdx] - halfWidth,
                        highPoint[otherDimIdx],
                        highPoint[baseDimIdx] + halfWidth,
                        highPoint[otherDimIdx]
                    ),
                    style: style
                },
                {
                    type: 'line',
                    transition: ['shape'],
                    shape: makeShape(
                        baseDimIdx,
                        highPoint[baseDimIdx],
                        highPoint[otherDimIdx],
                        lowPoint[baseDimIdx],
                        lowPoint[otherDimIdx]
                    ),
                    style: style
                },
                {
                    type: 'line',
                    transition: ['shape'],
                    shape: makeShape(
                        baseDimIdx,
                        lowPoint[baseDimIdx] - halfWidth,
                        lowPoint[otherDimIdx],
                        lowPoint[baseDimIdx] + halfWidth,
                        lowPoint[otherDimIdx]
                    ),
                    style: style
                }
            );
        }
        function makeShape(baseDimIdx, base1, value1, base2, value2) {
            let shape = {};
            shape[coordDims[baseDimIdx] + '1'] = base1;
            shape[coordDims[1 - baseDimIdx] + '1'] = value1;
            shape[coordDims[baseDimIdx] + '2'] = base2;
            shape[coordDims[1 - baseDimIdx] + '2'] = value2;
            return shape;
        }
        return group;
    }
})();