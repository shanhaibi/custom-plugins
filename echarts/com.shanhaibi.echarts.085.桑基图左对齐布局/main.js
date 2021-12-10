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
                default: 12
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
    let curveness = await ShanhaiBI.getSetting("curveness");

    myChart.showLoading();
    $.get(ROOT_PATH + '/data/asset/data/energy.json', function (data) {
        myChart.hideLoading();
        let option = {
            color: shape_color,
            title: {
                text: 'Node Align Right'
            },
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: [
                {
                    type: 'sankey',
                    emphasis: {
                        focus: 'adjacency'
                    },
                    nodeAlign: 'left',
                    data: data.nodes,
                    links: data.links,
                    lineStyle: {
                        color: 'source',
                        curveness: curveness
                    },
                    label: {
                        color: font_color,
                        fontSize: font_size
                    }
                }
            ]
        }
        myChart.setOption(option);
    });
})();