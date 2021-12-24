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
                name: "light-intensity",
                alias: "光照强度",
                type: "number",
                default: 2
            },
            {
                name: "wireframe",
                alias: "显示线框",
                type: "boolean",
                default: true
            },
            {
                name: "axis",
                alias: "显示坐标系",
                type: "boolean",
                default: true,
            },
            {
                name: "material",
                alias: "选择材质",
                type: "select",
                choices: [
                    {
                        label: "金属",
                        value: "metal"
                    },
                    {
                        label: "非金属",
                        value: "non-metallic"
                    }
                ],
                default: "non-metallic"
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let material = await ShanhaiBI.getSetting("material");
    let { sin, cos, pow, sqrt, cosh, sinh } = Math;
    let aa = 0.4;
    let r = 1 - aa * aa;
    let w = sqrt(r);
    let option = {
        tooltip: {},
        visualMap: {
            show: false,
            dimension: 2,
            min: -3,
            max: 3,
            inRange: {
                color: await ShanhaiBI.getSetting("shape-color")
            }
        },
        xAxis3D: {},
        yAxis3D: {},
        zAxis3D: {},
        grid3D: {
            show: await ShanhaiBI.getSetting("axis"),
            postEffect: {
                enable: true,
                SSAO: {
                    enable: true,
                    radius: 4
                }
            },
            viewControl: {
                distance: 130,
                beta: 50
            },
            light: {
                main: {
                    intensity: await ShanhaiBI.getSetting("light-intensity"),
                    shadow: true
                },
                ambient: {
                    intensity: 0
                },
                ambientCubemap: {
                    texture: ROOT_PATH + '/data-gl/asset/canyon.hdr',
                    exposure: 2,
                    diffuseIntensity: 0.2,
                    specularIntensity: 1
                }
            }
        },
        series: [
            {
                type: 'surface',
                parametric: true,
                wireframe: {
                    show: false
                },
                shading: 'realistic',
                realisticMaterial: {
                    roughness: 0.3,
                    metalness: material === "metal" ? 1 : 0
                },
                wireframe: {
                    show: await ShanhaiBI.getSetting("wireframe")
                },
                parametricEquation: {
                    u: {
                        min: -13.2,
                        max: 13.2,
                        step: 0.2
                    },
                    v: {
                        min: -37.4,
                        max: 37.4,
                        step: 0.2
                    },
                    x: function (u, v) {
                        let denom = aa * (pow(w * cosh(aa * u), 2) + aa * pow(sin(w * v), 2));
                        return -u + (2 * r * cosh(aa * u) * sinh(aa * u)) / denom;
                    },
                    y: function (u, v) {
                        let denom = aa * (pow(w * cosh(aa * u), 2) + aa * pow(sin(w * v), 2));
                        return (
                            (2 *
                                w *
                                cosh(aa * u) *
                                (-(w * cos(v) * cos(w * v)) - sin(v) * sin(w * v))) /
                            denom
                        );
                    },
                    z: function (u, v) {
                        let denom = aa * (pow(w * cosh(aa * u), 2) + aa * pow(sin(w * v), 2));
                        return (
                            (2 *
                                w *
                                cosh(aa * u) *
                                (-(w * sin(v) * cos(w * v)) + cos(v) * sin(w * v))) /
                            denom
                        );
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
})();