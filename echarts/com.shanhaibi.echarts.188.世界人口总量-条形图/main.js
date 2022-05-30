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
                default: ['#5470c6', '#91cc75'],
            },
            {
                name: "align-with-label",
                alias: "刻度线与标签对齐",
                type: "boolean",
                default: false
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let rawData = await ShanhaiBI.getData();
    let category_data = rawData.getColumn("axis-category");
    let value_data = rawData.getColumns("axis-value");
    let value_dims = await ShanhaiBI.getSetting("axis-value");
    let use_simple = false;
    if(!category_data.length || !value_data.length) {
        use_simple = true;
        category_data = ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World'];
        value_data = [
            [18203, 23489, 29034, 104970, 131744, 630230],
            [19325, 23438, 31000, 121594, 134141, 681807]
        ];
    }
    let series = [], legend_data = ["2011", "2012"];
    for(let i = 0; i < value_data.length; i++) {
        let series_name = use_simple ? legend_data[i] : value_dims[i].alias;
        series.push({
            name: series_name,
            type: "bar",
            data: value_data[i]
        })
    }

    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        title: {
            text: 'World Population'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            textStyle: { color: "#aaa" }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: category_data,
            axisTick: {
                alignWithLabel: await ShanhaiBI.getSetting("align-with-label")
            }
        },
        series: series
    };
    myChart.setOption(option);
})();