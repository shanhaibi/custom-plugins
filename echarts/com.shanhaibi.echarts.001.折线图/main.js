(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-x",
                alias: "分类字段",
                type: "axis",
                multiple: true
            },
            {
                name: "axis-y",
                alias: "取值字段",
                type: "axis",
                multiple: true
            }
        ],
        "format": [
            {
                name: "tooltop",
                alias: "提示信息",
                type: "boolean",
                default: false
            },
            {
                name: "series-shape-type",
                alias: "折线形状",
                type: "select",
                default: "line",
                choices: [
                    {
                        label: "折线",
                        value: "line"
                    },
                    {
                        label: "平滑",
                        value: "smooth"
                    }
                ]
            },
            {
                name: "line-color",
                alias: "线条颜色",
                type: "color",
                default: "#5873c6"
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let data = await ShanhaiBI.getData();
    let xAxis = data.getColumn("axis-x");
    let yAxis = data.getColumn("axis-y");
    if (!xAxis.length || !yAxis.length) {
        xAxis = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        yAxis = [150, 230, 224, 218, 135, 147, 260];
    }

    let option = {
        tooltip: {
            trigger: 'axis',
            show: await ShanhaiBI.getSetting("tooltop")
        },
        xAxis: {
            type: 'category',
            data: xAxis
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: yAxis,
                type: 'line',
                smooth: await ShanhaiBI.getSetting("series-shape-type") === "line" ? false : true,
                color: await ShanhaiBI.getSetting("line-color"),
            }
        ]
    };
    myChart.setOption(option);
})();