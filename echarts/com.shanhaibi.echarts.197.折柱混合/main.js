(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-category",
                alias: "分类字段",
                type: "axis"
            },
            {
                name: "axis-bar",
                alias: "柱体字段",
                type: "axis"
            },
            {
                name: "axis-line",
                alias: "折线字段",
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
                default: true,
            },
            {
                name: "bar-y-min-scale",
                alias: "y轴最小刻度",
                type: "number",
                default: 0,
                cluster: {title: "柱状图y轴设置"}
            },
            {
                name: "bar-y-max-scale",
                alias: "y轴最大刻度",
                type: "number",
                default: 250,
                cluster: {title: "柱状图y轴设置"}
            },
            {
                name: "bar-y-unit",
                alias: "y轴单位",
                type: "string",
                default: "ml",
                cluster: {title: "柱状图y轴设置"}
            },
            {
                name: "line-y-min-scale",
                alias: "y轴最小值",
                type: "number",
                default: 0,
                cluster: {title: "折线y轴设置"}
            },
            {
                name: "line-y-max-scale",
                alias: "y轴最大值",
                type: "number",
                default: 25,
                cluster: {title: "折线y轴设置"}
            },
            {
                name: "line-y-unit",
                alias: "y轴单位",
                type: "string",
                default: "°C",
                cluster: {title: "折线y轴设置"}
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let bar_y_unit = await ShanhaiBI.getSetting("bar-y-unit");
    let line_y_unit = await ShanhaiBI.getSetting("line-y-unit");
    let rawData = await ShanhaiBI.getData();
    let category_data = rawData.getColumn("axis-category");
    let bar_data = rawData.getColumns("axis-bar");
    let line_data = rawData.getColumn("axis-line");
    let bar_dims = await ShanhaiBI.getSetting("axis-bar");
    let series = [], legend_data = ['Evaporation', 'Precipitation', 'Temperature'];
    let useSimple = false;
    if (!category_data.length || !bar_data.length) {
        useSimple = true;
        legend_data = ['Evaporation', 'Precipitation', 'Temperature'];
        category_data = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        bar_data = [
            [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
            [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
        ];
        line_data = [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2];
    }
    for (let i = 0; i < bar_data.length; i++) {
        let series_name = useSimple ? legend_data[i] : bar_dims[i].alias;
        useSimple || legend_data.push(series_name);
        series.push({
            name: series_name,
            type: "bar",
            data: bar_data[i]
        });
    }
    if (line_data.length) {
        let line_dims = await ShanhaiBI.getSetting("axis-line");
        let series_name = useSimple ? legend_data[2] : line_dims[0].alias;
        useSimple || legend_data.push(series_name);
        series.push({
            name: series_name,
            type: "line",
            yAxisIndex: 1,
            data: line_data
        });
    }

    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        toolbox: {
            feature: {
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
            }
        },
        legend: {
            data: legend_data,
            textStyle: {
                color: "#aaa"
            }
        },
        xAxis: [
            {
                type: 'category',
                data: category_data,
                axisPointer: {
                    type: 'shadow'
                },
                axisTick: {
                    alignWithLabel: await ShanhaiBI.getSetting("align-with-label")
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: 'Precipitation',
                min: await ShanhaiBI.getSetting("bar-y-min-scale"),
                max: await ShanhaiBI.getSetting("bar-y-max-scale"),
                axisLabel: {
                    formatter: '{value} ' + bar_y_unit
                }
            },
            {
                show: line_data.length ? true : false,
                type: 'value',
                name: 'Temperature',
                min: await ShanhaiBI.getSetting("line-y-min-scale"),
                max: await ShanhaiBI.getSetting("line-y-max-scale"),
                axisLabel: {
                    formatter: '{value} ' + line_y_unit
                }
            }
        ],
        series: series
    };
    myChart.setOption(option);
})();