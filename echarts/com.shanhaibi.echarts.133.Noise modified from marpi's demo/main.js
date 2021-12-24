(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ["#000", "#300", "#fff"]
            },
            {
                name: "material-roughness",
                alias: "材质粗糙度",
                type: "number",
                default: 0.5  
            },
            {
                name: "light-intensity",
                alias: "光照强度",
                type: "number",
                default: 1
            },
            {
                name: "max-distance",
                alias: "视角最远距离",
                type: "number",
                default: 150
            },
            {
                name: "min-distance",
                alias: "视角最近距离",
                type: "number",
                default: 50
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let material_roughness = await ShanhaiBI.getSetting("material-roughness");
    let simplex = new SimplexNoise();
    window.onresize = myChart.resize;
    let UPDATE_DURATION = 1000;
    let focalRange = 40;
    let blurRadius = 4;
    
    let option = {
        toolbox: {
            left: 20,
            iconStyle: {
                normal: {
                    borderColor: '#fff'
                }
            }
        },
        tooltip: {},
        visualMap: {
            show: false,
            min: 0.1,
            max: 2.5,
            inRange: {
                color: shape_color
            }
        },
        xAxis3D: {
            type: 'value'
        },
        yAxis3D: {
            type: 'value'
        },
        zAxis3D: {
            type: 'value',
            min: -6,
            max: 6
        },
        grid3D: {
            show: false,
            environment: '#000',
            viewControl: {
                distance: 100,
                maxDistance: await ShanhaiBI.getSetting("max-distance"),
                minDistance: await ShanhaiBI.getSetting("min-distance"),
                alpha: 38,
                beta: 220,
                minAlpha: 10
                //maxBeta: 360,
            },
            postEffect: {
                enable: true,
                SSAO: {
                    enable: true,
                    intensity: 1.3,
                    radius: 5
                },
                screenSpaceReflection: {
                    enable: false
                },
                depthOfField: {
                    enable: true,
                    blurRadius: blurRadius,
                    focalRange: focalRange,
                    focalDistance: 70
                }
            },
            light: {
                main: {
                    intensity: await ShanhaiBI.getSetting("light-intensity"),
                    shadow: true,
                    shadowQuality: 'high',
                    alpha: 30
                },
                ambient: {
                    intensity: 0
                },
                ambientCubemap: {
                    texture: ROOT_PATH + '/data-gl/asset/pisa.hdr',
                    exposure: 2,
                    diffuseIntensity: 1,
                    specularIntensity: 1
                }
            }
        },
        series: [
            {
                type: 'bar3D',
                silent: true,
                shading: 'realistic',
                realisticMaterial: {
                    roughness: 0.5,
                    metalness: 0
                },
                instancing: true,
                barSize: 0.6,
                data: [],
                lineStyle: {
                    width: 4
                },
                itemStyle: {
                    color: '#fff'
                },
                animation: false,
                animationDurationUpdate: UPDATE_DURATION
            }
        ]
    };
    myChart.setOption(option);
    setTimeout(function () {
        initVisualizer();
    });
    function initVisualizer() {
        let config = {
            numWaves: 2,
            randomize: randomize,
            size: 150,
            roughness: material_roughness,
            metalness: 0
        };
        //gui.add(config, "numWaves", 1, 3).name("Waves number").onChange(update).listen();
        for (let i = 0; i < 2; i++) {
            config['wave' + i + 'axis' + 'x'] = Math.random();
            config['wave' + i + 'axis' + 'y'] = Math.random();
            config['wave' + i + 'rounding'] = Math.random();
            config['wave' + i + 'square'] = Math.random();
        }
        function randomize() {
            //config.numWaves = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < 2; i++) {
                config['wave' + i + 'axis' + 'x'] = Math.random();
                config['wave' + i + 'axis' + 'y'] = Math.random();
                config['wave' + i + 'rounding'] = Math.random();
                config['wave' + i + 'square'] = Math.random();
            }
            // Iterate over all controllers
            for (let i in gui.__controllers) {
                gui.__controllers[i].updateDisplay();
            }
            update();
        }
        function update() {
            let item = [];
            let dataProvider = [];
            let mod = 0.1;
            //config.numWaves = Math.round(config.numWaves)
            //let occurenceR = Math.random() * .02
            //let r = 0//Math.random()
            for (let s = 0; s < config.size * config.size; s++) {
                let x = s % config.size;
                let y = Math.floor(s / config.size);
                //if (Math.random() < occurenceR)
                //    r = Math.random()
                let output = 0;
                for (let i = 0; i < config.numWaves; i++) {
                    let n = simplex.noise2D(
                        i * 213 +
                        (-50 + x) * mod * (1 - config['wave' + i + 'axis' + 'x']) * 0.5,
                        i * 3124 +
                        (-50 + y) * mod * (1 - config['wave' + i + 'axis' + 'y']) * 0.5
                    );
                    n = Math.pow(n, 1.95 - 1.9 * config['wave' + i + 'rounding']);
                    let square = Math.floor((1.1 - config['wave' + i + 'square']) * 100);
                    n = Math.round(n * square) / square;
                    //output*=n
                    if (output < n) output = n;
                }
                dataProvider.push([x, y, (output + 0.1) * 2]);
            }
            myChart.setOption({
                visualMap: {
                    inRange: {
                        barSize: 100 / config.size,
                        color: shape_color
                    }
                },
                series: [
                    {
                        data: dataProvider,
                        realisticMaterial: {
                            roughness: config.roughness,
                            metalness: config.metalness
                        }
                    }
                ]
            });
            //setTimeout(update, UPDATE_DURATION);
        }
        update();
    }
})();