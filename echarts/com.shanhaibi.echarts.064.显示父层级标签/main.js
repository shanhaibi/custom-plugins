(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "display-upper-label",
                alias: "显示父级标签",
                type: "boolean",
                default: true
            },
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

        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let visible_min = await ShanhaiBI.getSetting("visible-min");
    let display_upper_label = await ShanhaiBI.getSetting("display-upper-label");

    myChart.showLoading();
    $.get(ROOT_PATH + '/data/asset/data/disk.tree.json', function (diskData) {
        myChart.hideLoading();
        let option = {
            color: shape_color,
            title: {
                text: 'Disk Usage',
                left: 'center'
            },
            tooltip: {
                formatter: function (info) {
                    var value = info.value;
                    var treePathInfo = info.treePathInfo;
                    var treePath = [];
                    for (var i = 1; i < treePathInfo.length; i++) {
                        treePath.push(treePathInfo[i].name);
                    }
                    return [
                        '<div class="tooltip-title">' +
                        echarts.format.encodeHTML(treePath.join('/')) +
                        '</div>',
                        'Disk Usage: ' + echarts.format.addCommas(value) + ' KB'
                    ].join('');
                }
            },
            series: [
                {
                    name: 'Disk Usage',
                    type: 'treemap',
                    visibleMin: visible_min,
                    label: {
                        show: true,
                        formatter: '{b}'
                    },
                    upperLabel: {
                        show: display_upper_label,
                        color: "#fff",
                        height: 30
                    },
                    itemStyle: {
                        borderColor: '#fff'
                    },
                    levels: getLevelOption(),
                    data: diskData
                }
            ]
        }
        myChart.setOption(option);
    });

    function getLevelOption() {
        return [
            {
                itemStyle: {
                    borderColor: '#777',
                    borderWidth: 0,
                    gapWidth: 1
                },
                upperLabel: {
                    show: false
                }
            },
            {
                itemStyle: {
                    borderColor: '#555',
                    borderWidth: 5,
                    gapWidth: 1
                },
                emphasis: {
                    itemStyle: {
                        borderColor: '#ddd'
                    }
                }
            },
            {
                colorSaturation: [0.35, 0.5],
                itemStyle: {
                    borderWidth: 5,
                    gapWidth: 1,
                    borderColorSaturation: 0.6
                }
            }
        ];
    }
})()