(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-source",
                alias: "起点字段",
                type: "axis"
            },
            {
                name: "axis-target",
                alias: "目的字段",
                type: "axis"
            },
            {
                name: "axis-value",
                alias: "取值字段",
                type: "axis"
            }
        ],
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
            }
        ]
    })

    var dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let rawData = await ShanhaiBI.getData();
    let source_data = rawData.getColumn("axis-source");
    let target_data = rawData.getColumn("axis-target");
    let value_data = rawData.getColumn("axis-value");
    let data = [], links = [];
    let all_data = [...new Set([...source_data, ...target_data])];
    if (source_data.length && target_data.length && value_data.length) {
        for (let i = 0; i < source_data.length; i++) {
            links.push({
                source: source_data[i],
                target: target_data[i],
                value: value_data[i]
            })
        }
    } else {
        all_data = ["a", "b", "a1", "a2", "b1", "c"];
        links = [
            { source: 'a', target: 'a1', value: 5 },
            { source: 'a', target: 'a2', value: 3 },
            { source: 'b', target: 'b1', value: 8 },
            { source: 'a', target: 'b1', value: 3 },
            { source: 'b1', target: 'a1', value: 1 },
            { source: 'b1', target: 'c', value: 2 }
        ];
    }
    for (let i = 0; i < all_data.length; i++) {
        data.push({ name: all_data[i] });
    }
    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        series: {
            type: 'sankey',
            layout: 'none',
            emphasis: {
                focus: 'adjacency'
            },
            data: data,
            links: links,
            label: {
                color: await ShanhaiBI.getSetting("font-color"),
                fontSize: await ShanhaiBI.getSetting("font-size")
            }
        }
    };
    myChart.setOption(option);
})();