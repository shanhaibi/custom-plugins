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
            },
        ],
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ["rgb(255, 158, 68)", "rgb(255, 70, 131)"]
            },
            {
                name: "outline-color",
                alias: "轮廓颜色",
                type: "color",
                default: "rgb(255, 70, 131)"
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let rawData = await ShanhaiBI.getData();
    let category_data = rawData.getColumn("axis-category");
    let value_data = rawData.getColumn("axis-value");
    if(!category_data.length || !value_data.length) {
        category_data = [], value_data = [Math.random() * 300];
        let base = +new Date(1968, 9, 3);
        let oneDay = 24 * 3600 * 1000;
        for (let i = 1; i < 20000; i++) {
            let now = new Date((base += oneDay));
            category_data.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
            value_data.push(Math.round((Math.random() - 0.5) * 20 + value_data[i - 1]));
        }
    }
    let option = {
        tooltip: {
            trigger: 'axis',
            confine: true,
            position: function (pt) {
                return [pt[0], '10%'];
            }
        },
        title: {
            left: 'center',
            text: 'Large Area Chart'
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: category_data
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
        },
        dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 10
            },
            {
                start: 0,
                end: 10
            }
        ],
        series: [
            {
                name: 'Fake Data',
                type: 'line',
                symbol: 'none',
                sampling: 'lttb',
                itemStyle: {
                    color: await ShanhaiBI.getSetting("outline-color")
                },
                areaStyle: {
                    color: generateLinearGradient(shape_color)
                },
                data: value_data
            }
        ]
    };
    myChart.setOption(option);

    function generateLinearGradient(colors) {
        if (colors.length < 2) return colors[0] ? colors[0] : "#1890ff";
        let color_arr = [], colors_len = colors.length;
        for (let i = 0; i < colors_len; i++) {
            color_arr.push({
                offset: i / (colors_len - 1),
                color: colors[i]
            })
        }
        return new echarts.graphic.LinearGradient(0, 0, 0, 1, color_arr)
    }
})();