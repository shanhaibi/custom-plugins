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
                alias: "半径(px)",
                type: "number",
                default: 50
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let radius = await ShanhaiBI.getSetting("radius");
    let rawData = await ShanhaiBI.getData();
    let category_data = rawData.getColumn("axis-category");
    let value_data = rawData.getColumns("axis-value");
    let dataset, filter_dim, source = [], category_arr;
    if (category_data.length && value_data.length) {
        let category_axis = await ShanhaiBI.getSetting("axis-category");
        let value_axis = await ShanhaiBI.getSetting("axis-value");
        category_arr = [...new Set(category_data)];
        filter_dim = category_axis[0].alias;
        source = [["分类", "取值", filter_dim]];
        for (let i = 0; i < category_data.length; i++) {
            for (let index = 0; index < value_axis.length; index++) {
                source.push([value_axis[index].alias, value_data[index][i], category_data[i]]);
            }
        }
    } else {
        filter_dim = "Year";
        category_arr = [2011, 2012, 2013];
        source = [
            ['Product', 'Price', 'Year'],
            ['Cake', 123, 2011],
            ['Cereal', 231, 2011],
            ['Tofu', 235, 2011],
            ['Dumpling', 341, 2011],
            ['Biscuit', 122, 2011],
            ['Cake', 143, 2012],
            ['Cereal', 201, 2012],
            ['Tofu', 255, 2012],
            ['Dumpling', 241, 2012],
            ['Biscuit', 102, 2012],
            ['Cake', 153, 2013],
            ['Cereal', 181, 2013],
            ['Tofu', 395, 2013],
            ['Dumpling', 281, 2013],
            ['Biscuit', 92, 2013],
            ['Cake', 223, 2014],
            ['Cereal', 211, 2014],
            ['Tofu', 345, 2014],
            ['Dumpling', 211, 2014],
            ['Biscuit', 72, 2014]
        ]
    }
    dataset = [{ source }];
    for (let i = 0; i < category_arr.length; i++) {
        dataset.push({
            transform: {
                type: 'filter',
                config: { dimension: filter_dim, value: category_arr[i] }
            }
        })
    }
    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        dataset: dataset,
        label: { color: await ShanhaiBI.getSetting("lebel-text-color") },
        series: [
            {
                type: 'pie',
                radius: radius,
                center: ['50%', '25%'],
                datasetIndex: 1
            },
            {
                type: 'pie',
                radius: radius,
                center: ['50%', '50%'],
                datasetIndex: 2
            },
            {
                type: 'pie',
                radius: radius,
                center: ['50%', '75%'],
                datasetIndex: 3
            }
        ],
        // Optional. Only for responsive layout:
        media: [
            {
                query: { minAspectRatio: 1 },
                option: {
                    series: [
                        { center: ['25%', '50%'] },
                        { center: ['50%', '50%'] },
                        { center: ['75%', '50%'] }
                    ]
                }
            },
            {
                option: {
                    series: [
                        { center: ['50%', '25%'] },
                        { center: ['50%', '50%'] },
                        { center: ['50%', '75%'] }
                    ]
                }
            }
        ]
    };

    myChart.setOption(option);
})();