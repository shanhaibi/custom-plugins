(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-x",
                alias: "x轴字段",
                type: "axis",
            },
            {
                name: "axis-y",
                alias: "y轴字段",
                type: "axis"
            }
        ],
        "format": [
            {
                name: "title",
                alias: "标题",
                type: "boolean",
                default: true
            },
            {
                name: "text-color",
                alias: "标题颜色",
                type: "color",
                default: "#fff",
            },
            {
                name: "start-color",
                alias: "起始颜色",
                type: "palette",
                default: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00']
            },
            {
                name: "end-color",
                alias: "结束颜色",
                type: "palette",
                default: ["#01bfec", "#4d77ff", "#7415db", "#87009d", "#e03e4c"]
            }

        ]
    })
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let data = await ShanhaiBI.getData();
    let x_data = data.getColumns("axis-x", 0);
    let y_data = data.getColumns("axis-y");
    let legend_data = [];
    let series = [];
    if (x_data.length && y_data.length) {
        let yAxis = await ShanhaiBI.getSetting("axis-y");
        for (let index = 0; index < yAxis.length; index++) {
            legend_data.push(yAxis[index].alias);
        }
    } else {
        x_data = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        legend_data = ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'];
        y_data = [
            [140, 232, 101, 264, 90, 340, 250],
            [120, 282, 111, 234, 220, 340, 310],
            [320, 132, 201, 334, 190, 130, 220],
            [220, 402, 231, 134, 190, 230, 120],
            [220, 302, 181, 234, 210, 290, 150]
        ];
    }
    for (let i = 0; i < y_data.length; i++) {
        series.push({
            name: legend_data[i],
            type: "line",
            stack: "Total",
            smooth: true,
            showSymbol: false,
            lineStyle: {
                width: 0
            },
            areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: (await ShanhaiBI.getSetting("start-color"))[i]
                    },
                    {
                        offset: 1,
                        color: (await ShanhaiBI.getSetting("end-color"))[i]
                    }
                ])
            },
            emphasis: {
                focus: 'series'
            },
            data: y_data[i],
        });
    }

    let option = {
        title: {
            text: 'Gradient Stacked Area Chart',
            show: await ShanhaiBI.getSetting("title"),
            textStyle: {
                color: await ShanhaiBI.getSetting("text-color")
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: legend_data,
            top: 30,
            textStyle: {
                color: "#aaa"
            },
        },
        grid: {
            top: "12%",
            left: "2%",
            right: "2%",
            bottom: "4%",
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: x_data
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series
    };
    myChart.setOption(option);
})()