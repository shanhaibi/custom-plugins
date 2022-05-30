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
                default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
            },
            {
                name: "align-with-label",
                alias: "刻度线与标签对齐",
                type: "boolean",
                default: true
            },
            {
                name: "legend-label-color",
                alias: "文本颜色",
                type: "color",
                default: "#aaa",
                cluster: { title: "图例文本设置" }
            },
            {
                name: "legend-label-size",
                alias: "字体大小(px)",
                type: "number",
                default: 16,
                cluster: { title: "图例文本设置" }
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let rawData = await ShanhaiBI.getData();
    let category_data = rawData.getColumn("axis-category");
    let value_data = rawData.getColumns("axis-value");
    let value_dims = await ShanhaiBI.getSetting("axis-value");
    let series = [], legend_data = [];
    let useSimple = false;
    if (!category_data.length || !value_data.length) {
        useSimple = true;
        category_data = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        value_data = [
            [320, 302, 301, 334, 390, 330, 320],
            [120, 132, 101, 134, 90, 230, 210],
            [220, 182, 191, 234, 290, 330, 310],
            [150, 212, 201, 154, 190, 330, 410],
            [820, 832, 901, 934, 1290, 1330, 1320]
        ];
        legend_data = ["Direct", "Mail Ad", "Affiliate Ad", "Video Ad", "Search Engine"];
    }
    for(let i = 0; i < value_data.length; i++) {
        let series_name = useSimple ? legend_data[i] : value_dims[i].alias;
        useSimple || legend_data.push(series_name);
        series.push({
            name: series_name,
            type: "bar",
            stack: "total",
            label: {
                show: true
            },
            emphasis: {focus: "series"},
            data: value_data[i]
        })
    }

    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                // Use axis to trigger tooltip
                type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
            }
        },
        legend: {
            data: legend_data,
            textStyle: {
                color: await ShanhaiBI.getSetting("legend-label-color"),
                fontSize: await ShanhaiBI.getSetting("legend-label-size")
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            axisTick: {
                alignWithLabel: await ShanhaiBI.getSetting("align-with-label")
            },
            data: category_data
        },
        series: series
    };
    myChart.setOption(option);
})();