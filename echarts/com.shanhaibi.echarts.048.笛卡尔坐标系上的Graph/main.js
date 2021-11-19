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
                name: "line-color",
                alias: "线段颜色",
                type: "color",
                default: "#2f4554"
            },
            {
                name: "shape-color",
                alias: "图形颜色",
                default: "#5873c6",
                type: "color"
            },
            {
                name: "text-color",
                alias: "文本颜色",
                default: "#fff",
                type: "color"
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let dataRaw = await ShanhaiBI.getData();
    let x_data = dataRaw.getColumn("axis-x");
    let y_data = dataRaw.getColumn("axis-y");
    let axisData = ['Mon', 'Tue', 'Wed', 'Very Loooong Thu', 'Fri', 'Sat', 'Sun'];
    let data = axisData.map(function (item, i) {
        return Math.round(Math.random() * 1000 * (i + 1));
    });
    if(x_data.length && y_data.length) {
        axisData = x_data;
        data = y_data;
    }
    let links = data.map(function (item, i) {
        return {
            source: i,
            target: i + 1
        };
    });
    let option = {
        title: {
            text: 'Graph on Cartesian'
        },
        tooltip: {},
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: axisData
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                type: 'graph',
                layout: 'none',
                coordinateSystem: 'cartesian2d',
                symbolSize: 40,
                label: {
                    show: true,
                    color: await ShanhaiBI.getSetting("text-color")
                },
                itemStyle: {
                    color: await ShanhaiBI.getSetting("shape-color")
                },
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [4, 10],
                data: data,
                links: links,
                lineStyle: {
                    color: await ShanhaiBI.getSetting("line-color")
                }
            }
        ]
    };
    myChart.setOption(option);
})();