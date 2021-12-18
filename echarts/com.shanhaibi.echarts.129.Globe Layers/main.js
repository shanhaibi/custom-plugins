(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "auto-rotate",
                alias: "自动旋转",
                type: "boolean",
                default: true
            },
            {
                name: "environment",
                alias: "环境贴图",
                type: "file.image",
            },
            {
                name: "overlay-clouds-distance",
                alias: "云层悬浮距离(px)",
                type: "number",
                default: 5
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
                default: 1.5
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let environment = await ShanhaiBI.getSetting("environment");
    environment = environment ? environment.replace("\\", "/") : ROOT_PATH + '/data-gl/asset/starfield.jpg';
    let option = {
        globe: {
            baseTexture: ROOT_PATH + '/data-gl/asset/earth.jpg',
            heightTexture: ROOT_PATH + '/data-gl/asset/bathymetry_bw_composite_4k.jpg',
            displacementScale: await ShanhaiBI.getSetting("displacement-scale"),
            shading: 'lambert',
            environment: environment,
            light: {
                main: {
                    intensity: await ShanhaiBI.getSetting("light-intensity"),
                    shadow: true
                },
                ambient: {
                    intensity: 0.1
                },
            },
            layers: [
                {
                    type: 'blend',
                    blendTo: 'emission',
                    texture: ROOT_PATH + '/data-gl/asset/night.jpg'
                },
                {
                    type: 'overlay',
                    texture: ROOT_PATH + '/data-gl/asset/clouds.png',
                    shading: 'lambert',
                    distance: await ShanhaiBI.getSetting("overlay-clouds-distance")
                }
            ],
            viewControl: {
                autoRotate: await ShanhaiBI.getSetting("auto-rotate")
            },
        }
    };
    myChart.setOption(option);
})();