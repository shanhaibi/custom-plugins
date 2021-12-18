(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "atmosphere",
                alias: "显示大气层",
                type: "boolean",
                default: true
            },
            {
                name: "environment",
                alias: "环境贴图",
                type: "file.image",
            },
            {
                name: "light-intensity",
                alias: "光照强度",
                type: "number",
                default: 1.5
            },
            {
                name: "ambient-intensity",
                alias: "环境光强度",
                type: "number",
                default: 0.1
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
            shading: 'lambert',
            environment: environment,
            atmosphere: {
                show: await ShanhaiBI.getSetting("atmosphere")
            },
            light: {
                ambient: {
                    intensity: await ShanhaiBI.getSetting("ambient-intensity")
                },
                main: {
                    intensity: await ShanhaiBI.getSetting("light-intensity")
                }
            }
        },
        series: []
    };
    myChart.setOption(option);
})();