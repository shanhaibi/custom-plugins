(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-category",
                alias: "分类字段",
                type: "axis",
                multiple: true
            },
            {
                name: "axis-value",
                alias: "取值字段",
                type: "axis",
                multiple: true
            }
        ],
        "format": [
            {
                name: "palette",
                alias: "设置颜色",
                type: "palette",
                default: ['#7fc1de', '#e46266', '#5873c6', '#99cc75', '#f5c657', '#a8e080', '#4fa272', '#f28051'],
            },
            {
                name: "legend-text-color",
                alias: "图例文本颜色",
                type: "color",
                default: "#aaa"
            },
            {
                name: "legend-text-size",
                alias: "图例文字大小(px)",
                type: "number",
                default: 12
            },
            {
                name: "tooltip",
                alias: "提示信息",
                type: "boolean",
                default: true,
            }
        ]
    })

    var dom = document.getElementById("container");
    let myChart = echarts.init(dom);
    
    let data = await ShanhaiBI.getData();
    let category_axis = data.getColumn("axis-category");
    let value_axis = data.getColumns("axis-value");
    let expected_data = [
        { value: 60, name: 'Visit' },
        { value: 40, name: 'Inquiry' },
        { value: 20, name: 'Order' },
        { value: 80, name: 'Click' },
        { value: 100, name: 'Show' }
    ]
    let actual_data = [
        { value: 30, name: 'Visit' },
        { value: 10, name: 'Inquiry' },
        { value: 5, name: 'Order' },
        { value: 50, name: 'Click' },
        { value: 80, name: 'Show' }
    ];
    let legend_data = ['Show', 'Click', 'Visit', 'Inquiry', 'Order'];
    if (category_axis.length && value_axis.length > 1) {
        expected_data = [], actual_data = [];
        for (let i = 0; i < category_axis.length; i++) {
            expected_data.push({ name: category_axis[i], value: data.getColumns("axis-value", 0)[i] });
            actual_data.push({ name: category_axis[i], value: data.getColumns("axis-value", 1)[i] });
        }
        legend_data = category_axis;
    }
    
    let option = {
        color: await ShanhaiBI.getSetting("palette"),
        title: {
            text: 'Funnel'
        },
        tooltip: {
            show: await ShanhaiBI.getSetting("tooltip"),
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}%'
        },
        legend: {
            data: legend_data,
            textStyle: {
                color: await ShanhaiBI.getSetting("legend-text-color"),
                fontSize: await ShanhaiBI.getSetting("legend-text-size")
            }
        },
        series: [
            {
                name: 'Expected',
                type: 'funnel',
                left: '10%',
                width: '75%',
                label: {
                    formatter: '{b}Expected',
                    textBorderColor: "transparent",
                    fontWeight: "bold"
                },
                labelLine: {
                    show: false
                },
                itemStyle: {
                    opacity: 0.7
                },
                emphasis: {
                    label: {
                        position: 'inside',
                        formatter: '{b}Expected: {c}%'
                    }
                },
                data: expected_data
            },
            {
                name: 'Actual',
                type: 'funnel',
                left: '10%',
                width: '75%',
                maxSize: '75%',
                label: {
                    position: 'inside',
                    formatter: '{c}%',
                    color: '#fff'
                },
                itemStyle: {
                    opacity: 0.5,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                emphasis: {
                    label: {
                        position: 'inside',
                        formatter: '{b}Actual: {c}%'
                    }
                },
                data: actual_data,
                // Ensure outer shape will not be over inner shape when hover.
                z: 100
            }
        ]
    };
    myChart.setOption(option);
})();