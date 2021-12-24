(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-date",
                alias: "日期字段",
                type: "axis",
            },
            {
                name: "axis-value",
                alias: "取值字段",
                type: "axis",
                max: 2
            }
        ],
        "format": [
            {
                name: "line-color",
                alias: "线段颜色",
                type: "color",
                default: "#5873c6",
            },
            {
                name: "line-width",
                alias: "线条宽度(px)",
                type: "number",
                default: 3,
            },
            {
                name: "series-shape-type",
                alias: "折线形状",
                type: "select",
                default: "smooth",
                choices: [
                    {
                        label: "折线",
                        value: "line"
                    },
                    {
                        label: "平滑",
                        value: "smooth"
                    }
                ],
            },
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let line_shape_type = await ShanhaiBI.getSetting("series-shape-type");
    let rawData = await ShanhaiBI.getData();
    let date_rows = rawData.getColumn("axis-date");
    let value_rows = rawData.getColumn("axis-value");
    let data = [];
    if (date_rows.length && value_rows.length) {
        for (let i = 0; i < date_rows.length; i++) {
            let date = new Date(date_rows[i]);
            data.push([+ date, value_rows[i]]);
        }
    } else {
        let base = +new Date(1988, 9, 3);
        let oneDay = 24 * 3600 * 1000;
        data.push([base, Math.random() * 300]);
        for (let i = 1; i < 20000; i++) {
            let now = new Date((base += oneDay));
            data.push([+now, Math.round((Math.random() - 0.5) * 20 + data[i - 1][1])]);
        }
    }
    let option = {
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '10%'];
            },
            confine: true
        },
        title: {
            left: 'center',
            text: 'Large Ara Chart'
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
            }
        },
        xAxis: {
            type: 'time',
            boundaryGap: false
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
        },
        dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 20
            },
            {
                start: 0,
                end: 20
            }
        ],
        series: [
            {
                name: 'Fake Data',
                type: 'line',
                color: await ShanhaiBI.getSetting("line-color"),
                lineStyle: {
                    width: await ShanhaiBI.getSetting("line-width")
                },
                smooth: line_shape_type === "smooth" ? true : false,
                symbol: 'none',
                areaStyle: {},
                data: data
            }
        ]
    };
    myChart.setOption(option);
})();