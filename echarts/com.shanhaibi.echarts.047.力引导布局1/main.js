(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-num",
                alias: "图形数量",
                type: "number",
                default: 16
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

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let line_color = await ShanhaiBI.getSetting("line-color");
    let line_type = await ShanhaiBI.getSetting("line-type");
    let datas = [];
    let shape_num = await ShanhaiBI.getSetting("shape-num");
    for (var i = 0; i < shape_num; i++) {
        datas.push({
            nodes: createNodes(i + 2),
            edges: createEdges(i + 2)
        });
    }


    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        series: datas.map(function (item, idx) {
            return {
                type: 'graph',
                layout: 'force',
                animation: false,
                data: item.nodes,
                left: (idx % 4) * 25 + '%',
                top: Math.floor(idx / 4) * 25 + '%',
                width: '25%',
                height: '25%',
                force: {
                    repulsion: 60,
                    edgeLength: 2
                },
                lineStyle: {
                    type: line_type,
                    color: line_color
                },
                edges: item.edges.map(function (e) {
                    return {
                        source: e[0] + '',
                        target: e[1] + ''
                    };
                }),
               
            };
        })
    };
    myChart.setOption(option);

    function createNodes(count) {
        var nodes = [];
        for (var i = 0; i < count; i++) {
            nodes.push({
                id: i + ''
            });
        }
        return nodes;
    }
    function createEdges(count) {
        var edges = [];
        if (count === 2) {
            return [[0, 1]];
        }
        for (var i = 0; i < count; i++) {
            edges.push([i, (i + 1) % count]);
        }
        return edges;
    }
})();