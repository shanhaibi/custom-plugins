(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-background-color",
                alias: "图形底色",
                type: "color",
                default: "rgba(180, 180, 180, 0.2)",
                gradient: true,
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
    let shape_background_color = (await ShanhaiBI.getSetting("shape-background-color")).colors[0].color
    if (typeof shape_background_color === "object") {
        let color_str = "rgba("
        shape_background_color.color.map(item => {
            color_str += `${item}, `;
        })
        shape_background_color = color_str + "0.2)";
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
        yAxis: {
            type: 'value',
        },
        grid: {
            top: "5%",
            left: '10%',
            right: '10%',
            bottom: 0,
            containLabel: true
        },
        series: [
            {
                data: data[1],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: shape_background_color
                },
                color: await ShanhaiBI.getSetting("shape-color")
            }
        ]
    };
    myChart.setOption(option);
})();