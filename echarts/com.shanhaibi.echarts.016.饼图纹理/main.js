(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "text-color",
                alias: "文本颜色",
                type: "color",
                default: "#235894"
            },
            {
                name: "text-size",
                alias: "字体大小",
                type: "number",
                default: 16
            },
            {
                name: "shape-opacity",
                alias: "透明度",
                type: "number",
                default: 0.7
            },
            {
                name: "border-color",
                alias: "边框颜色",
                type: "color",
                default: "#235894"
            },
            {
                name: "border-width",
                alias: "边框宽度",
                type: "number",
                default: 3
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let data = (await ShanhaiBI.getData()).getColumns();
    if (data.length < 2) {
        data = [["Search Engine", "Direct", "Email", "Union Ads", "Video Ads"], [1048, 735, 580, 484, 300]];
    }
    let series_data = [];
    for (let i = 0; i < data[0].length; i++) {
        series_data.push({ value: data[1][i], name: data[0][i] });
    }
    const piePatternImg = new Image();
    piePatternImg.src = "./images/texture.jpg";
    const bgPatternImg = new Image();
    bgPatternImg.src = "./images/background.png";
   
    let option = {
        backgroundColor: {
            image: bgPatternImg,
            repeat: 'repeat'
        },
        title: {
            text: '饼图纹理',
            textStyle: {
                color: '#235894'
            }
        },
        tooltip: {},
        series: [
            {
                name: 'pie',
                type: 'pie',
                selectedMode: 'single',
                selectedOffset: 30,
                clockwise: true,
                label: {
                    color: await ShanhaiBI.getSetting("text-color"),
                    fontSize: await ShanhaiBI.getSetting("text-size")
                },
                labelLine: {
                    lineStyle: {
                        color: '#235894'
                    }
                },
                data: series_data,
                itemStyle: {
                    opacity: await ShanhaiBI.getSetting("shape-opacity"),
                    color: {
                        image: piePatternImg,
                        repeat: 'repeat'
                    },
                    borderWidth: await ShanhaiBI.getSetting("border-width"),
                    borderColor: await ShanhaiBI.getSetting("border-color")
                }
            }
        ]
    };
    myChart.setOption(option);
})();