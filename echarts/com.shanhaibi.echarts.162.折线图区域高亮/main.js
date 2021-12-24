(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-x",
                alias: "x轴字段",
                type: "axis"
            },
            {
                name: "axis-y",
                alias: "y轴字段",
                type: "axis"
            }
        ],
        "format": [
            {
                name: "line-color",
                alias: "线条颜色",
                type: "color",
                default: "#5470c6",
                cluster: { title: "线段设置" }
            },
            {
                name: "line-width",
                alias: "线条宽度",
                type: "number",
                default: 5,
                cluster: { title: "线段设置" }
            },
            {
                name: "area-start-index",
                alias: "高亮区域起始下标",
                type: "number",
                default: 1,
                cluster: { title: "高亮区域设置" }
            },
            {
                name: "area-end-index",
                alias: "高亮区域结束下标",
                type: "number",
                default: 3,
                cluster: { title: "高亮区域设置" }
            },
            {
                name: "area-color",
                alias: "高亮区域颜色",
                type: "color",
                default: "rgba(0, 0, 180, 0.4)",
                cluster: { title: "高亮区域设置" }
            },
            {
                name: "mark-line-color",
                alias: "分割线颜色",
                type: "color",
                default: "#0000b4",
                cluster: { title: "高亮区域设置" }
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let area_start_index = await ShanhaiBI.getSetting("area-start-index");
    let area_end_index = await ShanhaiBI.getSetting("area-end-index");
    let rawData = await ShanhaiBI.getData();
    let x_data = rawData.getColumn("axis-x");
    let y_data = rawData.getColumn("axis-y");
    let data = [
        ['2019-10-10', 200],
        ['2019-10-11', 560],
        ['2019-10-12', 750],
        ['2019-10-13', 580],
        ['2019-10-14', 250],
        ['2019-10-15', 300],
        ['2019-10-16', 450],
        ['2019-10-17', 300],
        ['2019-10-18', 100]
    ]
    if (x_data.length && y_data.length) {
        data = [];
        for (let i = 0; i < x_data.length; i++) {
            data.push([x_data[i], y_data[i]])
        }
    }

    let option = {
        xAxis: {
            type: 'category',
            boundaryGap: false
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '30%']
        },
        visualMap: {
            type: 'piecewise',
            show: false,
            dimension: 0,
            seriesIndex: 0,
            pieces: [
                {
                    gt: area_start_index,
                    lt: area_end_index,
                    color: await ShanhaiBI.getSetting("area-color")
                }
            ]
        },
        series: [
            {
                type: 'line',
                smooth: 0.6,
                symbol: 'none',
                lineStyle: {
                    color: await ShanhaiBI.getSetting("line-color"),
                    width: await ShanhaiBI.getSetting("line-width")
                },
                markLine: {
                    symbol: ['none', 'none'],
                    label: { show: false },
                    data: [{ xAxis: area_start_index }, { xAxis: area_end_index }],
                    itemStyle: {
                        color: await ShanhaiBI.getSetting("mark-line-color")
                    }
                },
                areaStyle: {},
                data: data
            }
        ]
    };
    myChart.setOption(option);
})();