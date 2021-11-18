(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "tooltip",
                alias: "显示提示信息",
                type: "boolean",
                default: true
            },
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "color",
                default: "#1890ff"
            },
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let data = (await ShanhaiBI.getData()).getColumns();
    if (data.length < 2) {
        data = [['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], [150, 230, 224, 218, 135, 147, 260]]
    }

    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            show: await ShanhaiBI.getSetting("tooltip")
        },
        xAxis: {
            type: 'category',
            data: data[0],
        },
        grid: {
            left: '2%',
            right: '2%',
            bottom: 0,
            containLabel: true
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: data[1],
                type: 'bar',
                color: await ShanhaiBI.getSetting("shape-color")
            }
        ]
    };
    myChart.setOption(option);
})();