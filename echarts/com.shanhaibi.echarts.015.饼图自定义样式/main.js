(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "text-color",
                alias: "文本颜色",
                type: "color",
                default: "rgba(255, 255, 255, 0.3)"
            },
            {
                name: "text-size",
                alias: "字体大小",
                type: "number",
                default: 16
            },
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "color",
                default: "#c23531"
            },
            {
                name: "radius",
                alias: "半径(%)",
                default: 50,
                type: "number"
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let data = (await ShanhaiBI.getData()).getColumns();
    if (data.length < 2) {
        data = [["Search Engine", "Direct", "Email", "Union Ads", "Video Ads"], [400, 335, 310, 274, 235]];
    }
    let series_data = [];
    for (let i = 0; i < data[0].length; i++) {
        series_data.push({ value: data[1][i], name: data[0][i] });
    }

    let option = {
        backgroundColor: '#2c343c',
        title: {
            text: 'Customized Pie',
            left: 'center',
            top: 20,
            textStyle: {
                color: '#ccc'
            }
        },
        tooltip: {
            trigger: 'item'
        },
        visualMap: {
            show: false,
            min: Math.min(...data[1]) * 0.6,
            max: Math.max(...data[1]) * 1.6,
            inRange: {
                colorLightness: [0, 1]
            }
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: (await ShanhaiBI.getSetting("radius")) + "%",
                center: ['50%', '50%'],
                data: series_data.sort(function (a, b) {
                    return a.value - b.value;
                }),
                roseType: 'radius',
                label: {
                    color: await ShanhaiBI.getSetting("text-color"),
                    fontSize: await ShanhaiBI.getSetting("text-size"),
                },
                labelLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                },
                itemStyle: {
                    color: await ShanhaiBI.getSetting("shape-color"),
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                }
            }
        ]
    };
    myChart.setOption(option);
})();