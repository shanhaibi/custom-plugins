(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "animation-duration",
                alias: "动画持续时间(s)",
                type: "number",
                default: 1.5
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
    let line_type = await ShanhaiBI.getSetting("line-type");
    let animation_duration = (await ShanhaiBI.getSetting("animation-duration")) * 1000;

    myChart.showLoading();
    $.getJSON(ROOT_PATH + '/data/asset/data/les-miserables.json', function (graph) {
        myChart.hideLoading();
        graph.nodes.forEach(function (node) {
            node.label = {
                show: node.symbolSize > 30
            };
        });
        option = {
            color: shape_color,
            title: {
                text: 'Les Miserables',
                subtext: 'Default layout',
                top: 'bottom',
                left: 'right'
            },
            tooltip: {},
            legend: [
                {
                    data: graph.categories.map(function (a) {
                        return a.name;
                    })
                }
            ],
            animationDuration: animation_duration,
            animationEasingUpdate: 'quinticInOut',
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
                        position: 'right',
                        formatter: '{b}',
                        color: "#fff"
                    },
                    lineStyle: {
                        type: line_type,
                        color: 'source',
                        curveness: 0.3
                    },
                    emphasis: {
                        focus: 'adjacency',
                        lineStyle: {
                            width: 10,
                            type: "solid"
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
    });
})();