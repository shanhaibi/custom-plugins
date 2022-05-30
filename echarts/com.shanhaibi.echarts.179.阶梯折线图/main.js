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
                name: "align-with-label",
                alias: "刻度线与标签对齐",
                type: "boolean",
                default: true
            },
            {
                name: "symbol-size",
                alias: "端点大小(px)",
                type: "number",
                default: 5,
            },
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let line_style = {
        width: await ShanhaiBI.getSetting("line-width"),
        type: await ShanhaiBI.getSetting("line-type")
    };
    let symbol_size = await ShanhaiBI.getSetting("symbol-size");
    let rawData = await ShanhaiBI.getData();
    let x_data = rawData.getColumn("axis-x");
    let y_data = rawData.getColumns("axis-y");
    let legend_data = [], series = [];
    if (x_data.length && y_data.length) {
        let y_dims = await ShanhaiBI.getSetting("axis-y");
        for(let i = 0; i < y_dims.length; i++) {
            let y_dim = y_dims[i];
            legend_data.push(y_dim.alias);
            series.push({
                name: y_dim.alias,
                type: "line",
                step: "middle",
                symbolSize: symbol_size,
                lineStyle: line_style,
                data: y_data[i]
            })
        }
    } else {
        legend_data = ['Step Start', 'Step Middle', 'Step End'];
        let y_data = [
            [120, 132, 101, 134, 90, 230, 210],
            [220, 282, 201, 234, 290, 430, 410],
            [450, 432, 401, 454, 590, 530, 510]
        ];
        let step = ["start", "end", "end"];
        for(let i = 0; i < y_data.length; i++) {
            series.push({
                name: legend_data[i],
                type: "line",
                step: step[i],
                symbolSize: symbol_size,
                lineStyle: line_style,
                data: y_data[i]
            })
        }
        x_data = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    }
    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        title: {
            text: 'Step Line'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: legend_data,
            textStyle: {
                color: "#aaa"
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
            data: x_data,
            axisTick: {
                alignWithLabel: await ShanhaiBI.getSetting("align-with-label")
            }
        },
        yAxis: {
            type: 'value'
        },
        series: series
    };
    myChart.setOption(option);
})();