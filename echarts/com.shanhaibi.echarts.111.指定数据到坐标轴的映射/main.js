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
            },
            {
                name: "axis-score",
                alias: "评分字段",
                type: "axis"
            }
        ],
        "format": [
            {
                name: "shape-color",
                type: "palette",
                default: ['#65B581', '#FFCE34', '#FD665F'],
                alias: "图形颜色"
            },
            {
                name: "tooltip",
                alias: "显示提示信息",
                type: "boolean",
                default: true
            },
            {
                name: "align-with-label",
                alias: "刻度线与标签对齐",
                type: "boolean",
                default: true
            },
            {
                name: "lowest-score",
                alias: "最低评分",
                type: "number",
                default: 10
            },
            {
                name: "highest-score",
                alias: "最高评分",
                type: "number",
                default: 100
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let rawData = await ShanhaiBI.getData();
    let category_data = rawData.getColumn("axis-category");
    let value_data = rawData.getColumn("axis-value");
    let score_data = rawData.getColumn("axis-score");
    let dataset, encode, source = [], axis_name;
    if (value_data.length && category_data.length && score_data.length) {
        let category_axis = await ShanhaiBI.getSetting("axis-category");
        let score_axis = await ShanhaiBI.getSetting("axis-score");
        let value_axis = await ShanhaiBI.getSetting("axis-value");
        source = [[score_axis[0].alias, value_axis[0].alias, category_axis[0].alias]];
        encode = { x: value_axis[0].alias, y: category_axis[0].alias };
        axis_name = value_axis[0].alias;
        for (let i = 0; i < category_data.length; i++) {
            source.push([score_data[i], value_data[i], category_data[i]]);
        }
    } else {
        encode = {
            // Map the "amount" column to X axis.
            x: 'amount',
            // Map the "product" column to Y axis
            y: 'product'
        };
        axis_name = "anmount"
        source = [
            ['score', 'amount', 'product'],
            [89.3, 58212, 'Matcha Latte'],
            [57.1, 78254, 'Milk Tea'],
            [74.4, 41032, 'Cheese Cocoa'],
            [50.1, 12755, 'Cheese Brownie'],
            [89.7, 20145, 'Matcha Cocoa'],
            [68.1, 79146, 'Tea'],
            [19.6, 91852, 'Orange Juice'],
            [10.6, 101852, 'Lemon Juice'],
            [32.7, 20112, 'Walnut Brownie']
        ];
    }
    dataset = [{ source }];

    let option = {
        tooltip: {
            show: await ShanhaiBI.getSetting("tooltip")
        },
        dataset,
        grid: { containLabel: true },
        xAxis: { name: axis_name },
        yAxis: {
            type: 'category',
            axisTick: {
                alignWithLabel: await ShanhaiBI.getSetting("align-with-label"),
            }
        },
        visualMap: {
            orient: 'horizontal',
            left: 'center',
            min: await ShanhaiBI.getSetting("highest-score"),
            max: await ShanhaiBI.getSetting("lowest-score"),
            text: ['High Score', 'Low Score'],
            textStyle: {
                color: "#aaa"
            },
            // Map the score column to color
            dimension: 0,
            inRange: {
                color: await ShanhaiBI.getSetting("shape-color")
            }
        },
        axisLabel: {
            color: "#aaa"
        },
        series: [
            {
                type: 'bar',
                encode
            }
        ]
    };
    myChart.setOption(option);
})();