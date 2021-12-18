(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "earth-color",
                alias: "地球颜色",
                type: "color",
                default: "#fff"
            },
            {
                name: "material-roughness",
                alias: "材质粗糙度",
                type: "number",
                default: 0.8
            },
            {
                name: "displacement-scale",
                alias: "地球表面突起程度",
                type: "number",
                default: 0.1
            },
            {
                name: "light-intensity",
                alias: "光照强度",
                type: "number",
                default: 1
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let option = {
        globe: {
            displacementTexture:
                ROOT_PATH + '/data-gl/asset/bathymetry_bw_composite_4k.jpg',
            displacementScale: await ShanhaiBI.getSetting("displacement-scale"),
            displacementQuality: 'ultra',
            baseColor: await ShanhaiBI.getSetting("earth-color"),
            shading: 'realistic',
            realisticMaterial: {
                roughness: await ShanhaiBI.getSetting("material-roughness"),
                metalness: 0
            },
            postEffect: {
                enable: true,
                SSAO: {
                    enable: true,
                    radius: 2,
                    intensity: 1.5,
                    quality: 'high'
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
                    intensity: await ShanhaiBI.getSetting("light-intensity"),
                    shadow: true
                },
                ambientCubemap: {
                    texture: ROOT_PATH + '/data-gl/asset/pisa.hdr',
                    exposure: 1,
                    diffuseIntensity: 0.2
                }
            },
            viewControl: {
                autoRotate: false
            },
            debug: {
                wireframe: {
                    show: true
                }
            }
        },
        series: []
    };
    myChart.setOption(option);
})();