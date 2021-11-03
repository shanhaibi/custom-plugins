(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-x",
                alias: "分类字段",
                type: "axis",
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
                name: "tooltip",
                alias: "提示信息",
                type: "boolean",
                default: false
            },
            {
                name: "title-color",
                alias: "标题颜色",
                type: "color",
                default: "#434344"
            },
            {
                name: "line-color",
                alias: "线条颜色",
                type: "palette",
                default: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570'],
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let data = await ShanhaiBI.getData();
    let x_data = data.getColumns("axis-x", 0);
    let y_data = data.getColumns("axis-y");
    let legend_data = [];
    let series = [];
    if (x_data.length && y_data.length) {
        let yAxis = await ShanhaiBI.getSetting("axis-y");
        for (let ind = 0; ind < yAxis.length; ind++) {
            legend_data.push(yAxis[ind].alias);
        }
    } else {
        x_data = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        legend_data = ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'];
        y_data = [[120, 132, 101, 134, 90, 230, 210], [220, 182, 191, 234, 290, 330, 310], [150, 232, 201, 154, 190, 330, 410], [320, 332, 301, 334, 390, 330, 320], [820, 932, 901, 934, 1290, 1330, 1320]];
    }
    for (let i = 0; i < y_data.length; i++) {
        series.push({
            name: legend_data[i],
            type: "line",
            stack: "Total",
            data: y_data[i]
        });
    }
    let option = {
        color: await ShanhaiBI.getSetting("line-color"),
        title: {
            text: 'Stacked Line',
            textStyle: {
                color: await ShanhaiBI.getSetting("title-color"),
            }
        },
        tooltip: {
            show: await ShanhaiBI.getSetting("tooltip"),
            trigger: 'axis',
        },
        legend: {
            data: legend_data,
            top: "top",
            left: "right"
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: x_data
        },
        yAxis: {
            type: 'value'
        },
        series,
    };
    myChart.setOption(option);
})();