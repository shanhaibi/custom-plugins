(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "rose-color",
                alias: "玫瑰颜色",
                type: "color",
                default: "#fff"
            },
            {
                name: "ambient-map",
                alias: "环境光贴图",
                type: "file",
            },
            {
                name: "light-intensity",
                alias: "光照强度",
                type: "number",
                default: 3
            },
            {
                name: "wireframe",
                alias: "显示线框",
                type: "boolean",
                default: false
            },
            {
                name: "auto-rotate",
                alias: "是否旋转",
                type: "boolean",
                default: true
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let ambient_map = await ShanhaiBI.getSetting("ambient-map");
    ambient_map = ambient_map ? ambient_map : ROOT_PATH + '/data-gl/asset/canyon.hdr';
    let { sin, cos, exp } = Math;
    let PI = Math.PI;
    let square = function (x) {
        return x * x;
    };
    let mod2 = function (a, b) {
        let c = a % b;
        return c > 0 ? c : c + b;
    };
    let theta1 = -(20 / 9) * PI;
    let theta2 = 15 * PI;
    let option = {
        toolbox: {
            feature: {
                saveAsImage: {
                    backgroundColor: '#111'
                }
            },
            iconStyle: {
                normal: {
                    borderColor: '#fff'
                }
            },
            left: 0
        },
        xAxis3D: {
            type: 'value'
        },
        yAxis3D: {
            type: 'value'
        },
        zAxis3D: {
            type: 'value'
        },
        grid3D: {
            show: false,
            axisPointer: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            postEffect: {
                enable: true,
                SSAO: {
                    enable: true,
                    radius: 10,
                    intensity: 2
                },
                edge: {
                    enable: true
                }
            },
            temporalSuperSampling: {
                enable: true
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
                    texture: ambient_map,
                    exposure: 0,
                    diffuseIntensity: 1,
                    specularIntensity: 0.5
                }
            },
            viewControl: {
                autoRotate: await ShanhaiBI.getSetting("auto-rotate")
            }
        },
        series: [
            {
                type: 'surface',
                parametric: true,
                shading: 'realistic',
                silent: true,
                wireframe: {
                    show: await ShanhaiBI.getSetting("wireframe")
                },
                realisticMaterial: {
                    baseTexture:
                        ROOT_PATH + '/asset/get/s/data-1494250104909-SkZtfeAyZ.jpg',
                    roughness: 0.7,
                    metalness: 0,
                    textureTiling: [200, 20]
                },
                itemStyle: {
                    color: await ShanhaiBI.getSetting("rose-color")
                },
                parametricEquation: getParametricEquation()
            }
        ]
    };
    myChart.setOption(option);

    function getParametricEquation() {
        return {
            u: {
                min: 0,
                max: 1,
                step: 1 / 24
            },
            v: {
                min: theta1,
                max: theta2,
                step: (theta2 - theta1) / 575
            },
            x: function (x1, theta) {
                let phi = (PI / 2) * exp(-theta / (8 * PI));
                let y1 = 1.9565284531299512 * square(x1) * square(1.2768869870150188 * x1 - 1) * sin(phi);
                let X = 1 - square(1.25 * square(1 - mod2(3.6 * theta, 2 * PI) / PI) - 0.25) / 2;
                let r = X * (x1 * sin(phi) + y1 * cos(phi));
                return r * sin(theta);
            },
            y: function (x1, theta) {
                let phi = (PI / 2) * exp(-theta / (8 * PI));
                let y1 = 1.9565284531299512 * square(x1) * square(1.2768869870150188 * x1 - 1) * sin(phi);
                let X = 1 - square(1.25 * square(1 - mod2(3.6 * theta, 2 * PI) / PI) - 0.25) / 2;
                let r = X * (x1 * sin(phi) + y1 * cos(phi));
                return r * cos(theta);
            },
            z: function (x1, theta) {
                let phi = (PI / 2) * exp(-theta / (8 * PI));
                let y1 = 1.9565284531299512 * square(x1) * square(1.2768869870150188 * x1 - 1) * sin(phi);
                let X = 1 - square(1.25 * square(1 - mod2(3.6 * theta, 2 * PI) / PI) - 0.25) / 2;
                return X * (x1 * cos(phi) - y1 * sin(phi));
            }
        };
    }
})();