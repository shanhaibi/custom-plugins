(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-x",
                type: "axis",
                alias: "x轴数据"
            },
            {
                name: "axis-y",
                alias: "y轴数据",
                type: "axis"
            }
        ],
        "format": [
            {
                name: "yang-line-color",
                alias: "阳线颜色",
                type: "color",
                default: "#c23531"
            },
            {
                name: "yin-line-color",
                alias: "阴线颜色",
                type: "color",
                default: "#5bb262"
            }

        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let yang_line_color = await ShanhaiBI.getSetting("yang-line-color");
    let yin_line_color = await ShanhaiBI.getSetting("yin-line-color");
    let data = await ShanhaiBI.getData();
    let x_axis_data = data.getColumn("axis-x");
    let y_data = data.getColumns("axis-y");
    if (y_data.length < 4 || !x_axis_data.length) {
        x_axis_data = ['2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27'];
        y_data = [[20, 40, 31, 38], [34, 35, 38, 15], [10, 30, 33, 5], [38, 50, 44, 42]];
    }

    let y_axis_data = [];
    for (let i = 0; i < y_data[0].length; i++) {
        y_axis_data.push([y_data[0][i], y_data[1][i], y_data[2][i], y_data[3][i]]);
    }

    let option = {
        xAxis: {
            data: x_axis_data
        },
        yAxis: {
            scale: true,
            
        },
        series: [
            {
                type: 'candlestick',
                data: y_axis_data,
                itemStyle: {
                    color: yang_line_color,
                    borderColor: yang_line_color,
                    color0: yin_line_color,
                    borderColor0: yin_line_color
                }
            }
        ]
    };
    myChart.setOption(option);
})();