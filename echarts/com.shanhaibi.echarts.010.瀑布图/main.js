(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "title",
                alias: "标题",
                type: "string",
                default: "Living Expenses in Shenzhen"
            },
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
                name: "grid",
                alias: "网格线",
                type: "boolean",
                default: false
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let data = (await ShanhaiBI.getData()).getColumns();
    if (data.length < 2) {
        data = [['Total', 'Rent', 'Utilities', 'Transportation', 'Meals', 'Other'], [2900, 1200, 300, 200, 900, 300], [0, 1700, 1400, 1200, 300, 0]]
    } else {
        data[0].unshift("总计");
        let total = 0;
        data[1].forEach(val => {
            total += val;
        })
        data[1].unshift(total);
        data[2] = [0];
        for (let i = 1; i < data[1].length; i++) {
            total -= data[1][i]
            data[2].push(total);
        }
    }

    let option = {
        title: {
            text: await ShanhaiBI.getSetting("title"),
            textStyle: {
                color: await ShanhaiBI.getSetting("title-color")
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function (params) {
                var tar = params[1];
                return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
            }
        },
        grid: {
            left: '2%',
            right: '2%',
            bottom: 0,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data[0],
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: await ShanhaiBI.getSetting("grid")
            }
        },
        series: [
            {
                name: 'Placeholder',
                type: 'bar',
                stack: 'Total',
                itemStyle: {
                    borderColor: 'transparent',
                    color: 'transparent'
                },
                emphasis: {
                    itemStyle: {
                        borderColor: 'transparent',
                        color: 'transparent'
                    }
                },
                data: data[2]
            },
            {
                name: 'Life Cost',
                type: 'bar',
                stack: 'Total',
                label: {
                    show: true,
                    position: 'inside'
                },
                data: data[1],
                color: await ShanhaiBI.getSetting("shape-color")
            }
        ]
    };
    myChart.setOption(option);
})();