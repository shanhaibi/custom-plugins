(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            },
            {
                name: "background-color",
                alias: "空间背景色",
                type: "color",
                default: '#000'
            },
            {
                name: "light-intensity",
                alias: "光照强度",
                type: "number",
                default: 3
            },
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let background_color = await ShanhaiBI.getSetting("background-color");
    let light_intensity = await ShanhaiBI.getSetting("light-intensity");
    
    $.getJSON(ROOT_PATH + '/data-gl/asset/data/buildings.json', function (buildingsGeoJSON) {
        echarts.registerMap('buildings', buildingsGeoJSON);
        let regions = buildingsGeoJSON.features.map(function (feature) {
            return {
                name: feature.properties.name,
                value: Math.random(),
                height: feature.properties.height / 10
            };
        });
        let option = {
            visualMap: {
                show: false,
                min: 0.4,
                max: 1,
                inRange: {
                    color: shape_color
                }
            },
            series: [
                {
                    type: 'map3D',
                    map: 'buildings',
                    shading: 'realistic',
                    environment: background_color,
                    realisticMaterial: {
                        roughness: 0.6,
                        textureTiling: 20
                    },
                    postEffect: {
                        enable: true,
                        SSAO: {
                            enable: true,
                            intensity: 1.3,
                            radius: 5
                        },
                        screenSpaceReflection: {
                            enable: false
                        },
                        depthOfField: {
                            enable: true,
                            blurRadius: 4,
                            focalDistance: 50
                        }
                    },
                    light: {
                        main: {
                            intensity: light_intensity,
                            alpha: 40,
                            shadow: true,
                            shadowQuality: 'high'
                        },
                        ambient: {
                            intensity: 0
                        },
                        ambientCubemap: {
                            texture: ROOT_PATH + '/data-gl/asset/pisa.hdr',
                            exposure: 1,
                            diffuseIntensity: 0.5,
                            specularIntensity: 1
                        }
                    },
                    groundPlane: {
                        show: false,
                        color: '#333'
                    },
                    viewControl: {
                        minBeta: -360,
                        maxBeta: 360,
                        alpha: 50,
                        center: [50, 0, -10],
                        distance: 30,
                        minDistance: 5,
                        panMouseButton: 'left',
                        rotateMouseButton: 'middle',
                        zoomSensitivity: 0.5
                    },
                    itemStyle: {
                        areaColor: '#666'
                        // borderColor: '#222',
                        // borderWidth: 1
                    },
                    label: {
                        color: 'white'
                    },
                    silent: true,
                    instancing: true,
                    boxWidth: 200,
                    boxHeight: 1,
                    data: regions
                }
            ]
        };
        myChart.setOption(option);
    });
})();