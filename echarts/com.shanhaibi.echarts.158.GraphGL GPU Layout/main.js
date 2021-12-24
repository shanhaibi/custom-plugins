(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "color",
                default: "rgba(255,255,255,0.8)"
            },
            {
                name: "line-width",
                alias: "线条宽度(px)",
                type: "number",
                default: 3
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    function createNodes(widthCount, heightCount) {
        var nodes = [];
        for (var i = 0; i < widthCount; i++) {
            for (var j = 0; j < heightCount; j++) {
                nodes.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    value: 1
                });
            }
        }
        return nodes;
    }
    function createEdges(widthCount, heightCount) {
        var edges = [];
        for (var i = 0; i < widthCount; i++) {
            for (var j = 0; j < heightCount; j++) {
                if (i < widthCount - 1) {
                    edges.push({
                        source: i + j * widthCount,
                        target: i + 1 + j * widthCount,
                        value: 1
                    });
                }
                if (j < heightCount - 1) {
                    edges.push({
                        source: i + j * widthCount,
                        target: i + (j + 1) * widthCount,
                        value: 1
                    });
                }
            }
        }
        return edges;
    }
    var nodes = createNodes(50, 50);
    var edges = createEdges(50, 50);
    let option = {
        series: [
            {
                type: 'graphGL',
                nodes: nodes,
                edges: edges,
                
                lineStyle: {
                    color: await ShanhaiBI.getSetting("shape-color"),
                    width: await ShanhaiBI.getSetting("line-width")
                },
                forceAtlas2: {
                    steps: 5,
                    jitterTolerence: 10,
                    edgeWeightInfluence: 4
                }
            }
        ]
    };
    myChart.setOption(option);
})();