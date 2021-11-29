(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "tooltip",
                alias: "提示信息",
                type: "boolean",
                default: true
            },
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ["#5873c6", "#99cc75", "#f5c657", "#e46266", "#7fc1de", "#4fa272", "#f28051", "#9561b4", "#e17bcc", "#5873c6", "#a8e080", "#f5c657", "#e46266", "#7fc1de", "#4fa272", "#f28051"]
            },
            {
                name: "line-type",
                alias: "线段类型",
                type: "select",
                choices: [
                    {
                        label: "实线",
                        value: "solid"
                    },
                    {
                        label: "虚线",
                        value: "dashed"
                    },
                    {
                        label: "点线",
                        value: "dotted"
                    }
                ],
                default: "solid"
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let tooltip_display = await ShanhaiBI.getSetting("tooltip");
    let line_type = await ShanhaiBI.getSetting("line-type");

    myChart.showLoading();
    $.getJSON(ROOT_PATH + '/data/asset/data/les-miserables.json', function (graph) {
        myChart.hideLoading();
        let option = {
            color: shape_color,
            tooltip: {show: tooltip_display},
            legend: [
                {
                    data: graph.categories.map(function (a) {
                        return a.name;
                    })
                }
            ],
            series: [
                {
                    name: 'Les Miserables',
                    type: 'graph',
                    layout: 'none',
                    data: graph.nodes,
                    links: graph.links,
                    categories: graph.categories,
                    roam: true,
                    label: {
                        show: true,
                        color: "#fff",
                        position: 'right',
                        formatter: '{b}'
                    },
                    labelLayout: {
                        hideOverlap: true
                    },
                    scaleLimit: {
                        min: 0.4,
                        max: 2
                    },
                    lineStyle: {
                        color: 'source',
                        type: line_type,
                        curveness: 0.3
                    }
                }
            ]
        };
        myChart.setOption(option);
    });
})();