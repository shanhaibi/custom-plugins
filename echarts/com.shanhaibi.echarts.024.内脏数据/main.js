(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "selected-color",
                alias: "选中颜色",
                type: "color",
                default: "#dbac00"
            },
            {
                name: "selected-mode",
                alias: "选择模式",
                type: "select",
                choices: [
                    {
                        label: "单选",
                        value: "single"
                    }, 
                    {
                        label: "多选",
                        value: "multiple"
                    }
                ],
                default: "multiple"
            },
        ]
    })
    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let selected_color = await ShanhaiBI.getSetting("selected-color");
    let selected_mode = await ShanhaiBI.getSetting("selected-mode");
    let data = (await ShanhaiBI.getData()).getColumns()[0];
    if(!data) data = [121, 321, 141, 52, 198, 289, 139];

    $.get(ROOT_PATH + '/data/asset/geo/Veins_Medical_Diagram_clip_art.svg', function (svg) {
        echarts.registerMap('organ_diagram', { svg: svg });
        let option = {
            tooltip: {},
            geo: {
                left: 10,
                right: '50%',
                map: 'organ_diagram',
                selectedMode: selected_mode,
                emphasis: {
                    focus: 'self',
                    itemStyle: {
                        color: null
                    },
                    label: {
                        position: 'bottom',
                        distance: 0,
                        textBorderColor: '#fff',
                        textBorderWidth: 2
                    }
                },
                blur: {},
                select: {
                    itemStyle: {
                        color: selected_color
                    },
                    label: {
                        show: false,
                        textBorderColor: '#fff',
                        textBorderWidth: 2
                    }
                }
            },
            grid: {
                left: '60%',
                top: '20%',
                bottom: '20%'
            },
            xAxis: {},
            yAxis: {
                data: [
                    'heart',
                    'large-intestine',
                    'small-intestine',
                    'spleen',
                    'kidney',
                    'lung',
                    'liver',
                ]
            },
            series: [
                {
                    type: 'bar',
                    emphasis: {
                        focus: 'self'
                    },
                    data,
                }
            ]
        };
        myChart.setOption(option);
        myChart.on('mouseover', { seriesIndex: 0 }, function (event) {
            myChart.dispatchAction({
                type: 'highlight',
                geoIndex: 0,
                name: event.name
            });
        });
        myChart.on('mouseout', { seriesIndex: 0 }, function (event) {
            myChart.dispatchAction({
                type: 'downplay',
                geoIndex: 0,
                name: event.name
            });
        });
    });
})();