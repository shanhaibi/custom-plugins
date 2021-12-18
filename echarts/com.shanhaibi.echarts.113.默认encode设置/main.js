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
                default: "#aaa",
                type: "color"
            },
            {
                name: "radius",
                alias: "半径(%)",
                type: "number",
                default: 20
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let rawData = await ShanhaiBI.getData();
    let category_data = rawData.getColumn("axis-category");
    let value_data = rawData.getColumns("axis-value");
    let encode_name, source = [], shapes;
    if (category_data.length && value_data.length) {
        let category_axis = await ShanhaiBI.getSetting("axis-category");
        let value_axis = await ShanhaiBI.getSetting("axis-value");
        source = [[category_axis[0].alias, ...new Set(category_data)]];
        value_axis.forEach((item, i) => {
            source.push([item.alias, ...value_data[i]]);
        });
        encode_name = category_axis[0].alias;
        shapes = [...new Set(category_data)]
    } else {
        source = [
            ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
            ['Milk Tea', 86.5, 92.1, 85.7, 83.1, 73.4, 55.1],
            ['Matcha Latte', 41.1, 30.4, 65.1, 53.3, 83.8, 98.7],
            ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4, 65.2, 82.5],
            ['Walnut Brownie', 55.2, 67.1, 69.2, 72.4, 53.9, 39.1]
        ];
        encode_name = "product";
        shapes = ['2012', '2013', '2014', '2015', '2016', '2017'];
    }
    let center_arr = [['25%', '30%'], ['75%', '30%'], ['25%', '75%'], ['75%', '75%']];
    let series = [];
    for(let i = 0; i < shapes.length; i++) {
        if(i >= center_arr.length) break;
        series.push({
            type: "pie",
            radius: (await ShanhaiBI.getSetting("radius")) + "%",
            center: center_arr[i],
            encode: {
                // No encode specified, by default, it is '2012'.
                itemName: encode_name,
                value: shapes[i]
            }
        });
    }

    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        legend: {
            textStyle: {
                color: "#aaa"
            }
        },
        tooltip: {},
        label: {
            color: await ShanhaiBI.getSetting("lebel-text-color")
        },
        dataset: {
            source: source
        },
        series: series
    };

    myChart.setOption(option);
})();