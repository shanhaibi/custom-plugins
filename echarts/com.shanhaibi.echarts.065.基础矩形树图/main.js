(async function () {
    await ShanhaiBI.initSettings({
        "format": [
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

    myChart.showLoading();
    $.get(ROOT_PATH + '/data/asset/data/disk.tree.json', function (diskData) {
        myChart.hideLoading();
        let option = {
            color: shape_color,
            series: [
                {
                    type: 'treemap',
                    visibleMin: visible_min,
                    data: diskData
                }
            ]
        }
        myChart.setOption(option);
    });
})()