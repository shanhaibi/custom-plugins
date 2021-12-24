(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "line-color",
                alias: "线条颜色",
                type: "color",
                default: "#333",
                cluster: { title: "线段设置" }
            },
            {
                name: "line-width",
                alias: "线条宽度",
                type: "number",
                default: 3,
                cluster: { title: "线段设置" }
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
                cluster: { title: "线段设置" }
            },
            {
                name: "area-color",
                alias: "区域颜色",
                type: "color",
                default: "#ccc",
                cluster: { title: "线段设置" }
            },
            {
                name: "tooltip-background-color",
                alias: "背景颜色",
                type: "color",
                default: "#ccc",
                cluster: { title: "提示信息指针文本设置" }
            },
            {
                name: "tooltip-border-color",
                alias: "边框颜色",
                type: "color",
                default: "#aaa",
                cluster: { title: "提示信息指针文本设置" }
            },
            {
                name: "tooltip-border-width",
                alias: "边框宽度(px)",
                type: "number",
                default: 1,
                cluster: { title: "提示信息指针文本设置" }
            },
            {
                name: "tooltip-label-color",
                alias: "文本颜色",
                type: "color",
                default: "#222",
                cluster: { title: "提示信息指针文本设置" }
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);
    let line_style = {
        color: await ShanhaiBI.getSetting("line-color"),
        type: await ShanhaiBI.getSetting("line-type"),
        width: await ShanhaiBI.getSetting("line-width")
    };
    let tooltip_label = {
        backgroundColor: await ShanhaiBI.getSetting("tooltip-background-color"),
        borderColor: await ShanhaiBI.getSetting("tooltip-border-color"),
        borderWidth: await ShanhaiBI.getSetting("tooltip-border-width"),
        color: await ShanhaiBI.getSetting("tooltip-label-color")
    }
    let area_color = await ShanhaiBI.getSetting("area-color");
    myChart.showLoading();
    $.get(ROOT_PATH + '/data/asset/data/confidence-band.json', function (data) {
        myChart.hideLoading();
        let base = -data.reduce(function (min, val) {
            return Math.floor(Math.min(min, val.l));
        }, Infinity);
        let option = {
            title: {
                text: 'Confidence Band',
                subtext: 'Example in MetricsGraphics.js',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    animation: false,
                    label: tooltip_label
                },
                formatter: function (params) {
                    return (
                        params[2].name +
                        '<br />' +
                        ((params[2].value - base) * 100).toFixed(1) +
                        '%'
                    );
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
                data: data.map(function (item) {
                    return item.date;
                }),
                axisLabel: {
                    formatter: function (value, idx) {
                        let date = new Date(value);
                        return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-');
                    }
                },
                boundaryGap: false
            },
            yAxis: {
                axisLabel: {
                    formatter: function (val) {
                        return (val - base) * 100 + '%';
                    }
                },
                axisPointer: {
                    label: {
                        formatter: function (params) {
                            return ((params.value - base) * 100).toFixed(1) + '%';
                        }
                    }
                },
                splitNumber: 3
            },
            series: [
                {
                    name: 'L',
                    type: 'line',
                    data: data.map(function (item) {
                        return item.l + base;
                    }),
                    lineStyle: {
                        opacity: 0
                    },
                    stack: 'confidence-band',
                    symbol: 'none'
                },
                {
                    name: 'U',
                    type: 'line',
                    data: data.map(function (item) {
                        return item.u - item.l;
                    }),
                    lineStyle: {
                        opacity: 0
                    },
                    areaStyle: {
                        color: area_color
                    },
                    stack: 'confidence-band',
                    symbol: 'none'
                },
                {
                    type: 'line',
                    data: data.map(function (item) {
                        return item.value + base;
                    }),
                    lineStyle: line_style,
                    showSymbol: false
                }
            ]
        };
        myChart.setOption(option);
    });

})();