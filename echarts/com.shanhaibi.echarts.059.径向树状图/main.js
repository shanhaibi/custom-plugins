(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "symbol-shape",
                alias: "标记图形",
                type: "select",
                choices: [{
                    label: "实心圆",
                    value: "circle"
                }, {
                    label: "空心圆",
                    value: "emptyCircle"
                }, {
                    label: "矩形",
                    value: "rect"
                }, {
                    label: "空",
                    value: "none"
                }],
                default: "emptyCircle"
            },
            {
                name: "line-color",
                alias: "线条颜色",
                type: "color",
                default: "#666"
            },
            {
                name: "text-color",
                alias: "字体颜色",
                type: "color",
                default: "#ffffff"
            },
            {
                name: "text-size",
                alias: "字体大小",
                type: "number",
                default: 12
            },
            {
                name: "fill-color",
                alias: "填充颜色",
                type: "color",
                default: "#b2c5de"
            },
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let line_color = await ShanhaiBI.getSetting("line-color");
    let text_color = await ShanhaiBI.getSetting("text-color");
    let text_size = await ShanhaiBI.getSetting("text-size");
    let fill_color = await ShanhaiBI.getSetting("fill-color");
    let Symbor_shape = await ShanhaiBI.getSetting("symbol-shape");

    myChart.showLoading();
    $.get(ROOT_PATH + '/data/asset/data/flare.json', function (data) {
        myChart.hideLoading();
        let option = {
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: [
                {
                    type: 'tree',
                    data: [data],
                    top: '18%',
                    bottom: '14%',
                    layout: 'radial',
                    symbol: Symbor_shape,
                    symbolSize: 7,
                    initialTreeDepth: 3,
                    itemStyle: {
                        color: fill_color
                    },
                    lineStyle: {
                        color: line_color
                    },
                    label: {
                        color: text_color,
                        fontSize: text_size,
                    },
                    animationDurationUpdate: 750,
                    emphasis: {
                        focus: 'descendant'
                    }
                }
            ]
        };
        myChart.setOption(option);
    });
})()