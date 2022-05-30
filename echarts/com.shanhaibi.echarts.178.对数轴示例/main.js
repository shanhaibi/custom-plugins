(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#5470c6', '#91cc75', '#fac858']
            },
            {
                name: "line-width",
                alias: "线条宽度(px)",
                type: "number",
                default: 2
            },
            {
                name: "line-type",
                alias: "线段类型",
                type: "select",
                choices: [
                    {
                        label: "实线",
                        value: "solid"
                    },
                    {
                        label: "虚线",
                        value: "dashed"
                    },
                    {
                        label: "点线",
                        value: "dotted"
                    }
                ],
                default: "solid",
            },
            {
                name: "minor-split-line",
                alias: "显示次分割线",
                type: "boolean",
                default: true,
                cluster: {title: "次分割线显示"}
            },
            {
                name: "minor-split-line-color",
                alias: "此分割线颜色",
                type: "color",
                default: "rgba(255, 255, 255, 0.2)",
                cluster: {title: "次分割线显示"}
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let line_style = {
        width: await ShanhaiBI.getSetting("line-width"),
        type: await ShanhaiBI.getSetting("line-type")
    }

    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        title: {
            text: 'Log Axis',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}',
           
        },
        legend: {
            left: 'left',
            textStyle: {
                color: "#aaa"
            }
        },
        xAxis: {
            type: 'category',
            name: 'x',
            splitLine: { show: false },
            data: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: {
            type: 'log',
            name: 'y',
            minorSplitLine: {
                show: await ShanhaiBI.getSetting("minor-split-line"),
                lineStyle: {
                    color: await ShanhaiBI.getSetting("minor-split-line-color")
                }
            }
        },
        series: [
            {
                name: 'Log2',
                type: 'line',
                lineStyle: line_style,
                data: [1, 3, 9, 27, 81, 247, 741, 2223, 6669]
            },
            {
                name: 'Log3',
                type: 'line',
                lineStyle: line_style,
                data: [1, 2, 4, 8, 16, 32, 64, 128, 256]
            },
            {
                name: 'Log1/2',
                type: 'line',
                lineStyle: line_style,
                data: [1 / 2, 1 / 4, 1 / 8, 1 / 16, 1 / 32, 1 / 64, 1 / 128, 1 / 256, 1 / 512]
            }
        ]
    };
    myChart.setOption(option);
})();