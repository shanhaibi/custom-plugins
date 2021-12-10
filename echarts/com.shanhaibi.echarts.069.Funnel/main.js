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
                default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
            },
            {
                name: "legend-orient",
                alias: "图例布局方式",
                type: "select",
                choices: [
                    {
                        label: "垂直",
                        value: "vertical"
                    },
                    {
                        label: "水平",
                        value: "horizontal"
                    }
                ],
                default: "vertical"
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
    let value_axis = data.getColumn("axis-value");
    let series_data = [
        { value: 60, name: 'Visit' },
        { value: 40, name: 'Inquiry' },
        { value: 20, name: 'Order' },
        { value: 80, name: 'Click' },
        { value: 100, name: 'Show' }
    ]
    let legend_data = ['Show', 'Click', 'Visit', 'Inquiry', 'Order'];
    if (category_axis.length && value_axis.length) {
        series_data = [];
        for (let i = 0; i < category_axis.length; i++) {
            series_data.push({ name: category_axis[i], value: value_axis[i] });
        }
        legend_data = category_axis;
    }

    let option = {
        color: await ShanhaiBI.getSetting("palette"),
        title: {
            text: 'Funnel',
            left: 'left',
            top: 'bottom'
        },
        tooltip: {
            show: await ShanhaiBI.getSetting("tooltip"),
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}%',
        },
        legend: {
            orient: await ShanhaiBI.getSetting("legend-orient"),
            left: 'left',
            textStyle: {
                color: "#aaa",
            },
            data: legend_data
        },
        series: [
            {
                name: 'Funnel',
                type: 'funnel',
                width: '40%',
                height: '45%',
                left: '5%',
                top: '50%',
                label: {
                    textBorderColor: "transparent",
                    fontWeight: "bold"
                },
                data: series_data
            },
            {
                name: 'Pyramid',
                type: 'funnel',
                width: '40%',
                height: '45%',
                left: '5%',
                top: '5%',
                sort: 'ascending',
                label: {
                    textBorderColor: "transparent",
                    fontWeight: "bold"
                },
                data: series_data
            },
            {
                name: 'Funnel',
                type: 'funnel',
                width: '40%',
                height: '45%',
                left: '55%',
                top: '5%',
                label: {
                    position: 'left',
                    textBorderColor: "transparent",
                    fontWeight: "bold"
                },
                data: series_data
            },
            {
                name: 'Pyramid',
                type: 'funnel',
                width: '40%',
                height: '45%',
                left: '55%',
                top: '50%',
                sort: 'ascending',
                label: {
                    position: 'left',
                    textBorderColor: "transparent",
                    fontWeight: "bold"
                },
                data: series_data
            }
        ]
    };
    myChart.setOption(option);
})();