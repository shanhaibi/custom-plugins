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
                name: "shape-color",
                alias: "图形颜色",
                type: "color",
                default: "#add691"
            },
            {
                name: "shape-size",
                alias: "图形大小(px)",
                type: "number",
                default: 20
            },
            {
                name: "ripples-color",
                alias: "涟漪颜色",
                type: "color",
                default: "#1890ff"
            },
            {
                name: "ripples-size",
                alias: "涟漪大小",
                default: 20,
                type: "number"
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let data = await ShanhaiBI.getData();
    let x_data = data.getColumns("axis-x");
    let y_data = data.getColumns("axis-y");
    let series = [
        [
            161.2, 167.5, 159.5, 157, 155.8, 170, 159.1, 166,
            176.2, 160.2, 172.5, 170.9, 172.9, 153.4, 160, 147.2,
            168.2, 175, 157, 167.6, 159.5, 175, 166.8, 176.5, 170.2,
            174, 173, 179.9, 170.5, 160, 154.4, 162, 176.5, 160, 152,
            162.1, 170, 160.2, 161.3, 166.4, 168.9, 163.8, 167.6, 160,
            161.3, 167.6, 165.1, 160, 170, 157.5, 167.6, 160.7, 163.2,
            152.4, 157.5, 168.3, 180.3, 165.5, 165, 164.5, 156, 160,
            163, 165.7, 161, 162, 166, 174, 172.7, 167.6, 151.1, 164.5,
            163.5, 152, 169, 164, 161.2, 155, 170, 176.2, 170, 162.5,
            170.3, 164.1, 169.5, 163.2, 154.5, 159.8, 173.2, 170, 161.4,
            169, 166.2, 159.4, 162.5, 159, 162.8, 159, 179.8, 162.9, 161,
            151.1, 168.2, 168.9, 173.2, 171.8, 178, 164.3, 163, 168.5,
            166.8, 172.7, 163.5, 169.4, 167.8, 159.5, 167.6, 161.2, 160,
            163.2, 162.2, 161.3, 149.5, 157.5, 163.2, 172.7, 155, 156.5,
            164, 160.9, 162.8, 167, 160, 160, 168.9, 158.2, 156, 160,
            167.1, 158, 167.6, 156, 162.1, 173.4, 159.8, 170.5, 159.2,
            157.5, 161.3, 162.6, 160, 168.9, 165.1, 162.6, 165.1, 166.4,
            160, 152.4, 170.2, 162.6, 170.2, 158.8, 172.7, 167.6, 162.6,
            167.6, 156.2, 175.2, 172.1, 162.6, 160, 165.1, 182.9, 166.4,
            165.1, 177.8, 165.1, 175.3, 154.9, 158.8, 172.7, 168.9, 161.3,
            167.6, 165.1, 175.3, 157.5, 163.8, 167.6, 165.1, 165.1, 168.9,
            162.6, 164.5, 176.5, 168.9, 175.3, 159.4, 160, 170.2, 162.6,
            167.6, 162.6, 160.7, 160, 157.5, 162.6, 152.4, 170.2, 165.1,
            172.7, 165.1, 170.2, 170.2, 170.2, 161.3, 167.6, 167.6, 165.1,
            162.6, 152.4, 168.9, 170.2, 175.2, 175.2, 160, 165.1, 174,
            170.2, 160, 167.6, 167.6, 167.6, 154.9, 162.6, 175.3, 171.4,
            157.5, 165.1, 160, 174, 162.6, 174, 162.6, 161.3, 156.2, 149.9,
            169.5, 160, 175.3, 169.5, 160, 172.7, 162.6, 157.5, 176.5, 164.4, 160.7, 174, 163.8
        ],
        [
            51.6, 59, 49.2, 63, 53.6, 59, 47.6, 69.8, 66.8, 75.2, 55.2, 54.2, 62.5,
            42, 50, 49.8, 49.2, 73.2, 47.8, 68.8, 50.6, 82.5, 57.2, 87.8, 72.8, 54.5,
            59.8, 67.3, 67.8, 47, 46.2, 55, 83, 54.4, 45.8, 53.6, 73.2, 52.1, 67.9, 56.6,
            62.3, 58.5, 54.5, 50.2, 60.3, 58.3, 56.2, 50.2, 72.9, 59.8, 61, 69.1, 55.9,
            46.5, 54.3, 54.8, 60.7, 60, 62, 60.3, 52.7, 74.3, 62, 73.1, 80, 54.7, 53.2,
            75.7, 61.1, 55.7, 48.7, 52.3, 50, 59.3, 62.5, 55.7, 54.8, 45.9, 70.6, 67.2,
            69.4, 58.2, 64.8, 71.6, 52.8, 59.8, 49, 50, 69.2, 55.9, 63.4, 58.2, 58.6, 45.7,
            52.2, 48.6, 57.8, 55.6, 66.8, 59.4, 53.6, 73.2, 53.4, 69, 58.4, 56.2, 70.6, 59.8,
            72, 65.2, 56.6, 105.2, 51.8, 63.4, 59, 47.6, 63, 55.2, 45, 54, 50.2, 60.2, 44.8,
            58.8, 56.4, 62, 49.2, 67.2, 53.8, 54.4, 58, 59.8, 54.8, 43.2, 60.5, 46.4, 64.4,
            48.8, 62.2, 55.5, 57.8, 54.6, 59.2, 52.7, 53.2, 64.5, 51.8, 56, 63.6, 63.2, 59.5,
            56.8, 64.1, 50, 72.3, 55, 55.9, 60.4, 69.1, 84.5, 55.9, 55.5, 69.5, 76.4, 61.4, 65.9,
            58.6, 66.8, 56.6, 58.6, 55.9, 59.1, 81.8, 70.7, 56.8, 60, 58.2, 72.7, 54.1, 49.1, 75.9,
            55, 57.3, 55, 65.5, 65.5, 48.6, 58.6, 63.6, 55.2, 62.7, 56.6, 53.9, 63.2, 73.6, 62, 63.6,
            53.2, 53.4, 55, 70.5, 54.5, 54.5, 55.9, 59, 63.6, 54.5, 47.3, 67.7, 80.9, 70.5, 60.9, 63.6,
            54.5, 59.1, 70.5, 52.7, 62.7, 86.3, 66.4, 67.3, 63, 73.6, 62.3, 57.7, 55.4, 104.1, 55.5,
            77.3, 80.5, 64.5, 72.3, 61.4, 58.2, 81.8, 63.6, 53.4, 54.5, 53.6, 60, 73.6, 61.4, 55.5,
            63.6, 60.9, 60, 46.8, 57.3, 64.1, 63.6, 67.3, 75.5, 68.2, 61.4, 76.8, 71.8, 55.5, 48.6, 66.4, 67.3
        ]
    ];
    let ripples = [
        [172.7, 153.4],
        [105.2, 42]
    ];
    if (x_data.length && y_data.length) {
        series = [x_data[0], y_data[0]];
        if(x_data[1] && y_data[1]) {
            ripples = [x_data[1], y_data[1]];
        }
    } 
    let series_data = [];
    for (let i = 0; i < series[0].length; i++) {
        series_data.push([series[0][i], series[1][i]]);
    }
    let ripples_data = [];
    for (let i = 0; i < ripples[0].length; i++) {
        ripples_data.push([ripples[0][i], ripples[1][i]]);
    }

    let option = {
        tooltip: {},
        xAxis: {
            scale: true
        },
        yAxis: {
            scale: true
        },
        series: [
            {
                type: 'effectScatter',
                symbolSize: await ShanhaiBI.getSetting("ripples-size"),
                data: ripples_data,
                color: await ShanhaiBI.getSetting("ripples-color")
            },
            {
                type: 'scatter',
                // prettier-ignore
                data: series_data,
                color: await ShanhaiBI.getSetting("shape-color"),
                symbolSize: await ShanhaiBI.getSetting("shape-size")
            }
        ]
    };
    myChart.setOption(option);
})();