(async function () {
    await ShanhaiBI.initSettings({
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
            },
            {
                name: "shape-shadow-color",
                alias: "阴影颜色",
                type: "color",
                default: "rgba(0,0,0,0.3)",
                cluster: {title: "图形高亮设置"}
            },
            {
                name: "shape-shadow-blur",
                alias: "阴影模糊度",
                type: "number",
                default: 10,
                cluster: {title: "图形高亮设置"}
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let xAxisData = [];
    let data1 = [];
    let data2 = [];
    let data3 = [];
    let data4 = [];
    for (let i = 0; i < 10; i++) {
        xAxisData.push('Class' + i);
        data1.push(+(Math.random() * 2).toFixed(2));
        data2.push(+(Math.random() * 5).toFixed(2));
        data3.push(+(Math.random() + 0.3).toFixed(2));
        data4.push(+Math.random().toFixed(2));
    }
    let emphasisStyle = {
        itemStyle: {
            shadowBlur: await ShanhaiBI.getSetting("shape-shadow-blur"),
            shadowColor: await ShanhaiBI.getSetting("shape-shadow-color")
        }
    };
    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        legend: {
            data: ['bar', 'bar2', 'bar3', 'bar4'],
            left: '10%',
            textStyle: {
                color: await ShanhaiBI.getSetting("legend-label-color"),
                fontSize: await ShanhaiBI.getSetting("legend-label-size")
            }
        },
        brush: {
            toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
            xAxisIndex: 0
        },
        toolbox: {
            feature: {
                magicType: {
                    type: ['stack']
                },
            }
        },
        tooltip: {},
        xAxis: {
            data: xAxisData,
            name: 'X Axis',
            axisLine: { onZero: true },
            splitLine: { show: false },
            splitArea: { show: false },
            axisTick: {
                alignWithLabel: await ShanhaiBI.getSetting("align-with-label")
            }
        },
        yAxis: {},
        grid: {
            bottom: 100
        },
        series: [
            {
                name: 'bar',
                type: 'bar',
                stack: 'one',
                emphasis: emphasisStyle,
                data: data1
            },
            {
                name: 'bar2',
                type: 'bar',
                stack: 'one',
                emphasis: emphasisStyle,
                data: data2
            },
            {
                name: 'bar3',
                type: 'bar',
                stack: 'two',
                emphasis: emphasisStyle,
                data: data3
            },
            {
                name: 'bar4',
                type: 'bar',
                stack: 'two',
                emphasis: emphasisStyle,
                data: data4
            }
        ]
    };
    myChart.setOption(option);

    myChart.on('brushSelected', function (params) {
        let brushed = [];
        let brushComponent = params.batch[0];
        for (let sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
            let rawIndices = brushComponent.selected[sIdx].dataIndex;
            brushed.push('[Series ' + sIdx + '] ' + rawIndices.join(', '));
        }
        myChart.setOption({
            title: {
                backgroundColor: '#333',
                text: 'SELECTED DATA INDICES: \n' + brushed.join('\n'),
                bottom: 0,
                right: '10%',
                width: 100,
                textStyle: {
                    fontSize: 12,
                    color: '#fff'
                }
            }
        });
    });
})();