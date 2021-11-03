(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-x",
                alias: "x轴字段",
                type: "axis",
            },
            {
                name: "axis-y",
                alias: "y轴字段",
                type: "axis"
            }
        ],
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
                name: "text-label",
                alias: "文本标签",
                type: "boolean",
                default: true
            },
            {
                name: "data-color",
                alias: "数据颜色",
                type: "palette",
                default: ['#8a9dd7', '#b7db9e', '#f7d689', '#ec9194', '#a5d4e8', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570'],
            },
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
        for (let index = 0; index < yAxis.length; index++) {
            legend_data.push(yAxis[index].alias);
        }
    } else {
        x_data = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        legend_data = ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'];
        y_data = [
            [120, 132, 101, 134, 90, 230, 210],
            [220, 182, 191, 234, 290, 330, 310],
            [150, 232, 201, 154, 190, 330, 410],
            [320, 332, 301, 334, 390, 330, 320],
            [820, 932, 901, 934, 1290, 1330, 1320]
        ];
    }
    for (let i = 0; i < y_data.length; i++) {
        series.push({
            name: legend_data[i],
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: y_data[i],
        });
        if (i === y_data.length - 1) {
            series[i].label = {
                show: await ShanhaiBI.getSetting("text-label"),
                position: 'top',
                textStyle: {
                    color: "#fff",
                }
            };
        }
    }

    let option = {
        color: await ShanhaiBI.getSetting("data-color"),
        title: {
            text: 'Stacked Area Chart',
            show: await ShanhaiBI.getSetting("title"),
            textStyle: {
                color: await ShanhaiBI.getSetting("text-color")
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        grid: {
            top: "12% ",
            left: "2%",
            right: "2%",
            bottom: "4%",
            containLabel: true
        },
        legend: {
            data: legend_data,
            top: "4%",
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: x_data
            }
        ],
        yAxis: {
            type: 'value'
        },
        series
    };
    myChart.setOption(option);
})()