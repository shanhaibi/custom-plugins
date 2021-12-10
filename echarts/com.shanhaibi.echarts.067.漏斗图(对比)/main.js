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
                name: "tooltip",
                alias: "提示信息",
                type: "boolean",
                default: true,
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
        ]
    })

    var dom = document.getElementById("container");
    let myChart = echarts.init(dom);
    
    let data = await ShanhaiBI.getData();
    let category_axis = data.getColumn("axis-category");
    let value_axis = data.getColumn("axis-value");
    let series_data = [
        { value: 60, name: 'Prod C' },
        { value: 30, name: 'Prod D' },
        { value: 10, name: 'Prod E' },
        { value: 80, name: 'Prod B' },
        { value: 100, name: 'Prod A' }
    ];
    let legend_data = ['Prod A', 'Prod B', 'Prod C', 'Prod D', 'Prod E'];
    if (category_axis.length && value_axis.length) {
        series_data = [];
        for (let i = 0; i < value_axis.length; i++) {
            series_data.push({ name: category_axis[i], value: value_axis[i] });
        }
        legend_data = category_axis;
    }

    let option = {
        color: await ShanhaiBI.getSetting("palette"),
        title: {
            text: 'Funnel Compare',
            subtext: 'Fake Data',
            left: 'left',
            top: 'bottom'
        },
        tooltip: {
            show: await ShanhaiBI.getSetting("tooltip"),
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}%'
        },
        legend: {
            orient: await ShanhaiBI.getSetting("legend-orient"),
            left: 'left',
            textStyle: {
                color: "#aaa"
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
                funnelAlign: 'right',
                data: series_data
            },
            {
                name: 'Pyramid',
                type: 'funnel',
                width: '40%',
                height: '45%',
                left: '5%',
                top: '5%',
                label: {
                    textBorderColor: "transparent",
                    fontWeight: "bold"
                },
                sort: 'ascending',
                funnelAlign: 'right',
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
                    textBorderColor: "transparent",
                    fontWeight: "bold"
                },
                funnelAlign: 'left',
                data: series_data
            },
            {
                name: 'Pyramid',
                type: 'funnel',
                width: '40%',
                height: '45%',
                left: '55%',
                top: '50%',
                label: {
                    textBorderColor: "transparent",
                    fontWeight: "bold"
                },
                sort: 'ascending',
                funnelAlign: 'left',
                data: series_data
            }
        ]
    };
    myChart.setOption(option);
})();