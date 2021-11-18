(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "color",
                default: "#b02a02"
            }
        ]
    })
    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let data = (await ShanhaiBI.getData()).getColumns();
    if (data.length < 2) {
        data = [
            [488.2358421078053, 770.3415644319939, 1180.0329284196291, 894.03790632245, 1372.98925630313, 1378.62251255796],
            [459.70913833075736, 757.9672194986475, 743.6141808346214, 1188.1985153835008, 477.3839988649537, 935.6708486282843],
            [100, 30, 80, 61, 70, 81]
        ];

    }
    let series_data = [];
    for (let i = 0; i < data[0].length; i++) {
        let size = data[2] ? data[2][i] : 0
        series_data.push([data[0][i], data[1][i], size])
    }
    $.get(ROOT_PATH + '/data/asset/geo/Map_of_Iceland.svg', function (svg) {
        echarts.registerMap('iceland_svg', { svg: svg });
        let option = {
            tooltip: {},
            geo: {
                tooltip: {
                    show: true
                },
                map: 'iceland_svg',
                roam: true
            },
            series: {
                type: 'effectScatter',
                coordinateSystem: 'geo',
                geoIndex: 0,
                symbolSize: function (params) {
                    return (params[2] / 100) * 15 + 10;
                },
                itemStyle: {
                    color: shape_color
                },
                encode: {
                    tooltip: 2
                },
                data: series_data
            }
        };
        myChart.setOption(option);
        myChart.getZr().on('click', function (params) {
            var pixelPoint = [params.offsetX, params.offsetY];
            var dataPoint = myChart.convertFromPixel({ geoIndex: 0 }, pixelPoint);
            console.log(dataPoint);
        });
    });
})();