(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-category",
                alias: "分类字段",
                type: "axis"
            },
            {
                name: "axis-negative",
                alias: "负值字段",
                type: "axis"
            },
            {
                name: "axis-positive",
                alias: "正值字段",
                type: "axis"
            }
        ],
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
            },
            {
                name: "label-color",
                alias: "文本颜色",
                type: "color",
                default: "#aaa",
                cluster: { title: "图形文本设置" }
            },
            {
                name: "label-size",
                alias: "字体大小(px)",
                type: "number",
                default: 16,
                cluster: { title: "图形文本设置" }
            },
            {
                name: "net-worth-alias",
                alias: "净值别称",
                type: "string",
                default: "Profit"
            },
            {
                name: "positive-alias",
                alias: "正值别称",
                type: "string",
                default: "Income"
            },
            {
                name: "negative-alias",
                alias: "负值别称",
                type: "string",
                default: "Expenses"
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let label_style = {
        color: await ShanhaiBI.getSetting("label-color"),
        fontSize: await ShanhaiBI.getSetting("label-size")
    };
    let rawData = await ShanhaiBI.getData();
    let category_data = rawData.getColumn("axis-category");
    let negative_data = rawData.getColumn("axis-negative");
    let positive_data = rawData.getColumn("axis-positive");
    let net_worth_data = [];
    if (!category_data.length || !negative_data.length || !positive_data.length) {
        net_worth_data = [200, 170, 240, 244, 200, 220, 210];
        category_data = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        negative_data = [-120, -132, -101, -134, -190, -230, -210];
        positive_data = [320, 302, 341, 374, 390, 450, 420];
    } else {
        for(let i = 0; i < positive_data.length; i++) {
            net_worth_data.push((positive_data[i] + negative_data[i]).toFixed(1));
        }
    }
    
    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            textStyle: { color: "#aaa" }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'value'
            }
        ],
        yAxis: [
            {
                type: 'category',
                axisTick: {
                    show: false
                },
                data: category_data
            }
        ],
        series: [
            {
                name: await ShanhaiBI.getSetting("net-worth-alias"),
                type: 'bar',
                label: {
                    show: true,
                    position: 'inside',
                    ...label_style
                },
                emphasis: {
                    focus: 'series'
                },
                data: net_worth_data
            },
            {
                name: await ShanhaiBI.getSetting("positive-alias"),
                type: 'bar',
                stack: 'Total',
                label: {
                    show: true,
                    ...label_style
                },
                emphasis: {
                    focus: 'series'
                },
                data: positive_data
            },
            {
                name: await ShanhaiBI.getSetting("negative-alias"),
                type: 'bar',
                stack: 'Total',
                label: {
                    show: true,
                    position: 'left',
                    ...label_style
                },
                emphasis: {
                    focus: 'series'
                },
                data: negative_data
            }
        ]
    };
    myChart.setOption(option);
})();