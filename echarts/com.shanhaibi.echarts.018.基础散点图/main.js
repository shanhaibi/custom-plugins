(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                type: "color",
                alias: "图形颜色",
                default: "#1890ff"
            },
            {
                name: "shape-size",
                alias: "图形大小",
                type: "number",
                default: 20
            }

        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let data = (await ShanhaiBI.getData()).getColumns();
    if (data.length < 2) {
        data = [
            [10.0, 8.07, 13.0, 9.05, 11.0, 14.0, 13.4, 10.0, 14.0, 12.5, 9.15, 11.5, 3.03, 12.2, 2.02, 1.05, 4.05, 6.03, 12.0, 12.0, 7.08, 5.02],
            [8.04, 6.95, 7.58, 8.81, 8.33, 7.66, 6.81, 6.33, 8.96, 6.82, 7.2, 7.2, 4.23, 7.83, 4.47, 3.33, 4.96, 7.24, 6.26, 8.84, 5.82, 5.58]
        ];
    }
    let series_data = [];
    for(let i = 0; i < data[0].length; i++) {
        series_data.push([data[0][i], data[1][i]]);
    }
    let option = {
        tooltip: {},
        xAxis: {},
        yAxis: {},
        series: [
            {
                symbolSize: await ShanhaiBI.getSetting("shape-size"),
                data: series_data,
                type: 'scatter',
                color: await ShanhaiBI.getSetting("shape-color")
            }
        ]
    };
    myChart.setOption(option);
})();