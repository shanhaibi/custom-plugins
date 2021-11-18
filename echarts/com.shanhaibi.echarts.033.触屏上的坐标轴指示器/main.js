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
                name: "setting-color",
                alias: "设置颜色",
                type: "palette",
                default: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570']
            },
            {
                name: "yang-line-color",
                alias: "阳线颜色",
                type: "color",
                default: "#ef232a"
            },
            {
                name: "yin-line-color",
                alias: "阴线颜色",
                type: "color",
                default: "#14b143"
            },
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let yang_line_color = await ShanhaiBI.getSetting("yang-line-color");
    let yin_line_color = await ShanhaiBI.getSetting("yin-line-color");
    let colorList = await ShanhaiBI.getSetting("setting-color");
    let volumes = [];
    let labelFont = 'bold 12px Sans-serif';
    let data = await ShanhaiBI.getData();
    let x_axis_data = data.getColumn("axis-x");
    let y_data = data.getColumns("axis-y");
    if (y_data.length < 4 || !x_axis_data.length) {
        x_axis_data = [
            "2016-03-29", "2016-03-30", "2016-03-31", "2016-04-01", "2016-04-04", "2016-04-05", "2016-04-06", "2016-04-07", "2016-04-08",
            "2016-04-11", "2016-04-12", "2016-04-13", "2016-04-14", "2016-04-15", "2016-04-18", "2016-04-19", "2016-04-20", "2016-04-21",
            "2016-04-22", "2016-04-25", "2016-04-26", "2016-04-27", "2016-04-28", "2016-04-29", "2016-05-02", "2016-05-03", "2016-05-04",
            "2016-05-05", "2016-05-06", "2016-05-09", "2016-05-10", "2016-05-11", "2016-05-12", "2016-05-13", "2016-05-16", "2016-05-17",
            "2016-05-18", "2016-05-19", "2016-05-20", "2016-05-23", "2016-05-24", "2016-05-25", "2016-05-26", "2016-05-27", "2016-05-31",
            "2016-06-01", "2016-06-02", "2016-06-03", "2016-06-06", "2016-06-07", "2016-06-08", "2016-06-09", "2016-06-10", "2016-06-13",
            "2016-06-14", "2016-06-15", "2016-06-16", "2016-06-17", "2016-06-20", "2016-06-21", "2016-06-22"
        ];
        y_data = [
            [
                17512.58, 17652.36, 17716.05, 17661.74, 17799.39, 17718.03, 17605.45, 17687.28, 17555.39, 17586.48,
                17571.34, 17741.66, 17912.25, 17925.95, 17890.2, 18012.1, 18059.49, 18092.84, 17985.05, 17990.94,
                17987.38, 17996.14, 18023.88, 17813.09, 17783.78, 17870.75, 17735.02, 17664.48, 17650.3, 17743.85,
                17726.66, 17919.03, 17711.12, 17711.12, 17531.76, 17701.46, 17501.28, 17514.16, 17437.32, 17507.04,
                17525.19, 17735.09, 17859.52, 17826.85, 17891.5, 17754.55, 17789.05, 17799.8, 17825.69, 17936.22,
                17931.91, 17969.98, 17938.82, 17830.5, 17710.77, 17703.65, 17602.23, 17733.44, 17736.87, 17827.33, 17832.67
            ],
            [
                17633.11, 17716.66, 17685.09, 17792.75, 17737, 17603.32, 17716.05, 17541.96, 17576.96, 17556.41, 17721.25,
                17908.28, 17926.43, 17897.46, 18004.16, 18053.6, 18096.27, 17982.52, 18003.75, 17977.24, 17990.32, 18041.55,
                17830.76, 17773.64, 17891.16, 17750.91, 17651.26, 17660.71, 17740.63, 17705.91, 17928.35, 17711.12, 17720.5,
                17535.32, 17710.71, 17529.98, 17526.62, 17435.4, 17500.94, 17492.93, 17706.05, 17851.51, 17828.29, 17873.22,
                17787.2, 17789.67, 17838.56, 17807.06, 17920.33, 17938.28, 18005.05, 17985.19, 17865.34, 17732.48, 17674.82,
                17640.17, 17733.1, 17675.16, 17804.87, 17829.73, 17780.83
            ],
            [
                17434.27, 17652.36, 17669.72, 17568.02, 17710.67, 17579.56, 17542.54, 17484.23, 17528.16, 17555.9, 17553.57,
                17741.66, 17885.44, 17867.41, 17848.22, 17984.43, 18031.21, 17963.89, 17909.89, 17855.55, 17934.17, 17920.26,
                17796.55, 17651.98, 17773.71, 17670.88, 17609.01, 17615.82, 17580.38, 17668.38, 17726.66, 17711.05, 17625.38,
                17512.48, 17531.76, 17469.92, 17418.21, 17331.07, 17437.32, 17480.05, 17525.19, 17735.09, 17803.82, 17824.73,
                17724.03, 17664.79, 17703.55, 17689.68, 17822.81, 17936.22, 17931.91, 17915.88, 17812.34, 17731.35, 17595.79,
                17629.01, 17471.29, 17602.78, 17736.87, 17799.8, 17770.36
            ],
            [
                17642.81, 17790.11, 17755.7, 17811.48, 17806.38, 17718.03, 17723.55, 17687.28, 17694.51, 17731.63, 17744.43,
                17918.35, 17962.14, 17937.65, 18009.53, 18103.46, 18167.63, 18107.29, 18026.85, 17990.94, 18043.77, 18084.66,
                18035.73, 17814.83, 17912.35, 17870.75, 17738.06, 17736.11, 17744.54, 17783.16, 17934.61, 17919.03, 17798.19,
                17734.74, 17755.8, 17701.46, 17636.22, 17514.16, 17571.75, 17550.7, 17742.59, 17891.71, 17888.66, 17873.22,
                17899.24, 17809.18, 17838.56, 17833.17, 17949.68, 18003.23, 18016, 18005.22, 17938.82, 17893.28, 17733.92,
                17762.96, 17754.91, 17733.44, 17946.36, 17877.84, 17920.16
            ]
        ]
    }
    let y_axis_data = [];
    for (let i = 0; i < y_data[0].length; i++) {
        y_axis_data.push([y_data[0][i], y_data[1][i], y_data[2][i], y_data[3][i]]);
        volumes.push(parseInt(y_data[1][i] * (1000 + Math.random() * 500)))
    }

    let dataMA5 = calculateMA(5, y_axis_data);
    let dataMA10 = calculateMA(10, y_axis_data);
    let dataMA20 = calculateMA(20, y_axis_data);
    let option = {
        animation: false,
        color: colorList,
        title: {
            left: 'center',
            text: 'Candlestick on Mobile'
        },
        legend: {
            top: 30,
            data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
        },
        tooltip: {
            triggerOn: 'none',
            transitionDuration: 0,
            confine: true,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: '#333',
            backgroundColor: 'rgba(255,255,255,0.9)',
            textStyle: {
                fontSize: 12,
                color: '#333'
            },
            position: function (pos, params, el, elRect, size) {
                const obj = {
                    top: 60
                };
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                return obj;
            }
        },
        axisPointer: {
            link: [
                {
                    xAxisIndex: [0, 1]
                }
            ]
        },
        dataZoom: [
            {
                type: 'slider',
                xAxisIndex: [0, 1],
                realtime: false,
                start: 20,
                end: 70,
                top: 65,
                height: 20,
                handleIcon:
                    'path://M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '120%'
            },
            {
                type: 'inside',
                xAxisIndex: [0, 1],
                start: 40,
                end: 70,
                top: 30,
                height: 20
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: x_axis_data,
                boundaryGap: false,
                axisLine: { lineStyle: { color: '#777' } },
                axisLabel: {
                    formatter: function (value) {
                        return echarts.format.formatTime('MM-dd', value);
                    }
                },
                min: 'dataMin',
                max: 'dataMax',
                axisPointer: {
                    show: true
                }
            },
            {
                type: 'category',
                gridIndex: 1,
                data: x_axis_data,
                scale: true,
                boundaryGap: false,
                splitLine: { show: false },
                axisLabel: { show: false },
                axisTick: { show: false },
                axisLine: { lineStyle: { color: '#777' } },
                min: 'dataMin',
                max: 'dataMax',
                axisPointer: {
                    type: 'shadow',
                    label: { show: false },
                    triggerTooltip: true,
                    handle: {
                        show: true,
                        margin: 30,
                        color: '#B80C00'
                    }
                }
            }
        ],
        yAxis: [
            {
                scale: true,
                splitNumber: 2,
                axisLine: { lineStyle: { color: '#777' } },
                splitLine: { show: true },
                axisTick: { show: false },
                axisLabel: {
                    inside: true,
                    formatter: '{value}\n'
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
        grid: [
            {
                left: 20,
                right: 20,
                top: 110,
                height: 120
            },
            {
                left: 20,
                right: 20,
                height: 40,
                top: 260
            }
        ],
        graphic: [
            {
                type: 'group',
                left: 'center',
                top: 70,
                width: 300,
                bounding: 'raw',
                children: [
                    {
                        id: 'MA5',
                        type: 'text',
                        style: { fill: colorList[1], font: labelFont },
                        left: 0
                    },
                    {
                        id: 'MA10',
                        type: 'text',
                        style: { fill: colorList[2], font: labelFont },
                        left: 'center'
                    },
                    {
                        id: 'MA20',
                        type: 'text',
                        style: { fill: colorList[3], font: labelFont },
                        right: 0
                    }
                ]
            }
        ],
        series: [
            {
                name: 'Volume',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                itemStyle: {
                    color: '#7fbe9e'
                },
                emphasis: {
                    itemStyle: {
                        color: '#140'
                    }
                },
                data: volumes
            },
            {
                type: 'candlestick',
                name: '日K',
                data: y_axis_data,
                itemStyle: {
                    color: yang_line_color,
                    color0: yin_line_color,
                    borderColor: yang_line_color,
                    borderColor0: yin_line_color
                },
                emphasis: {
                    itemStyle: {
                        color: 'black',
                        color0: '#444',
                        borderColor: 'black',
                        borderColor0: '#444'
                    }
                }
            },
            {
                name: 'MA5',
                type: 'line',
                data: dataMA5,
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    width: 1
                }
            },
            {
                name: 'MA10',
                type: 'line',
                data: dataMA10,
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    width: 1
                }
            },
            {
                name: 'MA20',
                type: 'line',
                data: dataMA20,
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    width: 1
                }
            }
        ]
    };
    myChart.setOption(option);

    function calculateMA(dayCount, data) {
        let result = [];
        for (let i = 0, len = data.length; i < len; i++) {
            if (i < dayCount) {
                result.push('-');
                continue;
            }
            let sum = 0;
            for (let j = 0; j < dayCount; j++) {
                sum += +data[i - j][1];
            }
            result.push((sum / dayCount).toFixed(2));
        }
        return result;
    }
})();