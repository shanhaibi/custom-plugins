(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-category",
                alias: "分类字段",
                type: "axis"
            },
            {
                name: "axis-value",
                alias: "取值字段",
                type: "axis"
            },
            {
                name: "axis-end",
                alias: "结束字段",
                type: "axis"
            }
        ],
        "format": [
            {
                name: "line-color",
                alias: "线段颜色",
                type: "color",
                default: "#1890ff"
            },
            {
                name: "line-width",
                alias: "线段宽度",
                type: "number",
                default: 4
            },
            {
                name: "axis-text-color",
                alias: "轴文本颜色",
                type: "color",
                default: "#fff"
            }
        ]
    })

    var dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let rawData = await ShanhaiBI.getData();
    let category_data = rawData.getColumn();
    let value_data = rawData.getColumns("axis-value");
    let axis_end_data = rawData.getColumn("axis-end");
    let value_dims = await ShanhaiBI.getSetting("axis-value");
    let axis_end_dims = await ShanhaiBI.getSetting("axis-end");
    let axis_text_color = await ShanhaiBI.getSetting("axis-text-color");
    let parallel_data = [], useSimple = false, parallel = [];
    let axis_option = {
        nameTextStyle: {
            color: axis_text_color
        },
        axisLabel: {
            color: axis_text_color
        }
    }
    if (!category_data.length || !value_data.length || !axis_end_data.length) {
        useSimple = true;
        value_data = [
            [12.99, 100, 82, "Good"],
            [9.99, 80, 77, "OK"],
            [20, 120, 60, "Excellent"]
        ];
        category_data = ["Price", "Net Weight", "Amount", "score"];
        parallel_data = ['Excellent', 'Good', 'OK', 'Bad'];
    } else {
        parallel_data = axis_end_data;
        for (let i = 0; i < value_data.length; i++) {
            let row = value_data[i];
            for (let idx = 0; idx < row.length; idx++) {
                if (!row[idx] && typeof row[idx] === "undefined") {
                    row.splice(idx, 1);
                }
            }
            value_data[i].push(value_dims[i].alias);
        }
    }
    for (let i = 0; i < category_data.length; i++) {
        let item = {
            dim: i,
            name: category_data[i],
            ...axis_option
        };
        if (i === category_data.length - 1) {
            item.type = "category";
            item.data = parallel_data;
            item.name = useSimple ? category_data[i] : axis_end_dims[0].alias;
        }
        parallel.push(item);
    }

    let option = {
        parallelAxis: parallel,
        series: {
            type: 'parallel',
            lineStyle: {
                width: await ShanhaiBI.getSetting("line-width"),
                color: await ShanhaiBI.getSetting("line-color")
            },
            data: value_data
        }
    };
    myChart.setOption(option);
})();