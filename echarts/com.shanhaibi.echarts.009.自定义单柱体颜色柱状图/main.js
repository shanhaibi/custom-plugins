(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "series-shape-custom",
                alias: "条柱独立设置",
                type: "boolean",
                default: false,
                group: "plugin_series-shape-custom"
            },
            {
                name: "series-shape-num",
                alias: "条柱下标",
                default: 0,
                type: "number",
                group: "plugin_series-shape-custom"
            },
            {
                name: "series-shape-color",
                alias: "图形颜色",
                default: "#1890ff",
                type: "color",
                group: "plugin_series-shape-custom"
            },
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
    if(await ShanhaiBI.getSetting("series-shape-custom")) {
        let index = await ShanhaiBI.getSetting("series-shape-num");
        let length = data[1].length
        if(index < 0) {
            index = 0;
        } else if(index >= length) {
            index = length - 1;
        }
        data[1][index] = {
            value: data[1][index],
            itemStyle: {
                color: await ShanhaiBI.getSetting("series-shape-color")
            }
        };
    }

    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            show: await ShanhaiBI.getSetting("tooltip")
        },
        grid: {
            left: '3%',
            right: '3%',
            bottom: 0,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data[0],
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