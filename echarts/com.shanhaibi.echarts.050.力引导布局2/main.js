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
                name: "line-color",
                alias: "线段颜色",
                type: "color",
                default: "#ffffff"
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
    let line_color = await ShanhaiBI.getSetting("line-color");
    let line_type = await ShanhaiBI.getSetting("line-type");

    myChart.showLoading();
    $.get(ROOT_PATH + '/data/asset/data/les-miserables.json', function (graph) {
        myChart.hideLoading();
        graph.nodes.forEach(function (node) {
            node.symbolSize = 5;
        });
        let option = {
            color: shape_color,
            title: {
                text: 'Les Miserables',
                subtext: 'Default layout',
                top: 'bottom',
                left: 'right'
            },
            tooltip: {show: tooltip_display},
            legend: [
                {
                    // selectedMode: 'single',
                    data: graph.categories.map(function (a) {
                        return a.name;
                    }),

                }
            ],
            series: [
                {
                    name: 'Les Miserables',
                    type: 'graph',
                    layout: 'force',
                    data: graph.nodes,
                    links: graph.links,
                    categories: graph.categories,
                    roam: true,
                    label: {
                        position: 'right'
                    },
                    lineStyle: {
                        type: line_type,
                        color: line_color
                    },
                    force: {
                        repulsion: 100
                    }
                }
            ]
        };
        myChart.setOption(option);
    });
})();