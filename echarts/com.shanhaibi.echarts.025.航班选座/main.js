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
                name: "max-scale-limit",
                alias: "最大缩放限制",
                type: "number",
                default: 2
            },
            {
                name: "min-scale-limit",
                alias: "最小缩放限制",
                type: "number",
                default: 0.5
            }
        ]
    })
    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let selected_color = await ShanhaiBI.getSetting("selected-color");
    let max_scale_limit = await ShanhaiBI.getSetting("max-scale-limit");
    let min_scale_limit = await ShanhaiBI.getSetting("min-scale-limit");
    let data = (await ShanhaiBI.getData()).getColumns()[0];
    if (!data) data = ['26E', '26D', '26C', '25D', '23C', '21A', '20F'];

    $.get(ROOT_PATH + '/data/asset/geo/flight-seats.svg', function (svg) {
        echarts.registerMap('flight-seats', { svg: svg });
        let option = {
            tooltip: {},
            geo: {
                map: 'flight-seats',
                roam: true,
                selectedMode: 'multiple',
                layoutCenter: ['50%', '50%'],
                layoutSize: '95%',
                tooltip: {
                    show: true
                },
                scaleLimit: {
                    min: min_scale_limit,
                    max: max_scale_limit
                },
                itemStyle: {
                    color: '#fff'
                },
                emphasis: {
                    itemStyle: {
                        color: undefined,
                        borderColor: selected_color,
                        borderWidth: 2
                    },
                    label: {
                        show: false
                    }
                },
                select: {
                    itemStyle: {
                        color: selected_color
                    },
                    label: {
                        show: false,
                    }
                },
                regions: makeTakenRegions(data)
            }
        };
        myChart.setOption(option);
        myChart.on('geoselectchanged', function (params) {
            const selectedNames = params.allSelected[0].name.slice();
            // Remove taken seats.
            for (var i = selectedNames.length - 1; i >= 0; i--) {
                if (data.indexOf(selectedNames[i]) >= 0) {
                    selectedNames.splice(i, 1);
                }
            }
            console.log('selected', selectedNames);
        });
    });

    function makeTakenRegions(takenSeatNames) {
        var regions = [];
        for (var i = 0; i < takenSeatNames.length; i++) {
            regions.push({
                name: takenSeatNames[i],
                silent: true,
                itemStyle: {
                    color: '#bf0e08'
                },
                emphasis: {
                    itemStyle: {
                        borderColor: '#aaa',
                        borderWidth: 1
                    }
                },
                select: {
                    itemStyle: {
                        color: '#bf0e08'
                    }
                }
            });
        }
        return regions;
    }
})();