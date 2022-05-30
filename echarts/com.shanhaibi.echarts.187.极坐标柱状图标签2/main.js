(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-category",
                alias: "分类字段",
                type: "axis"
            },
            {
                name: "axis-value",
                alias: "取值字段",
                type: "axis"
            }
        ],
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "color",
                default: "#5470c6",
            },
            {
                name: "axis",
                alias: "显示坐标轴",
                type: "boolean",
                default: true,
                cluster: { title: "极坐标轴线设置" }
            },
            {
                name: "axis-start-angle",
                alias: "轴线起始角度",
                type: "number",
                default: 75,
                cluster: { title: "极坐标轴线设置" }
            },
            {
                name: "axis-max-scale",
                alias: "最大刻度",
                type: "number",
                default: 4,
                cluster: { title: "极坐标轴线设置" }
            },
            {
                name: "label",
                alias: "显示图形文本",
                type: "boolean",
                default: true,
                cluster: { title: "图形文本设置" }
            },
            {
                name: "label-color",
                alias: "文本颜色",
                type: "color",
                default: "#fff",
                cluster: { title: "图形文本设置" }
            },
            {
                name: "label-size",
                alias: "字体大小(px)",
                type: "number",
                default: 12,
                cluster: { title: "图形文本设置" }
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let axis_display = await ShanhaiBI.getSetting("axis");
    let max_scale = await ShanhaiBI.getSetting("axis-max-scale");
    let rawData = await ShanhaiBI.getData();
    let category_data = rawData.getColumn("axis-category");
    let value_data = rawData.getColumn("axis-value");
    if (category_data.length && value_data.length) {
        max_scale = Math.max(max_scale, Math.max(...value_data));
    } else {
        category_data = ['a', 'b', 'c', 'd'];
        value_data = [2, 1.2, 2.4, 3.6];
        max_scale = Math.max(max_scale, 4);
    }

    let option = {
        title: [
            {
                text: 'Tangential Polar Bar Label Position (middle)'
            }
        ],
        polar: {
            radius: [30, '80%']
        },
        angleAxis: {
            show: axis_display,
            max: max_scale,
            startAngle: await ShanhaiBI.getSetting("axis-start-angle")
        },
        radiusAxis: {
            show: axis_display,
            type: 'category',
            data: category_data
        },
        tooltip: {},
        series: {
            type: 'bar',
            data: value_data,
            color: await ShanhaiBI.getSetting("shape-color"),
            coordinateSystem: 'polar',
            label: {
                show: await ShanhaiBI.getSetting("label"),
                position: 'middle',
                formatter: '{b}: {c}',
                color: await ShanhaiBI.getSetting("label-color"),
                fontSize: await ShanhaiBI.getSetting("label-size")
            }
        }
    };
    myChart.setOption(option);
})();