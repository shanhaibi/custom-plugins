(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "light-intensity",
                alias: "光照强度",
                type: "number",
                default: 5
            },
            {
                name: "environment",
                alias: "环境贴图",
                type: "file",
            },
            {
                name: "nebula-height",
                alias: "星云高度(px)",
                type: "number",
                default: 20
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let img = new Image();
    img.src = ROOT_PATH + '/data-gl/asset/sample.jpg';
    img.crossOrigin = 'Anonymous';
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    img.onload = async function () {
        let width = (canvas.width = img.width);
        let height = (canvas.height = img.height);
        ctx.drawImage(img, 0, 0, width, height);
        let imgData = ctx.getImageData(0, 0, width, height);
        let data = new Float32Array((imgData.data.length / 4) * 3);
        let off = 0;
        let environment = await ShanhaiBI.getSetting("environment");
        environment = environment ? environment.replace("\\", "/") : ROOT_PATH + '/data-gl/asset/starfield.jpg';
        for (let i = 0; i < imgData.data.length / 4; i++) {
            let r = imgData.data[i * 4];
            let g = imgData.data[i * 4 + 1];
            let b = imgData.data[i * 4 + 2];
            let lum = 0.2125 * r + 0.7154 * g + 0.0721 * b;
            lum = (lum - 125) / 4 + 50;
            data[off++] = i % width;
            data[off++] = height - Math.floor(i / width);
            data[off++] = lum;
        }
        let option = {
            tooltip: {},
            backgroundColor: '#fff',
            xAxis3D: {
                type: 'value'
            },
            yAxis3D: {
                type: 'value'
            },
            zAxis3D: {
                type: 'value',
                min: 0,
                max: 100
            },
            grid3D: {
                show: false,
                viewControl: {
                    alpha: 70,
                    beta: 0
                },
                postEffect: {
                    enable: true,
                    depthOfField: {
                        enable: true,
                        blurRadius: 4,
                        fstop: 10
                    }
                    // SSAO: {
                    //     enable: true
                    // }
                },
                boxDepth: 100,
                boxHeight: await ShanhaiBI.getSetting("nebula-height"),
                environment: environment,
                light: {
                    main: {
                        shadow: true,
                        intensity: await ShanhaiBI.getSetting("light-intensity")
                    },
                    ambientCubemap: {
                        texture: ROOT_PATH + '/data-gl/asset/canyon.hdr',
                        exposure: 2,
                        diffuseIntensity: 0.2
                    }
                }
            },
            series: [
                {
                    type: 'bar3D',
                    shading: 'lambert',
                    barSize: 0.8,
                    silent: true,
                    dimensions: ['x', 'y', 'z'],
                    itemStyle: {
                        color: function (params) {
                            let i = params.dataIndex;
                            let r = imgData.data[i * 4] / 255;
                            let g = imgData.data[i * 4 + 1] / 255;
                            let b = imgData.data[i * 4 + 2] / 255;
                            let lum = 0.2125 * r + 0.7154 * g + 0.0721 * b;
                            r *= lum * 2;
                            g *= lum * 2;
                            b *= lum * 2;
                            return [r, g, b, 1];
                        }
                    },
                    data: data
                }
            ]
        }
        myChart.setOption(option);
    };
})();