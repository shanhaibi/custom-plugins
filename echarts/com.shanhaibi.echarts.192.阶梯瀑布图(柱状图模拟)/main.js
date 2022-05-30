(async function () {
    await ShanhaiBI.initSettings({
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

    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        title: {
            text: 'Accumulated Waterfall Chart'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function (params) {
                let tar;
                if (params[1].value !== '-') {
                    tar = params[1];
                } else {
                    tar = params[0];
                }
                return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
            }
        },
        legend: {
            data: ['Expenses', 'Income'],
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
            type: 'category',
            data: (function () {
                let list = [];
                for (let i = 1; i <= 11; i++) {
                    list.push('Nov ' + i);
                }
                return list;
            })(),
            axisTick: {
                alignWithLabel: await ShanhaiBI.getSetting("align-with-label")
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Placeholder',
                type: 'bar',
                stack: 'Total',
                itemStyle: {
                    borderColor: 'transparent',
                    color: 'transparent'
                },
                emphasis: {
                    itemStyle: {
                        borderColor: 'transparent',
                        color: 'transparent'
                    }
                },
                data: [0, 900, 1245, 1530, 1376, 1376, 1511, 1689, 1856, 1495, 1292]
            },
            {
                name: 'Income',
                type: 'bar',
                stack: 'Total',
                label: {
                    show: true,
                    position: 'top',
                    color: "#aaa"
                },
                data: [900, 345, 393, '-', '-', 135, 178, 286, '-', '-', '-']
            },
            {
                name: 'Expenses',
                type: 'bar',
                stack: 'Total',
                label: {
                    show: true,
                    position: 'bottom',
                    color: "#aaa"
                },
                data: ['-', '-', '-', 108, 154, '-', '-', '-', 119, 361, 203]
            }
        ]
    };
    myChart.setOption(option);
})();