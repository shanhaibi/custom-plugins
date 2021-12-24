(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: [
                    'rgb(203,239,15)', 'rgb(73,15,239)', 'rgb(239,231,15)', 'rgb(15,217,239)', 'rgb(30,15,239)', 'rgb(15,174,239)', 'rgb(116,239,15)', 'rgb(239,15,58)',
                    'rgb(15,239,174)', 'rgb(239,102,15)', 'rgb(239,15,15)', 'rgb(15,44,239)', 'rgb(239,145,15)', 'rgb(30,239,15)', 'rgb(239,188,15)', 'rgb(159,239,15)',
                    'rgb(159,15,239)', 'rgb(15,239,44)', 'rgb(15,239,87)', 'rgb(15,239,217)', 'rgb(203,15,239)', 'rgb(239,15,188)', 'rgb(239,15,102)', 'rgb(239,58,15)',
                    'rgb(239,15,145)', 'rgb(116,15,239)', 'rgb(15,131,239)', 'rgb(73,239,15)', 'rgb(15,239,131)', 'rgb(15,87,239)', 'rgb(239,15,231)'
                ],
                cluster: {title: "散点设置"}
            },
            {
                name: "shape-opacity",
                alias: "图形透明度",
                type: "number",
                default: 1,
                cluster: {title: "散点设置"}
            },
            {
                name: "line-color",
                alias: "线条颜色",
                type: "color",
                default: "rgba(255,255,255,0.2)"
            },
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let shape_opacity = await ShanhaiBI.getSetting("shape-opacity");
    let line_color = await ShanhaiBI.getSetting("line-color");
    $.getJSON(ROOT_PATH + '/data-gl/asset/data/internet.graph.json', function (graph) {
        let edges = graph.edges.map(function (edge) {
            return {
                source: edge[0],
                target: edge[1],
                value: 2
            };
        });
        let categories = [];
        let categoriesMap = {};
        let nodes = graph.nodes.map(function (node) {
            if (!categoriesMap[node[3]]) {
                categories.push({
                    name: node[3]
                });
                categoriesMap[node[3]] = true;
            }
            return {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                // x: node[0],
                // y: node[1],
                symbolSize: node[2],
                category: node[3],
                value: 1
            };
        });
        let option = {
            color: shape_color,
            series: [
                {
                    type: 'graphGL',
                    nodes: nodes,
                    edges: edges,
                    categories: categories.sort(function (a, b) {
                        return a.name - b.name;
                    }),
                    lineStyle: {
                        color: line_color
                    },
                    itemStyle: {
                        opacity: shape_opacity
                    },
                    forceAtlas2: {
                        steps: 1,
                        stopThreshold: 1,
                        jitterTolerence: 10,
                        edgeWeight: [0.2, 1],
                        gravity: 0,
                        edgeWeightInfluence: 1,
                        scaling: 0.2
                    }
                }
            ]
        };
        myChart.setOption(option);
    });
})();