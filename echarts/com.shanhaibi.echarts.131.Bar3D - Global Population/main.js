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
                default: 5
            },
            {
                name: "shadow",
                alias: "显示阴影",
                type: "boolean",
                default: true
            },
            {
                name: "ground",
                alias: "显示地面",
                type: "boolean",
                default: true
            },
            {
                name: "ground-color",
                alias: "地面颜色",
                type: "color",
                default: "#999"
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let light_intensity = await ShanhaiBI.getSetting("light-intensity");
    let shadow_display = await ShanhaiBI.getSetting("shadow");
    let ground_display = await ShanhaiBI.getSetting("ground");
    let ground_color = await ShanhaiBI.getSetting("ground-color");
    $.getJSON(ROOT_PATH + '/data-gl/asset/data/population.json', function (data) {
        data = data
            .filter(function (dataItem) {
                return dataItem[2] > 0;
            })
            .map(function (dataItem) {
                return [dataItem[0], dataItem[1], Math.sqrt(dataItem[2])];
            });
        let option = {
            backgroundColor: '#cdcfd5',
            geo3D: {
                map: 'world',
                shading: 'lambert',
                light: {
                    main: {
                        intensity: light_intensity,
                        shadow: shadow_display,
                        shadowQuality: 'high',
                        alpha: 30
                    },
                    ambient: {
                        intensity: 0
                    },
                    ambientCubemap: {
                        texture: ROOT_PATH + '/data-gl/asset/canyon.hdr',
                        exposure: 1,
                        diffuseIntensity: 0.5
                    }
                },
                viewControl: {
                    distance: 50,
                    panMouseButton: 'left',
                    rotateMouseButton: 'right'
                },
                groundPlane: {
                    show: ground_display,
                    color: ground_color
                },
                postEffect: {
                    enable: true,
                    bloom: {
                        enable: false
                    },
                    SSAO: {
                        radius: 1,
                        intensity: 1,
                        enable: true
                    },
                    depthOfField: {
                        enable: false,
                        focalRange: 10,
                        blurRadius: 10,
                        fstop: 1
                    }
                },
                temporalSuperSampling: {
                    enable: true
                },
                itemStyle: {},
                regionHeight: 2
            },
            visualMap: {
                max: 40,
                calculable: true,
                realtime: false,
                inRange: {
                    color: shape_color
                },
                outOfRange: {
                    colorAlpha: 0
                }
            },
            series: [
                {
                    type: 'bar3D',
                    coordinateSystem: 'geo3D',
                    shading: 'lambert',
                    data: data,
                    barSize: 0.1,
                    minHeight: 0.2,
                    silent: true,
                    itemStyle: {
                        color: 'orange'
                        // opacity: 0.8
                    }
                }
            ]
        };
        myChart.setOption(option);
    });
})();