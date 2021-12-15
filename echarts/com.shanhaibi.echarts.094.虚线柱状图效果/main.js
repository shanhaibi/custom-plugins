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
                name: "line-color",
                alias: "折线颜色",
                type: "color",
                default: '#5470c6'
            },
            {
                name: "column-color",
                alias: "柱体颜色",
                type: "palette",
                default: ["#14c8d4", "#43eec6"]
            },
            {
                name: "base-color",
                alias: "底色",
                type: "color",
                default: "#0f375f"
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let rawData = await ShanhaiBI.getData();
    let category_data = rawData.getColumn("axis-category");
    let value_data = rawData.getColumns("axis-value");
    let category = [];
    let lineData = [];
    let barData = [];
    let column_color = await ShanhaiBI.getSetting("column-color");
    let base_color = await ShanhaiBI.getSetting("base-color");

    if (category_data.length && value_data.length > 1) {
        category = category_data;
        barData = value_data[0];
        for (let i = 0; i < value_data[0].length; i++) {
            lineData.push(value_data[0][i] + value_data[1][i]);
        }
    } else {
        let dottedBase = +new Date();
        for (let i = 0; i < 20; i++) {
            let date = new Date((dottedBase += 3600 * 24 * 1000));
            category.push(
                [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-')
            );
            let b = Math.random() * 200;
            let d = Math.random() * 200;
            barData.push(b);
            lineData.push(d + b);
        }
    }

    let option = {
        backgroundColor: base_color,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['line', 'bar'],
            textStyle: {
                color: '#ccc'
            }
        },
        xAxis: {
            data: category,
            axisLine: {
                lineStyle: {
                    color: '#ccc'
                }
            }
        },
        yAxis: {
            splitLine: { show: false },
            axisLine: {
                lineStyle: {
                    color: '#ccc'
                }
            }
        },
        series: [
            {
                name: 'line',
                type: 'line',
                smooth: true,
                showAllSymbol: true,
                symbol: 'emptyCircle',
                symbolSize: 15,
                data: lineData,
                color: await ShanhaiBI.getSetting("line-color"),
            },
            {
                name: 'bar',
                type: 'bar',
                barWidth: 10,
                itemStyle: {
                    borderRadius: 5,
                    color: generateLinearGradient(column_color),
                },
                data: barData
            },
            {
                name: 'line',
                type: 'bar',
                barGap: '-100%',
                barWidth: 10,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(20,200,212,0.5)' },
                        { offset: 0.2, color: 'rgba(20,200,212,0.2)' },
                        { offset: 1, color: 'rgba(20,200,212,0)' }
                    ])
                },
                z: -12,
                data: lineData
            },
            {
                name: 'dotted',
                type: 'pictorialBar',
                symbol: 'rect',
                itemStyle: {
                    color: base_color
                },
                symbolRepeat: true,
                symbolSize: [12, 4],
                symbolMargin: 1,
                z: -10,
                data: lineData
            }
        ]
    };
    myChart.setOption(option);

    function generateLinearGradient(colors) {
        let color_arr = [], colors_len = colors.length;
        for(let i = 0; i < colors_len; i++) {
            color_arr.push({
                offset: i / (colors_len - 1),
                color: colors[i]
            })
        }
        return new echarts.graphic.LinearGradient(0, 0, 0, 1, color_arr)
    }
})();