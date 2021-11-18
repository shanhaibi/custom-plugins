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
                default: "#00da3c"
            },
            {
                name: "yin-line-color",
                alias: "阴线颜色",
                type: "color",
                default: "#ec0000"
            },
            {
                name: "brushing-days",
                alias: "刷选天数",
                type: "number",
                default: 18
            }
        ]
    })
    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let upColor = await ShanhaiBI.getSetting("yang-line-color");
    let downColor = await ShanhaiBI.getSetting("yin-line-color");
    let brushing_days = await ShanhaiBI.getSetting("brushing-days");
    let data = await ShanhaiBI.getData();
    let x_axis_data = data.getColumn("axis-x");
    let y_data = data.getColumns("axis-y");
    if (y_data.length < 4 || !x_axis_data.length) {
        $.get(ROOT_PATH + '/data/asset/data/stock-DJI.json', function (rawData) {
            var data = splitData(rawData);
            let length = data.categoryData.length;
            let start_index = length - brushing_days < 0 ? 0 : length - brushing_days;
            let start_date = dateFormat(data.categoryData[start_index], true);
            let end_date = dateFormat(data.categoryData[length - 1], true);
            echartsSetOption(data, start_date, end_date);
        });
    } else {
        let rawData = [];
        let length = x_axis_data.length;
        for (let i = 0; i < length; i++) {
            let volume = parseInt(y_data[1][i] * (1000 + Math.random() * 500));
            rawData.push([dateFormat(x_axis_data[i]), y_data[0][i], y_data[1][i], y_data[2][i], y_data[3][i], volume]);
        }
        let start_date = dateFormat(x_axis_data[length - brushing_days]);
        let end_date = dateFormat(x_axis_data[length - 1]);
        echartsSetOption(splitData(rawData), start_date, end_date);
    }

    function splitData(rawData) {
        let categoryData = [];
        let values = [];
        let volumes = [];
        for (let i = 0; i < rawData.length; i++) {
            categoryData.push(rawData[i].splice(0, 1)[0]);
            values.push(rawData[i]);
            volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1]);
        }
        return {
            categoryData: categoryData,
            values: values,
            volumes: volumes
        };
    }
    function calculateMA(dayCount, data) {
        var result = [];
        for (var i = 0, len = data.values.length; i < len; i++) {
            if (i < dayCount) {
                result.push('-');
                continue;
            }
            var sum = 0;
            for (var j = 0; j < dayCount; j++) {
                sum += data.values[i - j][1];
            }
            result.push(+(sum / dayCount).toFixed(3));
        }
        return result;
    }
    function echartsSetOption(data, start_date, end_date) {
        let option = {
            animation: false,
            legend: {
                bottom: 10,
                left: 'center',
                data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA30']
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                },
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                textStyle: {
                    color: '#000'
                },
                position: function (pos, params, el, elRect, size) {
                    const obj = {
                        top: 10
                    };
                    obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                    return obj;
                }
            },
            axisPointer: {
                link: [
                    {
                        xAxisIndex: 'all'
                    }
                ],
                label: {
                    backgroundColor: '#777'
                }
            },
            visualMap: {
                show: false,
                seriesIndex: 5,
                dimension: 2,
                pieces: [
                    {
                        value: 1,
                        color: downColor
                    },
                    {
                        value: -1,
                        color: upColor
                    }
                ]
            },
            grid: [
                {
                    left: '10%',
                    right: '8%',
                    height: '50%'
                },
                {
                    left: '10%',
                    right: '8%',
                    top: '63%',
                    height: '16%'
                }
            ],
            xAxis: [
                {
                    type: 'category',
                    data: data.categoryData,
                    scale: true,
                    boundaryGap: false,
                    axisLine: { onZero: false },
                    splitLine: { show: false },
                    min: 'dataMin',
                    max: 'dataMax',
                    axisPointer: {
                        z: 100
                    }
                },
                {
                    type: 'category',
                    gridIndex: 1,
                    data: data.categoryData,
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
                    start: 50,
                    end: 100
                },
                {
                    show: true,
                    xAxisIndex: [0, 1],
                    type: 'slider',
                    top: '85%',
                    start: 98,
                    end: 100
                }
            ],
            series: [
                {
                    name: 'Dow-Jones index',
                    type: 'candlestick',
                    data: data.values,
                    itemStyle: {
                        color: upColor,
                        color0: downColor,
                        borderColor: undefined,
                        borderColor0: undefined
                    },
                    tooltip: {
                        formatter: function (param) {
                            param = param[0];
                            return [
                                'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                                'Open: ' + param.data[0] + '<br/>',
                                'Close: ' + param.data[1] + '<br/>',
                                'Lowest: ' + param.data[2] + '<br/>',
                                'Highest: ' + param.data[3] + '<br/>'
                            ].join('');
                        }
                    }
                },
                {
                    name: 'MA5',
                    type: 'line',
                    data: calculateMA(5, data),
                    smooth: true,
                    lineStyle: {
                        opacity: 0.5
                    }
                },
                {
                    name: 'MA10',
                    type: 'line',
                    data: calculateMA(10, data),
                    smooth: true,
                    lineStyle: {
                        opacity: 0.5
                    }
                },
                {
                    name: 'MA20',
                    type: 'line',
                    data: calculateMA(20, data),
                    smooth: true,
                    lineStyle: {
                        opacity: 0.5
                    }
                },
                {
                    name: 'MA30',
                    type: 'line',
                    data: calculateMA(30, data),
                    smooth: true,
                    lineStyle: {
                        opacity: 0.5
                    }
                },
                {
                    name: 'Volume',
                    type: 'bar',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    data: data.volumes
                }
            ]
        }
        myChart.setOption(option, true);
        myChart.dispatchAction({
            type: 'brush',
            areas: [
                {
                    brushType: 'lineX',
                    coordRange: [start_date, end_date],
                    xAxisIndex: 0
                }
            ]
        });
    }
    function dateFormat(date, zeroize = false) {
        let format_date = new Date(date);
        let year = format_date.getFullYear();
        let month = format_date.getMonth() + 1;
        let day = format_date.getDate();
        if(zeroize) {
            month = numberZeroize(month);
            day = numberZeroize(day);
        }
        return year + "-" + month + "-" + day;
    }
    function numberZeroize(num) {
        if(num < 10) {
           return "0" + num; 
        }
        return num;
    }
})();