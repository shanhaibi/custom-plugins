(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "light-intensity",
                alias: "光照强度",
                type: "number",
                default: 0.1
            },
            {
                name: "displacement-scale",
                alias: "地球表面突起程度",
                type: "number",
                default: 0.05
            },
            {
                name: "scatter-color",
                alias: "散点颜色",
                type: "color",
                default: "#323296"
            }
        ]
    })

    let resource_path = "./resource";
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let light_intensity = await ShanhaiBI.getSetting("light-intensity");
    let displacement_scale = await ShanhaiBI.getSetting("displacement-scale");
    let scatter_color = await ShanhaiBI.getSetting("scatter-color");

    $.getJSON(resource_path + "/population.json", function (data) {
        data = data
            .filter(function (dataItem) {
                return dataItem[2] > 0;
            })
            .map(function (dataItem) {
                return [dataItem[0], dataItem[1], Math.sqrt(dataItem[2])];
            });
        let option = {
            visualMap: {
                show: false,
                min: 0,
                max: 60,
                inRange: {
                    symbolSize: [1.0, 10.0]
                }
            },
            globe: {
                environment: resource_path + '/starfield.jpg',
                heightTexture: resource_path + '/bathymetry_bw_composite_4k.jpg',
                displacementScale: displacement_scale,
                displacementQuality: 'high',
                globeOuterRadius: 100,
                baseColor: '#000',
                shading: 'realistic',
                realisticMaterial: {
                    roughness: 0.2,
                    metalness: 0
                },
                postEffect: {
                    enable: true,
                    depthOfField: {
                        focalRange: 15,
                        enable: true,
                        focalDistance: 100
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
                        texture: resource_path + '/lake.hdr',
                        exposure: 1,
                        diffuseIntensity: 0.5,
                        specularIntensity: 2
                    }
                },
                viewControl: {
                    autoRotate: false,
                    beta: 180,
                    alpha: 20,
                    distance: 100
                }
            },
            series: {
                type: 'scatter3D',
                coordinateSystem: 'globe',
                blendMode: 'lighter',
                symbolSize: 2,
                itemStyle: {
                    color: scatter_color,
                    opacity: 1
                },
                data: data
            }
        };
        myChart.setOption(option);
    });
})();