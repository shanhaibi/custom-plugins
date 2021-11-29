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
        data.children.forEach(function (datum, index) {
            index % 2 === 0 && (datum.collapsed = true);
        });
        let option = {
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: [
                {
                    type: 'tree',
                    data: [data],
                    top: '1%',
                    left: '7%',
                    bottom: '1%',
                    right: '20%',
                    symbolSize: 7,
                    label: {
                        position: 'left',
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
                            position: 'right',
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                    },
                    emphasis: {
                        focus: 'descendant'
                    },
                    expandAndCollapse: true,
                    animationDuration: 550,
                    animationDurationUpdate: 750
                }
            ]
        }
        myChart.setOption(option);
    });
})()