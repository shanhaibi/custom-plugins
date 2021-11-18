(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-x",
                alias: "x轴字段",
                type: "axis"
            },
            {
                name: "axis-y",
                alias: "y轴字段",
                type: "axis"
            }
        ],
        "format": [
            {
                name: "data-color",
                alias: "数据颜色",
                type: "palette",
                default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
            },
            {
                name: "legend",
                alias: "图例",
                type: "boolean",
                default: true
            },
            {
                name: "radius",
                alias: "半径(%)",
                type: "number",
                default: 75
            }
        ]
    })
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let data = await ShanhaiBI.getData();
    let x_axis_data = data.getColumn("axis-x");
    let y_axis_data = data.getColumns("axis-y");
    let legend_data = ['Allocated Budget', 'Actual Spending'];
    let indicator = [
        { name: 'Sales', max: 6500 },
        { name: 'Administration', max: 16000 },
        { name: 'Information Technology', max: 30000 },
        { name: 'Customer Support', max: 38000 },
        { name: 'Development', max: 52000 },
        { name: 'Marketing', max: 25000 }
    ];
    let series_data = [
        {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: 'Allocated Budget'
        },
        {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: 'Actual Spending'
        }
    ];
    if (x_axis_data.length && y_axis_data.length) {
        let length = x_axis_data.length;
        let y_dimensions = await ShanhaiBI.getSetting("axis-y");
        legend_data = [], indicator = [], series_data = [];
        y_dimensions.forEach((y_dimension, idx) => {
            legend_data.push(y_dimension.alias);
            series_data.push({
                value: y_axis_data[idx],
                name: y_dimension.alias
            })
        });
        for (let i = 0; i < length; i++) {
            let max_val = 0;
            y_axis_data.forEach(y_data => {
                max_val = max_val < y_data[i] ? y_data[i] : max_val;
            })
            indicator.push({
                name: x_axis_data[i],
                max: max_val * (Math.random() * 0.5 + 1)
            })
        }
    }

    let option = {
        color: await ShanhaiBI.getSetting("data-color"),
        title: {
            text: 'Basic Radar Chart'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            data: legend_data,
            show: await ShanhaiBI.getSetting("legend"),
            textStyle: {
                color: "#ccc"
            }
        },
        radar: {
            // shape: 'circle',
            indicator,
            radius: (await ShanhaiBI.getSetting("radius")) + "%"
        },
        series: [
            {
                name: 'Budget vs spending',
                type: 'radar',
                data: series_data
            }
        ]
    };
    myChart.setOption(option);

})();