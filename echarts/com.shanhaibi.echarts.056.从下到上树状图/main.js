(async function () {
    await ShanhaiBI.initSettings({
        "format": [
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
                    left: '2%',
                    right: '2%',
                    top: '20%',
                    bottom: '8%',
                    orient: 'BT',
                    expandAndCollapse: true,
                    label: {
                        position: 'bottom',
                        rotate: 90,
                        verticalAlign: 'middle',
                        align: 'right',
                        color: text_color,
                        fontSize: text_size,
                    },
                    itemStyle: {
                        color: fill_color
                    },
                    lineStyle: {
                        color: line_color
                    },
                    leaves: {
                        label: {
                            position: 'top',
                            rotate: 90,
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                    },
                    emphasis: {
                        focus: 'descendant'
                    },
                    animationDurationUpdate: 750
                }
            ]
        };
        myChart.setOption(option);
    });
})()