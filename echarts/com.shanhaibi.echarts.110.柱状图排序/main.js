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
        ],
        "format": [
            {
                name: "shape-color",
                type: "color",
                default: "#82c0f7",
                alias: "图形颜色"
            },
            {
                name: "sort",
                alias: "排序",
                type: "select",
                choices: [
                    {
                        label: "降序排列",
                        value: "desc"
                    },
                    {
                        label: "升序排列",
                        value: "asc"
                    },
                    {
                        label: "不排序",
                        value: "normal"
                    }
                ],
                default: "desc",
            },
            {
                name: "align-with-label",
                alias: "刻度线与标签对齐",
                type: "boolean",
                default: true
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let sort = await ShanhaiBI.getSetting("sort");
    let rawData = await ShanhaiBI.getData();
    let category_data = rawData.getColumn("axis-category");
    let value_data = rawData.getColumn("axis-value");
    let dimensions = [], encode, source = [], sort_dim;
    if(value_data.length && category_data.length) {
        let value_axis = await ShanhaiBI.getSetting("axis-value");
        let category_axis = await ShanhaiBI.getSetting("axis-category");
        dimensions.push(category_axis[0].alias, value_axis[0].alias);
        encode = { x: dimensions[0], y: dimensions[1] };
        sort_dim = dimensions[1];
        for(let i = 0; i < category_data.length; i++) {
            source.push([category_data[i], value_data[i]]);
        }
    } else {
        dimensions = ['name', 'age', 'profession', 'score', 'date'];
        encode = { x: 'name', y: 'score' };
        source = [
            ['Hannah Krause', 41, 'Engineer', 314, '2011-02-12'],
            ['Zhao Qian', 20, 'Teacher', 351, '2011-03-01'],
            ['Jasmin Krause ', 52, 'Musician', 287, '2011-02-14'],
            ['Li Lei', 37, 'Teacher', 219, '2011-02-18'],
            ['Karle Neumann', 25, 'Engineer', 253, '2011-04-02'],
            ['Adrian Groß', 19, 'Teacher', '-', '2011-01-16'],
            ['Mia Neumann', 71, 'Engineer', 165, '2011-03-19'],
            ['Böhm Fuchs', 36, 'Musician', 318, '2011-02-24'],
            ['Han Meimei', 67, 'Engineer', 366, '2011-03-12']
        ];
        sort_dim = "score";
    }
    let dataset = [{dimensions, source}];
    let isSort = sort !== "normal";
    if(isSort) {
        dataset.push({
            transform: {
                type: "sort",
                config: {dimension: sort_dim, order: sort}
            }
        })
    }

    let option = {
        tooltip: {},
        dataset: dataset,
        xAxis: {
            type: 'category',
            axisLabel: { interval: 0, rotate: 30 },
            axisTick: {
                alignWithLabel: await ShanhaiBI.getSetting("align-with-label"),
            },
        },
        axisLabel: {
            color: "#aaa"
        },
        yAxis: {},
        series: {
            type: 'bar',
            color: await ShanhaiBI.getSetting("shape-color"),
            encode: encode,
            datasetIndex: isSort ? 1 : 0
        }
    };
    myChart.setOption(option);
})();