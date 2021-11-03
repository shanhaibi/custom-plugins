(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "title",
                alias: "标题",
                type: "boolean",
                default: true
            },
            {
                name: "text-color",
                alias: "标题颜色",
                type: "color",
                default: "#fff",
            },
            {
                name: "area-color",
                alias: "面积颜色",
                type: "color",
                default: "#1890ff"
            },
            {
                name: "data-color",
                alias: "数据颜色",
                type: "color",
                default: "#1890ff"
            }
        ]
    })
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let data = (await ShanhaiBI.getData()).getColumns();
    if(data.length < 2) {
        data = [['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], [820, 932, 901, 934, 1290, 1330, 1320]];
    }

    let option = {
        title: {
            text: "面积图",
            show: await ShanhaiBI.getSetting("title"),
            textStyle: {
                color: await ShanhaiBI.getSetting("text-color")
            }
        },
        tooltip: {
            trigger: "axis"
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data[0],
            axisLabel: {
                rotate: -45
            }
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                color: await ShanhaiBI.getSetting("data-color"),
                data: data[1],
                type: 'line',
                areaStyle: {
                    color: await ShanhaiBI.getSetting("area-color"),
                }
            }
        ]
    };
    myChart.setOption(option);
})()