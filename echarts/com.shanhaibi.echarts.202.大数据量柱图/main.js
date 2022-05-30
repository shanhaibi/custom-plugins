(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-x",
                alias: "x轴字段",
                type: "axis"
            },
            {
                name: "axis-y",
                alias: "y轴字段",
                type: "axis"
            }
        ],
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "color",
                default: "#5470C6",
            },
            {
                name: "align-with-label",
                alias: "刻度线与标签对齐",
                type: "boolean",
                default: true,
            },
            {
                name: "grid",
                alias: "显示网格线",
                type: "boolean",
                default: true
            },
            {
                name: "toolbox",
                alias: "显示工具栏",
                type: "boolean",
                default: true,
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let rawData = await ShanhaiBI.getData();
    let x_data = rawData.getColumn("axis-x");
    let y_data = rawData.getColumn("axis-y");
    let dataCount, data;
    if (x_data.length && y_data.length) {
        data = {
            categoryData: x_data,
            valueData: y_data
        };
        dataCount = x_data.length;
    } else {
        dataCount = 5e5;
        data = generateData(dataCount);
    }
    let option = {
        title: {
            text: echarts.format.addCommas(dataCount) + ' Data',
            left: 10
        },
        toolbox: {
            show: await ShanhaiBI.getSetting("toolbox"),
            feature: {
                dataZoom: {
                    yAxisIndex: false
                },
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            bottom: 90
        },
        dataZoom: [
            {
                type: 'inside'
            },
            {
                type: 'slider'
            }
        ],
        xAxis: {
            data: data.categoryData,
            silent: false,
            splitLine: {
                show: false
            },
            axisTick: {
                alignWithLabel: await ShanhaiBI.getSetting("align-with-label")
            },
            splitArea: {
                show: false
            }
        },
        yAxis: {
            splitArea: {
                show: false
            },
            splitLine: {
                show: await ShanhaiBI.getSetting("grid")
            },
        },
        series: [
            {
                type: 'bar',
                color: await ShanhaiBI.getSetting("shape-color"),
                data: data.valueData,
                // Set `large` for large data amount
                large: true
            }
        ]
    };
    myChart.setOption(option);

    function generateData(count) {
        let baseValue = Math.random() * 1000;
        let time = +new Date(2011, 0, 1);
        let smallBaseValue;
        function next(idx) {
            smallBaseValue =
                idx % 30 === 0
                    ? Math.random() * 700
                    : smallBaseValue + Math.random() * 500 - 250;
            baseValue += Math.random() * 20 - 10;
            return Math.max(0, Math.round(baseValue + smallBaseValue) + 3000);
        }
        let categoryData = [];
        let valueData = [];
        for (let i = 0; i < count; i++) {
            categoryData.push(
                echarts.format.formatTime('yyyy-MM-dd\nhh:mm:ss', time, false)
            );
            valueData.push(next(i).toFixed(2));
            time += 1000;
        }
        return {
            categoryData: categoryData,
            valueData: valueData
        };
    }
})();