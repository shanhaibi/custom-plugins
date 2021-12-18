(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "base-color",
                alias: "图形颜色",
                type: "color",
                default: "#000"
            },
            {
                name: "environment",
                alias: "环境贴图",
                type: "file.image",
            },
            {
                name: "flowing-light-color",
                alias: "流光颜色",
                type: "color",
                default: "#c0101a"
            },
            {
                name: "flowing-light-intensity",
                alias: "流光强度",
                type: "number",
                default: 4
            },
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let base_color = await ShanhaiBI.getSetting("base-color");
    let environment = await ShanhaiBI.getSetting("environment");
    environment = environment ? environment.replace("\\", "/") : ROOT_PATH + '/data-gl/asset/starfield.jpg';
    let config = {
        color: await ShanhaiBI.getSetting("flowing-light-color"),
        levels: 1,
        intensity: await ShanhaiBI.getSetting("flowing-light-intensity"),
        threshold: 0.01
    };
    let canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 2048;
    context = canvas.getContext('2d');
    context.lineWidth = 0.5;
    context.strokeStyle = config.color;
    context.fillStyle = config.color;
    context.shadowColor = config.color;
    
    image(ROOT_PATH + '/data-gl/asset/bathymetry_bw_composite_4k.jpg').then(
        function (image) {
            let m = image.height,
                n = image.width,
                values = new Array(n * m),
                contours = d3.contours().size([n, m]).smooth(true),
                projection = d3.geoIdentity().scale(canvas.width / n),
                path = d3.geoPath(projection, context);
            //   StackBlur.R(image, 5);
            for (let j = 0, k = 0; j < m; ++j) {
                for (let i = 0; i < n; ++i, ++k) {
                    values[k] = image.data[k << 2] / 255;
                }
            }
            let opt = {
                image: canvas
            };
            let results = [];
            function update(threshold, levels) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                let thresholds = [];
                for (let i = 0; i < levels; i++) {
                    thresholds.push((threshold + (1 / levels) * i) % 1);
                }
                results = contours.thresholds(thresholds)(values);
                redraw();
            }
            function redraw() {
                results.forEach(function (d, idx) {
                    context.beginPath();
                    path(d);
                    context.globalAlpha = 1;
                    context.stroke();
                    if (idx > (config.levels / 5) * 3) {
                        context.globalAlpha = 0.01;
                        context.fill();
                    }
                });
                opt.onupdate();
            }
            d3.timer(function (t) {
                let threshold = (t % 10000) / 10000;
                update(threshold, 1);
            });
            initCharts(opt);
            update(config.threshold, config.levels);
        }
    );
    function image(url) {
        return new Promise(function (resolve) {
            let image = new Image();
            image.src = url;
            image.crossOrigin = 'Anonymous';
            image.onload = function () {
                let canvas = document.createElement('canvas');
                canvas.width = image.width / 8;
                canvas.height = image.height / 8;
                let context = canvas.getContext('2d');
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                resolve(context.getImageData(0, 0, canvas.width, canvas.height));
            };
        });
    }
    function initCharts(opt) {
        let contourChart = echarts.init(document.createElement('canvas'), null, {
            width: 4096,
            height: 2048
        });
        let img = new echarts.graphic.Image({
            style: {
                image: opt.image,
                x: -1,
                y: -1,
                width: opt.image.width + 2,
                height: opt.image.height + 2
            }
        });
        contourChart.getZr().add(img);
        opt.onupdate = function () {
            img.dirty();
        };
        let option = {
            globe: {
                environment: environment,
                heightTexture:
                    ROOT_PATH + '/data-gl/asset/bathymetry_bw_composite_4k.jpg',
                displacementScale: 0.05,
                displacementQuality: 'high',
                baseColor: base_color,
                shading: 'realistic',
                realisticMaterial: {
                    roughness: 0.2,
                    metalness: 0
                },
                postEffect: {
                    enable: true,
                    depthOfField: {
                        // enable: true
                    }
                },
                light: {
                    ambient: {
                        intensity: 0
                    },
                    main: {
                        intensity: 0.1,
                        shadow: false
                    },
                    ambientCubemap: {
                        texture: ROOT_PATH + '/data-gl/asset/lake.hdr',
                        exposure: 1,
                        diffuseIntensity: 0.5,
                        specularIntensity: 2
                    }
                },
                viewControl: {
                    autoRotate: false
                },
                layers: [
                    {
                        type: 'blend',
                        blendTo: 'emission',
                        texture: contourChart,
                        intensity: config.intensity
                    }
                ]
            }
        }
        myChart.setOption(option);
    }
})();