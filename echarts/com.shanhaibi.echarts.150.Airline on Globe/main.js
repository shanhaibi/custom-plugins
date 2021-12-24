(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "light-intensity",
                alias: "光照强度",
                type: "number",
                default: 0.4
            },
            {
                name: "ambient-intensity",
                alias: "环境光强度",
                type: "number",
                default: 0.4
            },
            {
                name: "auto-rotate",
                alias: "自动旋转",
                type: "boolean",
                default: false
            },
            {
                name: "fly-line-width",
                alias: "飞线宽度",
                type: "number",
                cluster: {title: "飞线设置"},
                default: 1
            },
            {
                name: "fly-line-color",
                alias: "飞线颜色",
                type: "color",
                cluster: {title: "飞线设置"},
                default: "#323296"
            },
            {
                name: "fly-line-opacity",
                alias: "飞线透明度",
                type: "number",
                cluster: {title: "飞线设置"},
                default: 0.1
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let light_intensity = await ShanhaiBI.getSetting("light-intensity");
    let ambient_intensity = await ShanhaiBI.getSetting("ambient-intensity");
    let auto_rotate = await ShanhaiBI.getSetting("auto-rotate");
    let fly_line_width = await ShanhaiBI.getSetting("fly-line-width");
    let fly_line_color = await ShanhaiBI.getSetting("fly-line-color");
    let fly_line_opacity = await ShanhaiBI.getSetting("fly-line-opacity");

    $.getJSON(ROOT_PATH + '/data-gl/asset/data/flights.json', function (data) {
        let routes = data.routes.map(function (airline) {
            return [getAirportCoord(airline[1]), getAirportCoord(airline[2])];
        });
        let option = {
            globe: {
                baseTexture: ROOT_PATH + '/data-gl/asset/world.topo.bathy.200401.jpg',
                heightTexture: ROOT_PATH + '/data-gl/asset/bathymetry_bw_composite_4k.jpg',
                shading: 'lambert',
                light: {
                    ambient: {
                        intensity: ambient_intensity
                    },
                    main: {
                        intensity: light_intensity
                    }
                },
                viewControl: {
                    autoRotate: auto_rotate
                }
            },
            series: {
                type: 'lines3D',
                coordinateSystem: 'globe',
                blendMode: 'lighter',
                lineStyle: {
                    width: fly_line_width,
                    color: fly_line_color,
                    opacity: fly_line_opacity
                },
                data: routes
            }
        };
        myChart.setOption(option);

        function getAirportCoord(idx) {
            return [data.airports[idx][3], data.airports[idx][4]];
        }
    });
})();