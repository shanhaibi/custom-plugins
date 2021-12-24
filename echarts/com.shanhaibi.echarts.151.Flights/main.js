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
                name: "auto-rotate",
                alias: "自动旋转",
                type: "boolean",
                cluster: { title: "旋转设置" },
                default: false
            },
            {
                name: "rotate-direction",
                alias: "旋转方向",
                type: "select",
                cluster: { title: "旋转设置" },
                choices: [
                    {
                        label: "顺时针方向",
                        value: "cw"
                    },
                    {
                        label: "逆时针方向",
                        value: "ccw"
                    }
                ],
                default: "ccw"
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

    let light_intensity = await ShanhaiBI.getSetting("light-intensity");
    let auto_rotate = await ShanhaiBI.getSetting("auto-rotate");
    let rotate_direction = await ShanhaiBI.getSetting("rotate-direction")
    let fly_line_width = await ShanhaiBI.getSetting("fly-line-width");
    let fly_line_color = await ShanhaiBI.getSetting("fly-line-color");
    let fly_line_opacity = await ShanhaiBI.getSetting("fly-line-opacity");
console.log(rotate_direction)
    $.getJSON(ROOT_PATH + '/data-gl/asset/data/flights.json', function (data) {
        let airports = data.airports.map(function (item) {
            return {
                coord: [item[3], item[4]]
            };
        });
        let routesGroupByAirline = {};
        data.routes.forEach(function (route) {
            let airline = data.airlines[route[0]];
            let airlineName = airline[0];
            if (!routesGroupByAirline[airlineName]) {
                routesGroupByAirline[airlineName] = [];
            }
            routesGroupByAirline[airlineName].push(route);
        });
        let pointsData = [];
        data.routes.forEach(function (airline) {
            pointsData.push(getAirportCoord(airline[1]));
            pointsData.push(getAirportCoord(airline[2]));
        });
        let series = data.airlines
            .map(function (airline) {
                let airlineName = airline[0];
                let routes = routesGroupByAirline[airlineName];
                if (!routes) {
                    return null;
                }
                return {
                    type: 'lines3D',
                    name: airlineName,
                    effect: {
                        show: true,
                        trailWidth: 2,
                        trailLength: 0.15,
                        trailOpacity: 1,
                        trailColor: 'rgb(30, 30, 60)'
                    },
                    lineStyle: {
                        width: fly_line_width,
                        color: fly_line_color,
                        opacity: fly_line_opacity
                    },
                    blendMode: 'lighter',
                    data: routes.map(function (item) {
                        return [airports[item[1]].coord, airports[item[2]].coord];
                    })
                };
            })
            .filter(function (series) {
                return !!series;
            });
        series.push({
            type: 'scatter3D',
            coordinateSystem: 'globe',
            blendMode: 'lighter',
            symbolSize: 2,
            itemStyle: {
                color: 'rgb(50, 50, 150)',
                opacity: 0.2
            },
            data: pointsData
        });
        let option = {
            legend: {
                selectedMode: 'single',
                left: 'left',
                data: Object.keys(routesGroupByAirline),
                orient: 'vertical',
                textStyle: {
                    color: '#fff'
                }
            },
            globe: {
                environment: ROOT_PATH + '/data-gl/asset/starfield.jpg',
                heightTexture: ROOT_PATH + '/data-gl/asset/bathymetry_bw_composite_4k.jpg',
                displacementScale: 0.1,
                displacementQuality: 'high',
                baseColor: '#000',
                shading: 'realistic',
                realisticMaterial: {
                    roughness: 0.2,
                    metalness: 0
                },
                postEffect: {
                    enable: true,
                    depthOfField: {
                        enable: false,
                        focalDistance: 150
                    }
                },
                temporalSuperSampling: {
                    enable: true
                },
                light: {
                    ambient: {
                        intensity: 0
                    },
                    main: {
                        intensity: light_intensity,
                        shadow: false
                    },
                    ambientCubemap: {
                        texture: ROOT_PATH + '/data-gl/asset/lake.hdr',
                        exposure: 1,
                        diffuseIntensity: 0.5,
                        specularIntensity: 2
                    }
                },
                viewControl: {
                    autoRotate: auto_rotate,
                    autoRotateDirection: rotate_direction
                },
                silent: true
            },
            series: series
        };
        myChart.setOption(option);

        function getAirportCoord(idx) {
            return [data.airports[idx][3], data.airports[idx][4]];
        }
    });
})();