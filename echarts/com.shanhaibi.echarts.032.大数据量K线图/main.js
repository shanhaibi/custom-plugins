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
                default: "#ec0000"
            },
            {
                name: "yang-line-border-color",
                alias: "阳线边框色",
                type: "color",
                default: "#8A0000"
            },
            {
                name: "yin-line-color",
                alias: "阴线颜色",
                type: "color",
                default: "#00da3c"
            },
            {
                name: "yin-line-border-color",
                alias: "阴线边框色",
                type: "color",
                default: "#008F28"
            },
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let dataCount = 2e5;
    let yang_line_color = await ShanhaiBI.getSetting("yang-line-color");
    let yin_line_color = await ShanhaiBI.getSetting("yin-line-color");

    let data = await ShanhaiBI.getData();
    let x_axis_data = data.getColumn("axis-x");
    let y_data = data.getColumns("axis-y");
    if (y_data.length < 4 || !x_axis_data.length) {
        data = generateOHLC(dataCount);
    } else {
        data = [];
        for (let i = 0; i < x_axis_data.length; i++) {
            let openVal = y_data[0][i], closeVal = y_data[1][i];
            data.push([x_axis_data[i], openVal, closeVal, y_data[2][i], y_data[3][i], getVolumn(y_data[3][i]), getSign(data, i, openVal, closeVal, 2)])
        }
        console.log(data)
    }


    let option = {
        dataset: {
            source: data
        },
        title: {
            text: 'Data Amount: ' + echarts.format.addCommas(dataCount)
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line'
            }
        },
        grid: [
            {
                left: '10%',
                right: '10%',
                bottom: 200
            },
            {
                left: '10%',
                right: '10%',
                height: 80,
                bottom: 80
            }
        ],
        xAxis: [
            {
                type: 'category',
                scale: true,
                boundaryGap: false,
                // inverse: true,
                axisLine: { onZero: false },
                splitLine: { show: false },
                min: 'dataMin',
                max: 'dataMax'
            },
            {
                type: 'category',
                gridIndex: 1,
                scale: true,
                boundaryGap: false,
                axisLine: { onZero: false },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                min: 'dataMin',
                max: 'dataMax'
            }
        ],
        yAxis: [
            {
                scale: true,
                splitArea: {
                    show: true
                }
            },
            {
                scale: true,
                gridIndex: 1,
                splitNumber: 2,
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
            }
        ],
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: [0, 1],
                start: 10,
                end: 100
            },
            {
                show: true,
                xAxisIndex: [0, 1],
                type: 'slider',
                bottom: 10,
                start: 10,
                end: 100
            }
        ],
        visualMap: {
            show: false,
            seriesIndex: 1,
            dimension: 6,
            pieces: [
                {
                    value: 1,
                    color: yang_line_color
                },
                {
                    value: -1,
                    color: yin_line_color
                }
            ]
        },
        series: [
            {
                type: 'candlestick',
                itemStyle: {
                    color: yang_line_color,
                    color0: yin_line_color,
                    borderColor: await ShanhaiBI.getSetting("yang-line-border-color"),
                    borderColor0: await ShanhaiBI.getSetting("yin-line-border-color")
                },
                encode: {
                    x: 0,
                    y: [1, 2, 3, 4]
                }
            },
            {
                name: 'Volumn',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                itemStyle: {
                    color: '#7fbe9e'
                },
                large: true,
                encode: {
                    x: 0,
                    y: 5
                }
            }
        ]
    };
    myChart.setOption(option);

    function generateOHLC(count) {
        console.log(count)
        let data = [];
        let xValue = +new Date(2011, 0, 1);
        let minute = 60 * 1000;
        let baseValue = Math.random() * 12000;
        let boxVals = new Array(4);
        let dayRange = 12;
        for (let i = 0; i < count; i++) {
            baseValue = baseValue + Math.random() * 20 - 10;
            for (let j = 0; j < 4; j++) {
                boxVals[j] = (Math.random() - 0.5) * dayRange + baseValue;
            }
            boxVals.sort();
            let openIdx = Math.round(Math.random() * 3);
            let closeIdx = Math.round(Math.random() * 2);
            if (closeIdx === openIdx) {
                closeIdx++;
            }
            let volumn = getVolumn(boxVals[3]);
            // ['open', 'close', lowest', 'highest', 'volumn']
            data[i] = [
                echarts.format.formatTime('yyyy-MM-dd\nhh:mm:ss', (xValue += minute)),
                +boxVals[openIdx].toFixed(2),
                +boxVals[closeIdx].toFixed(2),
                +boxVals[0].toFixed(2),
                +boxVals[3].toFixed(2),
                +volumn.toFixed(0),
                getSign(data, i, +boxVals[openIdx], +boxVals[closeIdx], 2) // sign
            ];
        }
        return data;
    }
    function getSign(data, dataIndex, openVal, closeVal, closeDimIdx) {
        var sign;
        if (openVal > closeVal) {
            sign = -1;
        } else if (openVal < closeVal) {
            sign = 1;
        } else {
            // If close === open, compare with close of last record
            sign = dataIndex > 0 ? data[dataIndex - 1][closeDimIdx] <= closeVal ? 1 : -1 : 1;
            // No record of previous, set to be positive
        }
        return sign;
    }
    function getVolumn(num) {
        return num * (1000 + Math.random() * 500);
    }
})();