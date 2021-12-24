(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "map-color",
                alias: "地图颜色",
                type: "color",
                cluster: {title: "模型设置"},
                default: "#111"
            },
            {
                name: "model-height",
                alias: "模型高度",
                type: "number",
                cluster: {title: "模型设置"},
                default: 1.5
            },
            {
                name: "fly-line-width",
                alias: "飞线宽度",
                type: "number",
                cluster: { title: "飞线设置" },
                default: 1
            },
            {
                name: "fly-line-color",
                alias: "飞线颜色",
                type: "color",
                cluster: { title: "飞线设置" },
                default: "#323296"
            },
            {
                name: "fly-line-opacity",
                alias: "飞线透明度",
                type: "number",
                cluster: { title: "飞线设置" },
                default: 0.2
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let map_color = await ShanhaiBI.getSetting("map-color");
    let model_height = await ShanhaiBI.getSetting("model-height");
    let fly_line_width = await ShanhaiBI.getSetting("fly-line-width");
    let fly_line_color = await ShanhaiBI.getSetting("fly-line-color");
    let fly_line_opacity = await ShanhaiBI.getSetting("fly-line-opacity");

    myChart.showLoading();
    $.getJSON(ROOT_PATH + '/data-gl/asset/data/flights.json', function (data) {
        myChart.hideLoading();
        var routes = data.routes.map(function (airline) {
            return [getAirportCoord(airline[1]), getAirportCoord(airline[2])];
        });
        let option = {
            geo3D: {
                map: 'world',
                shading: 'color',
                environment: ROOT_PATH + '/data-gl/asset/starfield.jpg',
                silent: true,
                groundPlane: {
                    show: false
                },
                light: {
                    main: {
                        intensity: 0
                    },
                    ambient: {
                        intensity: 0
                    }
                },
                viewControl: {
                    distance: 50
                },
                itemStyle: {
                    color: map_color
                },
                regionHeight: model_height
            },
            series: [
                {
                    type: 'lines3D',
                    coordinateSystem: 'geo3D',
                    effect: {
                        show: true,
                        trailWidth: fly_line_width,
                        trailLength: 0.2
                    },
                    blendMode: 'lighter',
                    lineStyle: {
                        width: 0,
                        color: fly_line_color,
                        opacity: fly_line_opacity
                    },
                    data: routes
                }
            ]
        };
        myChart.setOption(option);

        function getAirportCoord(idx) {
            return [data.airports[idx][3], data.airports[idx][4]];
        }
    });
})();