(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-date",
                alias: "日期字段",
                type: "axis"
            },
            {
                name: "axis-value",
                alias: "取值字段",
                type: "axis"
            },
        ],
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ["rgb(213,72,120)", "rgb(58,77,233)"]
            },
            {
                name: "data-color",
                alias: "数据颜色",
                type: "palette",
                default: ["#1890ff"]
            },
            {
                name: "point",
                alias: "显示端点",
                type: "boolean",
                default: true
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let data_color = await ShanhaiBI.getSetting("data-color");
    let point_display = await ShanhaiBI.getSetting("point");
    let rawData = await ShanhaiBI.getData();
    let date_data = rawData.getColumn("axis-date");
    let value_data = rawData.getColumns("axis-value");
    let data = [];
    if (!date_data.length || !value_data.length) {
        data = [[], []]
        let base = +new Date(2016, 9, 3);
        let oneDay = 24 * 3600 * 1000;
        let valueBase = Math.random() * 200;
        let valueBase2 = Math.random() * 50;
        for (let i = 1; i < 10; i++) {
            let now = new Date((base += oneDay));
            let dayStr = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');
            valueBase = Math.round((Math.random() - 0.5) * 20 + valueBase);
            valueBase <= 0 && (valueBase = Math.random() * 200);
            data[0].push([dayStr, valueBase]);
            valueBase2 = Math.round((Math.random() - 0.5) * 20 + valueBase2);
            valueBase2 <= 0 && (valueBase2 = Math.random() * 100);
            data[1].push([dayStr, valueBase2]);
        }
    } else {
        for (let i = 0; i < value_data.length; i++) {
            data[i] = [];
            for (let index = 0; index < date_data.length; index++) {
                let time = dateFormat(date_data[index]);
                data[i].push([time, value_data[i][index]]);
            }
        }
    }
    let series = [];
    shape_color = shape_color.length ? shape_color : ["#1890ff"];
    data_color = data_color.length ? data_color : ["#1890ff"];
    for (let i = 0; i < data.length; i++) {
        series.push({
            name: 'Fake Data',
            type: 'line',
            smooth: true,
            stack: 'a',
            symbol: 'circle',
            symbolSize: point_display ? 5 : 0,
            sampling: 'average',
            itemStyle: {
                color: data_color[i] ? data_color[i] : data_color[data_color.length - 1]
            },
            areaStyle: {
                color: shape_color[i] ? shape_color[i] : shape_color[shape_color.length - 1]
            },
            data: data[i]
        })
    }
    let option = {
        title: {
            left: 'center',
            text: 'Tootip and dataZoom on Mobile Device'
        },
        legend: {
            top: 'bottom',
            data: ['Intention']
        },
        tooltip: {
            confine: true,
            triggerOn: 'none',
            position: function (pt) {
                return [pt[0], 130];
            }
        },
        toolbox: {
            left: 'center',
            itemSize: 25,
            top: 55,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {}
            }
        },
        xAxis: {
            type: 'time',
            axisPointer: {
                value: '2016-10-7',
                snap: true,
                lineStyle: {
                    color: '#7581BD',
                    width: 2
                },
                label: {
                    show: true,
                    formatter: function (params) {
                        return echarts.format.formatTime('yyyy-MM-dd', params.value);
                    },
                    backgroundColor: '#7581BD'
                },
                handle: {
                    show: true,
                    color: '#7581BD'
                }
            },
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            axisTick: {
                inside: true
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                inside: true,
                formatter: '{value}\n'
            },
            z: 10
        },
        grid: {
            top: 110,
            left: 15,
            right: 15,
            height: 160
        },
        dataZoom: [
            {
                type: 'inside',
                throttle: 50
            }
        ],
        series: series
    };
    myChart.setOption(option);

    function dateFormat(date) {
        let format_date = new Date(date);
        let year = format_date.getFullYear();
        let month = format_date.getMonth() + 1;
        let day = format_date.getDate();
        return year + "-" + month + "-" + day;
    }
})();