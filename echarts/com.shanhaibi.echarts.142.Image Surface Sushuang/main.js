(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "image",
                alias: "选择图片",
                type: "file.image",
            },
            {
                name: "axis",
                alias: "显示坐标轴",
                type: "boolean",
                default: true
            },
            {
                name: "light-intensity",
                alias: "光照强度",
                type: "number",
                default: 2
            }
        ]
    })

    let resource_path = './resource';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let image_path = await ShanhaiBI.getSetting("image");
    let axis_display = await ShanhaiBI.getSetting("axis");
    let light_intensity = await ShanhaiBI.getSetting("light-intensity")
    let img = new Image();
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    img.src = image_path ? image_path.replace("\\", "/") : resource_path + "/bathymetry_bw_composite_4k.jpg";
    img.onload = function () {
        let width = (canvas.width = img.width);
        let height = (canvas.height = img.height);
        ctx.drawImage(img, 0, 0, width, height);
        let imgData = ctx.getImageData(0, 0, width, height);
        let data = [];
        for (let i = 0; i < imgData.data.length / 4; i++) {
            let r = imgData.data[i * 4];
            let g = imgData.data[i * 4 + 1];
            let b = imgData.data[i * 4 + 2];
            let lum = 255 - (0.2125 * r + 0.7154 * g + 0.0721 * b);
            lum = (lum - 125) / 10 + 50;
            data.push([i % width, height - Math.floor(i / width), lum]);
        }
        let option = {
            tooltip: {},
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
                show: axis_display,
                axisPointer: {
                    show: false
                },
                viewControl: {
                    distance: 100
                },
                postEffect: {
                    enable: true
                },
                light: {
                    main: {
                        shadow: true,
                        intensity: light_intensity
                    },
                    ambientCubemap: {
                        texture: resource_path + '/canyon.hdr',
                        exposure: 2,
                        diffuseIntensity: 0.2,
                        specularIntensity: 1
                    }
                }
            },
            series: [
                {
                    type: 'surface',
                    silent: true,
                    wireframe: {
                        show: false
                    },
                    itemStyle: {
                        color: function (params) {
                            let i = params.dataIndex;
                            let r = imgData.data[i * 4];
                            let g = imgData.data[i * 4 + 1];
                            let b = imgData.data[i * 4 + 2];
                            return 'rgb(' + [r, g, b].join(',') + ')';
                        }
                    },
                    data: data
                }
            ]
        };
        myChart.setOption(option);
    };
})();