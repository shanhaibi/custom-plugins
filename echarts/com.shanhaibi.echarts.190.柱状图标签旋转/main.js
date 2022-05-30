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
                default: ['#5470c6', '#91cc75', '#fac858', '#ee6666'],
            },
            {
                name: "label-color",
                alias: "文本颜色",
                type: "color",
                default: "#333",
                cluster: { title: "图形文本设置" }
            },
            {
                name: "label-size",
                alias: "字体大小(px)",
                type: "number",
                default: 16,
                cluster: { title: "图形文本设置" }
            },
            {
                name: "label-rotate",
                alias: "旋转角度",
                type: "number",
                default: 90,
                cluster: { title: "图形文本设置" }
            },
            {
                name: "label-align",
                alias: "文本水平对齐",
                type: "select",
                default: "left",
                choices: [
                    {
                        label: "左对齐",
                        value: "left"
                    },
                    {
                        label: "水平居中",
                        value: "center"
                    },
                    {
                        label: "右对齐",
                        value: "right"
                    }
                ],
                cluster: { title: "图形文本设置" }
            },
            {
                name: "label-vertical-align",
                alias: "文本垂直对齐",
                type: "select",
                default: "middle",
                choices: [
                    {
                        label: "顶部对齐",
                        value: "top"
                    },
                    {
                        label: "垂直居中",
                        value: "middle"
                    },
                    {
                        label: "底部对齐",
                        value: "bottom"
                    }
                ],
                cluster: { title: "图形文本设置" }
            },
            {
                name: "label-position",
                alias: "文本位置",
                type: "select",
                default: "insideBottom",
                choices: [
                    {
                        label: "图形左侧",
                        value: "left"
                    },
                    {
                        label: "图形右侧",
                        value: "right"
                    },
                    {
                        label: "图形顶部",
                        value: "top"
                    },
                    {
                        label: "图形底部",
                        value: "bottom"
                    },
                    {
                        label: "图形内部",
                        value: "inside"
                    },
                    {
                        label: "图形内部顶部",
                        value: "insideTop"
                    },
                    {
                        label: "图形内部左侧",
                        value: "insideLeft"
                    },
                    {
                        label: "图形内部右侧",
                        value: "insideRight"
                    },
                    {
                        label: "图形内部底部",
                        value: "insideBottom"
                    },
                    {
                        label: "图形内部顶部左侧",
                        value: "insideTopLeft"
                    },
                    {
                        label: "图形内部顶部右侧",
                        value: "insideTopRight"
                    },
                    {
                        label: "图形内部底部左侧",
                        value: "insideBottomLeft"
                    },
                    {
                        label: "图形内部底部右侧",
                        value: "insideBottomRight"
                    }
                ],
                cluster: { title: "图形文本设置" }
            },
            {
                name: "label-distance",
                alias: "距图形距离",
                type: "number",
                default: 15,
                cluster: { title: "图形文本设置" }
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let labelOption = {
        show: true,
        color: await ShanhaiBI.getSetting("label-color"),
        rotate: await ShanhaiBI.getSetting("label-rotate"),
        position: await ShanhaiBI.getSetting("label-position"),
        distance: await ShanhaiBI.getSetting("label-distance"),
        align: await ShanhaiBI.getSetting("label-align"),
        verticalAlign: await ShanhaiBI.getSetting("label-vertical-align"),
        formatter: '{c}  {name|{a}}',
        fontSize: await ShanhaiBI.getSetting("label-size"),
        rich: {
            name: {}
        }
    };
    let rawData = await ShanhaiBI.getData();
    let category_data = rawData.getColumn("axis-category");
    let value_data = rawData.getColumns("axis-value");
    let value_dims = await ShanhaiBI.getSetting("axis-value");
    let legend_data = [];
    let useSimple = false;
    if (!category_data.length || !value_data.length) {
        useSimple = true;
        legend_data = ['Forest', 'Steppe', 'Desert', 'Wetland'];
        category_data = ['2012', '2013', '2014', '2015', '2016'];
        value_data = [
            [320, 332, 301, 334, 390],
            [220, 182, 191, 234, 290],
            [150, 232, 201, 154, 190],
            [98, 77, 101, 99, 40]
        ];
    }
    let series = [];
    for (let i = 0; i < value_data.length; i++) {
        let series_name = useSimple ? legend_data[i] : value_dims[i].alias;
        useSimple || legend_data.push(series_name);
        series.push({
            name: series_name,
            type: "bar",
            barGap: 0,
            label: labelOption,
            emphasis: {
                focus: "series"
            },
            data: value_data[i]
        })
    }
    
    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: legend_data,
            textStyle: {
                color: "#aaa"
            }
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
                mark: { show: true },
                magicType: { show: true, type: ['line', 'bar', 'stack'] },
                restore: { show: true },
            }
        },
        xAxis: [
            {
                type: 'category',
                axisTick: { show: false },
                data: category_data
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: series
    };
    myChart.setOption(option);
})();