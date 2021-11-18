(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "text-color",
                alias: "文本颜色",
                type: "color",
                default: "#fff"
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
                type: "palette",
                default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
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
        data = [["Search Engine", "Direct", "Email", "Union Ads", "Video Ads"], [1048, 735, 580, 484, 300]];
    }
    let series_data = [];
    for(let i = 0; i < data[0].length; i++) {
        series_data.push({value: data[1][i], name: data[0][i]});
    }

    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            textStyle: {
                color: "#aaa"
            },
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: (await ShanhaiBI.getSetting("radius")) + "%",
                label: {
                    color: await ShanhaiBI.getSetting("text-color"),
                    fontSize: await ShanhaiBI.getSetting("text-size")
                },
                data: series_data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
})();