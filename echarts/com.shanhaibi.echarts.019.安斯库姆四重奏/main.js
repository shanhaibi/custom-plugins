(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-x",
                type: "axis",
                alias: "x轴数据",
            },
            {
                name: "axis-y",
                alias: "y轴数据",
                type: "axis",
            }
        ],
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
            },
            {
                name: "shape-size",
                alias: "图形大小",
                type: "number",
                default: 20
            },
            {
                name: "line-slope",
                alias: "直线斜率",
                type: "number",
                default: 0.5
            },
            {
                name: "line-constant",
                alias: "直线常量",
                type: "number",
                default: 3
            },
            {
                name: "x-axis-max",
                alias: "x轴最大刻度",
                type: "number",
                default: 20
            },
            {
                name: "y-axis-max",
                alias: "y轴最大刻度",
                type: "number",
                default: 15
            }

        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let series_data = [
        [
            [10.0, 8.04],
            [8.0, 6.95],
            [13.0, 7.58],
            [9.0, 8.81],
            [11.0, 8.33],
            [14.0, 9.96],
            [6.0, 7.24],
            [4.0, 4.26],
            [12.0, 10.84],
            [7.0, 4.82],
            [5.0, 5.68]
        ],
        [
            [10.0, 9.14],
            [8.0, 8.14],
            [13.0, 8.74],
            [9.0, 8.77],
            [11.0, 9.26],
            [14.0, 8.1],
            [6.0, 6.13],
            [4.0, 3.1],
            [12.0, 9.13],
            [7.0, 7.26],
            [5.0, 4.74]
        ],
        [
            [10.0, 7.46],
            [8.0, 6.77],
            [13.0, 12.74],
            [9.0, 7.11],
            [11.0, 7.81],
            [14.0, 8.84],
            [6.0, 6.08],
            [4.0, 5.39],
            [12.0, 8.15],
            [7.0, 6.42],
            [5.0, 5.73]
        ],
        [
            [8.0, 6.58],
            [8.0, 5.76],
            [8.0, 7.71],
            [8.0, 8.84],
            [8.0, 8.47],
            [8.0, 7.04],
            [8.0, 5.25],
            [19.0, 12.5],
            [8.0, 5.56],
            [8.0, 7.91],
            [8.0, 6.89]
        ]
    ];
    let data = await ShanhaiBI.getData();
    let x_data = data.getColumns("axis-x");
    let y_data = data.getColumns("axis-y");
    let x_axis_max = await ShanhaiBI.getSetting("x-axis-max");
    for (let i = 0; i < series_data.length; i++) {
        if (x_data[i] && y_data[i]) {
            series_data[i] = [];
            let data_index = x_data[i] && y_data[i] ? i : 0;
            for (let index = 0; index < x_data[data_index].length; index++) {
                series_data[i].push([x_data[data_index][index], y_data[data_index][index]]);
            }
        }
    }
    const SLOPE = await ShanhaiBI.getSetting("line-slope");
    const CONSTANT = await ShanhaiBI.getSetting("line-constant");
    let equation = "y = ";
    if (SLOPE > 0) equation += SLOPE === 1 ? "x " : `${SLOPE} * x `;
    if (CONSTANT !== 0) equation += `+ ${CONSTANT}`;
    let y = SLOPE * x_axis_max + CONSTANT;
    let y_axis_max = await ShanhaiBI.getSetting("y-axis-max");
    y_axis_max = y_axis_max > y ? y_axis_max : y;

    let markLineOpt = {
        animation: false,
        label: {
            formatter: equation,
            align: 'right',
            textStyle: {
                color: "#fff"
            },
        },
        lineStyle: {
            type: 'solid'
        },
        tooltip: {
            formatter: equation
        },
        data: [
            [
                {
                    coord: [0, CONSTANT],
                    symbol: 'none'
                },
                {
                    coord: [x_axis_max, y],
                    symbol: 'none'
                }
            ]
        ]
    };
    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        title: {
            text: "Anscombe's quartet",
            left: 'center',
            top: 0
        },
        grid: [
            { left: '7%', top: '7%', width: '38%', height: '38%' },
            { right: '7%', top: '7%', width: '38%', height: '38%' },
            { left: '7%', bottom: '7%', width: '38%', height: '38%' },
            { right: '7%', bottom: '7%', width: '38%', height: '38%' }
        ],
        tooltip: {
            formatter: 'Group {a}: ({c})'
        },
        xAxis: [
            { gridIndex: 0, min: 0, max: x_axis_max },
            { gridIndex: 1, min: 0, max: x_axis_max },
            { gridIndex: 2, min: 0, max: x_axis_max },
            { gridIndex: 3, min: 0, max: x_axis_max }
        ],
        yAxis: [
            { gridIndex: 0, min: 0, max: y_axis_max },
            { gridIndex: 1, min: 0, max: y_axis_max },
            { gridIndex: 2, min: 0, max: y_axis_max },
            { gridIndex: 3, min: 0, max: y_axis_max }
        ],

        series: [
            {
                name: 'I',
                type: 'scatter',
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: series_data[0],
                symbolSize: await ShanhaiBI.getSetting("shape-size"),
                markLine: markLineOpt
            },
            {
                name: 'II',
                type: 'scatter',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: series_data[1],
                symbolSize: await ShanhaiBI.getSetting("shape-size"),
                markLine: markLineOpt
            },
            {
                name: 'III',
                type: 'scatter',
                xAxisIndex: 2,
                yAxisIndex: 2,
                data: series_data[2],
                symbolSize: await ShanhaiBI.getSetting("shape-size"),
                markLine: markLineOpt
            },
            {
                name: 'IV',
                type: 'scatter',
                xAxisIndex: 3,
                yAxisIndex: 3,
                data: series_data[3],
                symbolSize: await ShanhaiBI.getSetting("shape-size"),
                markLine: markLineOpt
            }
        ]
    };
    myChart.setOption(option);
})();