(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "title-color",
                alias: "标题颜色",
                type: "color",
                default: "#fff"
            },
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "color",
                default: "#1890ff"
            },
            {
                name: "shape-label-color",
                alias: "图形字体颜色",
                type: "color",
                default: "#fff"
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let data = (await ShanhaiBI.getData()).getColumns();
    if (data.length < 2) {
        data = [['ten', 'nine', 'eight', 'seven', 'six', 'five', 'four', 'three', 'two', 'one'], [-0.07, -0.09, 0.2, 0.44, -0.23, 0.08, -0.17, 0.47, -0.36, 0.18]]
    }
    for (let i = 0; i < data[1].length; i++) {
        if (data[1][i] <= 0) {
            data[1][i] = { value: data[1][i], label: { position: "right" } };
        }
    }

    let option = {
        title: {
            text: 'Bar Chart with Negative Value',
            textStyle: {
                color: await ShanhaiBI.getSetting("title-color")
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            top: 80,
            bottom: 30
        },
        xAxis: {
            type: 'value',
            position: 'top',
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        yAxis: {
            type: 'category',
            axisLine: { show: false },
            axisLabel: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
            data: data[0]
        },
        series: [
            {
                name: 'Cost',
                type: 'bar',
                // stack: 'Total',
                label: {
                    show: true,
                    formatter: '{b}',
                    color: await ShanhaiBI.getSetting("shape-label-color")
                },
                data: data[1],
                color: await ShanhaiBI.getSetting("shape-color")
            }
        ]
    };
    myChart.setOption(option);
})();