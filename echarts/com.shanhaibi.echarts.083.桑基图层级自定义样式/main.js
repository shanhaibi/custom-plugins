(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
            },
            {
                name: "font-color",
                alias: "字体颜色",
                type: "color",
                default: "#fff"
            },
            {
                name: "font-size",
                alias: "字体大小",
                type: "number",
                default: 10
            },
            {
                name: "curveness",
                alias: "图边曲度",
                type: "number",
                default: 0.5
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    var dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let font_size = await ShanhaiBI.getSetting("font-size");
    let font_color = await ShanhaiBI.getSetting("font-color");
    let default_color = ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4"];
    let curveness = await ShanhaiBI.getSetting("curveness");
    shape_color = shape_color.length ? shape_color : default_color;

    myChart.showLoading();
    $.get(ROOT_PATH + '/data/asset/data/product.json', function (data) {
        myChart.hideLoading();
        let option = {
            title: {
                text: 'Sankey Diagram'
            },
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: [
                {
                    type: 'sankey',
                    data: data.nodes,
                    links: data.links,
                    emphasis: {
                        focus: 'adjacency'
                    },
                    levels: [
                        {
                            depth: 0,
                            itemStyle: {
                                color: shape_color[0] ? shape_color[0] : shape_color[shape_color.length - 1]
                            },
                            lineStyle: {
                                color: 'source',
                                opacity: 0.6
                            }
                        },
                        {
                            depth: 1,
                            itemStyle: {
                                color: shape_color[1] ? shape_color[1] : shape_color[shape_color.length - 1]
                            },
                            lineStyle: {
                                color: 'source',
                                opacity: 0.6
                            }
                        },
                        {
                            depth: 2,
                            itemStyle: {
                                color: shape_color[2] ? shape_color[2] : shape_color[shape_color.length - 1]
                            },
                            lineStyle: {
                                color: 'source',
                                opacity: 0.6
                            }
                        },
                        {
                            depth: 3,
                            itemStyle: {
                                color: shape_color[3] ? shape_color[3] : shape_color[shape_color.length - 1]
                            },
                            lineStyle: {
                                color: 'source',
                                opacity: 0.6
                            }
                        }
                    ],
                    label: {
                        color: font_color,
                        fontSize: font_size
                    },
                    lineStyle: {
                        curveness: curveness
                    }
                }
            ]
        }
        myChart.setOption(option);
    });
})();