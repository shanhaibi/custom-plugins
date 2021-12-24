(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "map-color",
                alias: "地图颜色",
                type: "color",
                default: "#000"
            },
            {
                name: "light-intensity",
                alias: "光照强度",
                type: "number",
                default: 1
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
    let light_intensity = await ShanhaiBI.getSetting("light-intensity");
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
                shading: 'realistic',
                silent: true,
                environment: '#333',
                realisticMaterial: {
                    roughness: 0.8,
                    metalness: 0
                },
                postEffect: {
                    enable: true
                },
                groundPlane: {
                    show: false
                },
                light: {
                    main: {
                        intensity: light_intensity,
                        alpha: 30
                    },
                    ambient: {
                        intensity: 0
                    }
                },
                viewControl: {
                    distance: 70,
                    alpha: 89,
                    panMouseButton: 'left',
                    rotateMouseButton: 'right',
                },
                itemStyle: {
                    color: map_color
                },
                regionHeight: 0.5
            },
            series: [
                {
                    type: 'lines3D',
                    coordinateSystem: 'geo3D',
                    effect: {
                        show: true,
                        trailWidth: fly_line_width,
                        trailOpacity: 0.5,
                        trailLength: 0.2,
                        constantSpeed: 5
                    },
                    blendMode: 'lighter',
                    lineStyle: {
                        width: fly_line_width,
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