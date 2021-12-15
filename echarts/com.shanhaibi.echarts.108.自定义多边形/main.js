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
                type: "color",
                default: "#1890ff",
                alias: "图形颜色"
            },
            {
                name: "border-color",
                type: "color",
                default: "#1890ff",
                alias: "边框颜色"
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let border_color = await ShanhaiBI.getSetting("border-color");
    let rawData = await ShanhaiBI.getData();
    let x_data = rawData.getColumn("axis-x");
    let y_data = rawData.getColumn("axis-y");
    let data = [];
    if(x_data.length && y_data.length) {
        for(let i = 0; i < x_data.length; i++) {
            data.push([x_data[i], y_data[i]])
        }
    } else {
        let dataCount = 7;
        for (let i = 0; i < dataCount; i++) {
            data.push([
                echarts.number.round(Math.random() * 100),
                echarts.number.round(Math.random() * 400)
            ]);
        }
    }
    let option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['bar', 'error']
        },
        dataZoom: [
            {
                type: 'slider',
                filterMode: 'none'
            },
            {
                type: 'inside',
                filterMode: 'none'
            }
        ],
        xAxis: {},
        yAxis: {},
        series: [
            {
                type: 'custom',
                color: await ShanhaiBI.getSetting("shape-color"),
                renderItem: function (params, api) {
                    if (params.context.rendered) {
                        return;
                    }
                    params.context.rendered = true;
                    let points = [];
                    for (let i = 0; i < data.length; i++) {
                        points.push(api.coord(data[i]));
                    }
                    let color = api.visual('color');
                    return {
                        type: 'polygon',
                        transition: ['shape'],
                        shape: {
                            points: points
                        },
                        style: api.style({
                            fill: color,
                            stroke: border_color
                        })
                    };
                },
                clip: true,
                data: data
            }
        ]
    };
    myChart.setOption(option);

})();