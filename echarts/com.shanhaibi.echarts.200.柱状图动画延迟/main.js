(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#5470C6', '#91CC75'],
            },
            {
                name: "toolbox",
                alias: "显示工具栏",
                type: "boolean",
                default: true,
            },
            {
                name: "legend-label-color",
                alias: "文本颜色",
                type: "color",
                default: "#aaa",
                cluster: { title: "图例设置" }
            },
            {
                name: "legend-label-size",
                alias: "字体大小(px)",
                type: "number",
                default: 12,
                cluster: { title: "图例设置" }
            },
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let xAxisData = [];
    let data1 = [];
    let data2 = [];
    for (let i = 0; i < 100; i++) {
        xAxisData.push('A' + i);
        data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
        data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
    }
    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        title: {
            text: 'Bar Animation Delay'
        },
        legend: {
            data: ['bar', 'bar2'],
            textStyle: {
                color: await ShanhaiBI.getSetting("legend-label-color"),
                fontSize: await ShanhaiBI.getSetting("legend-label-size")
            }
        },
        toolbox: {
            show: await ShanhaiBI.getSetting("toolbox"),
            feature: {
                magicType: {
                    type: ['stack']
                },
            }
        },
        tooltip: {},
        xAxis: {
            data: xAxisData,
            splitLine: {
                show: false
            },
        },
        yAxis: {},
        series: [
            {
                name: 'bar',
                type: 'bar',
                data: data1,
                emphasis: {
                    focus: 'series'
                },
                animationDelay: function (idx) {
                    return idx * 10;
                }
            },
            {
                name: 'bar2',
                type: 'bar',
                data: data2,
                emphasis: {
                    focus: 'series'
                },
                animationDelay: function (idx) {
                    return idx * 10 + 100;
                }
            }
        ],
        animationEasing: 'elasticOut',
        animationDelayUpdate: function (idx) {
            return idx * 5;
        }
    };
    myChart.setOption(option);
})();