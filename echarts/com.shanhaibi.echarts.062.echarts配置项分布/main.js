(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "visible-min",
                alias: "最小可见面积",
                type: "number",
                default: 300
            },
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
            },
            {
                name: "border-color",
                alias: "边框颜色",
                type: "color",
                default: "#555"
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let visible_min = await ShanhaiBI.getSetting("visible-min");
    let border_color = await ShanhaiBI.getSetting("border-color");

    myChart.showLoading();
    $.get(ROOT_PATH + '/data/asset/data/ec-option-doc-statistics-201604.json', function (rawData) {
        myChart.hideLoading();
        let data = {
            children: []
        };
        convert(rawData, data, '');
        let option = {
            color: shape_color,
            title: {
                text: 'ECharts Options',
                subtext: '2016/04',
                left: 'leafDepth'
            },
            tooltip: {},
            series: [
                {
                    name: 'option',
                    type: 'treemap',
                    visibleMin: visible_min,
                    data: data.children,
                    leafDepth: 2,
                    levels: [
                        {
                            itemStyle: {
                                borderColor: border_color,
                                borderWidth: 4,
                                gapWidth: 4
                            }
                        },
                        {
                            colorSaturation: [0.3, 0.6],
                            itemStyle: {
                                borderColorSaturation: 0.7,
                                gapWidth: 2,
                                borderWidth: 2
                            }
                        },
                        {
                            colorSaturation: [0.3, 0.5],
                            itemStyle: {
                                borderColorSaturation: 0.6,
                                gapWidth: 1
                            }
                        },
                        {
                            colorSaturation: [0.3, 0.5]
                        }
                    ]
                }
            ]
        }
        myChart.setOption(option);
    });

    function convert(source, target, basePath) {
        for (let key in source) {
            let path = basePath ? basePath + '.' + key : key;
            if (!key.match(/^\$/)) {
                target.children = target.children || [];
                const child = {
                    name: path
                };
                target.children.push(child);
                convert(source[key], child, path);
            }
        }
        if (!target.children) {
            target.value = source.$count || 1;
        } else {
            target.children.push({
                name: basePath,
                value: source.$count
            });
        }
    }
})()