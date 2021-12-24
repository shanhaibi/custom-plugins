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
                cluster: { title: "散点设置" }
            },
            {
                name: "shape-opacity",
                alias: "图形透明度",
                type: "number",
                default: 1,
                cluster: { title: "散点设置" }
            },
            {
                name: "line-color",
                alias: "线条颜色",
                type: "color",
                default: "#fff",
                cluster: { title: "线段设置" }
            },
            {
                name: "line-opacity",
                alias: "线条透明度",
                type: "number",
                default: 0.05,
                cluster: { title: "线段设置" }
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let shape_opacity = await ShanhaiBI.getSetting("shape-opacity");
    let line_color = await ShanhaiBI.getSetting("line-color");
    let line_opacity = await ShanhaiBI.getSetting("line-opacity");
    $.getJSON(ROOT_PATH + '/data-gl/asset/data/npmdep.json', function (data) {
        let nodes = data.nodes.map(function (nodeName, idx) {
            return {
                name: nodeName,
                value: data.dependentsCount[idx]
            };
        });
        let edges = [];
        for (let i = 0; i < data.edges.length;) {
            let s = data.edges[i++];
            let t = data.edges[i++];
            edges.push({
                source: s,
                target: t
            });
        }
        nodes.forEach(function (node) {
            // if (node.value > 100) {
            node.emphasis = {
                label: {
                    show: true
                }
            };
            // }
            if (node.value > 5000) {
                node.label = {
                    show: true
                };
            }
        });
        let option = {
            series: [
                {
                    color: shape_color,
                    type: 'graphGL',
                    nodes: nodes,
                    edges: edges,
                    modularity: {
                        resolution: 2,
                        sort: true
                    },
                    lineStyle: {
                        color: line_color,
                        opacity: line_opacity
                    },
                    itemStyle: {
                        opacity: shape_opacity
                        // borderColor: '#fff',
                        // borderWidth: 1
                    },
                    focusNodeAdjacency: false,
                    focusNodeAdjacencyOn: 'click',
                    symbolSize: function (value) {
                        return Math.sqrt(value / 10);
                    },
                    label: {
                        color: '#fff'
                    },
                    emphasis: {
                        label: {
                            show: false
                        },
                        lineStyle: {
                            opacity: 0.5,
                            width: 4
                        }
                    },
                    forceAtlas2: {
                        steps: 5,
                        stopThreshold: 20,
                        jitterTolerence: 10,
                        edgeWeight: [0.2, 1],
                        gravity: 5,
                        edgeWeightInfluence: 0
                        // preventOverlap: true
                    }
                }
            ]
        };
        myChart.setOption(option);
    });
})();