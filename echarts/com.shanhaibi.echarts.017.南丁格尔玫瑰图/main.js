(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "selected-mode",
                alias: "选择模式",
                type: "select",
                choices: [
                    {
                        label: "半径",
                        value: "radius"
                    },
                    {
                        label: "区域",
                        value: "area"
                    }
                ],
                default: "radius"
            },
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
                name: "ring-width",
                alias: "圆环宽度",
                default: 55,
                type: "number"
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let data = (await ShanhaiBI.getData()).getColumns();
    if (data.length < 2) {
        data = [["rose 1", "rose 2", "rose 3", "rose 4", "rose 5", "rose 6", "rose 7", "rose 8"], [40, 33, 28, 22, 20, 15, 12, 10]];
    }
    let series_data = [];
    for (let i = 0; i < data[0].length; i++) {
        series_data.push({ value: data[1][i], name: data[0][i] });
    }
    let outer_radius = 70
    let within_radius = outer_radius - (await ShanhaiBI.getSetting("ring-width")) + "%"; 

    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        title: {
            left: "left",
            text: 'Nightingale Chart',
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
            {
                name: 'Radius Mode',
                type: 'pie',
                radius: [within_radius, outer_radius + "%"],
                roseType: await ShanhaiBI.getSetting("selected-mode"),
                itemStyle: {
                    borderRadius: 5
                },
                label: {
                    show: false,
                    textStyle: {
                        color: await ShanhaiBI.getSetting("text-color"),
                        fontSize: await ShanhaiBI.getSetting("text-size")
                    }
                },
                emphasis: {
                    label: {
                        show: true,
                        
                    }
                },
                data: series_data
            }
        ]
    };
    myChart.setOption(option);
})();