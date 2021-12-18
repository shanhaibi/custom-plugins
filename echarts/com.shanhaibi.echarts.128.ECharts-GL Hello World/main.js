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
                name: "material-roughness",
                alias: "材质粗糙度",
                type: "number",
                default: 0.9
            },
            {
                name: "displacement-scale",
                alias: "地球表面突起程度",
                type: "number",
                default: 0.04
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

    let environment = await ShanhaiBI.getSetting("environment");
    environment = environment ? environment.replace("\\", "/") : ROOT_PATH + '/data-gl/asset/starfield.jpg';
    let option = {
        globe: {
            baseTexture: ROOT_PATH + '/data-gl/asset/world.topo.bathy.200401.jpg',
            heightTexture: ROOT_PATH + '/data-gl/asset/world.topo.bathy.200401.jpg',
            displacementScale: await ShanhaiBI.getSetting("displacement-scale"),
            shading: 'realistic',
            environment: environment,
            realisticMaterial: {
                roughness: await ShanhaiBI.getSetting("material-roughness"),
            },
            postEffect: {
                enable: true
            },
            light: {
                main: {
                    intensity: await ShanhaiBI.getSetting("light-intensity"),
                    shadow: true
                },
                ambientCubemap: {
                    texture: ROOT_PATH + '/data-gl/asset/pisa.hdr',
                    diffuseIntensity: 0.2
                }
            },
            viewControl: {
                autoRotate: await ShanhaiBI.getSetting("auto-rotate")
            },
        }
    };
    myChart.setOption(option);
})();