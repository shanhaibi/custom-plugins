(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-category",
                alias: "分类字段",
                type: "axis"
            },
            {
                name: "axis-rainfall",
                alias: "降雨量字段",
                type: "axis"
            },
            {
                name: "axis-evaporation",
                alias: "蒸发量字段",
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
                name: "mark-label-color",
                alias: "文本颜色",
                type: "color",
                default: "#aaa",
                cluster: { title: "标线文本设置" }
            },
            {
                name: "mark-label-size",
                alias: "字体大小(px)",
                type: "number",
                default: 16,
                cluster: { title: "标线文本设置" }
            },
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let label_style = {
        color: await ShanhaiBI.getSetting("mark-label-color"),
        fontSize: await ShanhaiBI.getSetting("mark-label-size")
    };
    let rawData = await ShanhaiBI.getData();
    let category_data = rawData.getColumn("axis-category");
    let rainfall_data = rawData.getColumn("axis-rainfall");
    let evaporation_data = rawData.getColumn("axis-evaporation");
    if (!category_data.length || !rainfall_data.length || !evaporation_data.length) {
        category_data = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        rainfall_data = [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3];
        evaporation_data = [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.3, 48.7, 18.8, 6.0, 2.4];
    }

    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        title: {
            text: 'Rainfall vs Evaporation',
            subtext: 'Fake Data'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['Rainfall', 'Evaporation'],
            textStyle: {color: "#aaa"}
        },
        toolbox: {
            show: true,
            feature: {
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
            }
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                // prettier-ignore
                data: rainfall_data,
                axisTick: {
                    alignWithLabel: await ShanhaiBI.getSetting("align-with-label")
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'Rainfall',
                type: 'bar',
                data: rainfall_data,
                markPoint: {
                    data: [
                        { type: 'max', name: 'Max' },
                        { type: 'min', name: 'Min' }
                    ],
                    label: label_style
                },
                markLine: {
                    data: [{ type: 'average', name: 'Avg' }],
                    label: label_style
                },
            },
            {
                name: 'Evaporation',
                type: 'bar',
                data: evaporation_data,
                markPoint: {
                    data: [
                        { type: 'max', name: 'Max' },
                        { type: 'min', name: 'Min' }
                    ],
                    label: label_style
                },
                markLine: {
                    data: [{ type: 'average', name: 'Avg' }],
                    label: label_style
                },
            }
        ]
    };
    myChart.setOption(option);
})();