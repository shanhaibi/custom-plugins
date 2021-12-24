(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "color",
                default: "#faf7f3"
            },
            {
                name: "light-intensity",
                alias: "光照强度",
                type: "number",
                default: 3
            },
            {
                name: "bloom",
                alias: "开启光晕",
                type: "boolean",
                default: false
            },
            {
                name: "ground-plane",
                alias: "显示地板",
                type: "boolean",
                default: true
            },
            {
                name: "ground-plane-color",
                alias: "地板颜色",
                type: "color",
                default: "#333"
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let light_intensity = await ShanhaiBI.getSetting("light-intensity");
    let bloom = await ShanhaiBI.getSetting("bloom");
    let ground_plane_display = await ShanhaiBI.getSetting("ground-plane");
    let ground_plane_color = await ShanhaiBI.getSetting("ground-plane-color");

    $.getJSON(ROOT_PATH + '/data-gl/asset/data/buildings.json', function (buildingsGeoJSON) {
        echarts.registerMap('buildings', buildingsGeoJSON);
        let regions = buildingsGeoJSON.features.map(function (feature) {
            return {
                name: feature.properties.name,
                value: Math.max(Math.sqrt(feature.properties.height), 0.1),
                height: Math.max(Math.sqrt(feature.properties.height), 0.1)
            };
        });
        let option = {
            visualMap: {
                show: false,
                inRange: {
                    color: shape_color
                }
            },
            series: [
                {
                    type: 'map3D',
                    map: 'buildings',
                    shading: 'realistic',
                    realisticMaterial: {
                        roughness: 0.6,
                        textureTiling: 20,
                        detailTexture: ROOT_PATH + '/data-gl/asset/woods.jpg'
                    },
                    postEffect: {
                        enable: true,
                        bloom: {
                            enable: bloom
                        },
                        SSAO: {
                            enable: true,
                            quality: 'medium',
                            radius: 10,
                            intensity: 1.2
                        },
                        depthOfField: {
                            enable: false,
                            focalRange: 5,
                            fstop: 1,
                            blurRadius: 6
                        }
                    },
                    groundPlane: {
                        show: ground_plane_display,
                        color: ground_plane_color
                    },
                    light: {
                        main: {
                            intensity: light_intensity,
                            shadow: true,
                            shadowQuality: 'high',
                            alpha: 30
                        },
                        ambient: {
                            intensity: 0
                        },
                        ambientCubemap: {
                            texture: ROOT_PATH + '/data-gl/asset/canyon.hdr',
                            exposure: 2,
                            diffuseIntensity: 1,
                            specularIntensity: 1
                        }
                    },
                    viewControl: {
                        minBeta: -360,
                        maxBeta: 360
                    },
                    itemStyle: {
                        areaColor: '#666'
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