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
                group: "series-color",
                type: "palette",
                default: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570'],
            },
            {
                name: "funnel-direction",
                alias: "朝向",
                default: "bottom",
                type: "select",
                choices: [
                    {
                        label: "朝下",
                        value: "bottom"
                    },
                    {
                        label: "朝上",
                        value: "top"
                    }
                ],
                group: "series-shape",
            },
            {
                name: "funnel-gap",
                alias: "间距(px)",
                type: "number",
                default: 1,
                group: "series-shape"
            },
            {
                name: "title",
                alias: "标题设置",
                type: "boolean",
                default: "true",
                group: "plugin_title"
            },
            {
                name: "title-text",
                alias: "标题文本",
                type: "string",
                default: "Funnel",
                group: "plugin_title"
            },
            {
                name: "title-size",
                alias: "字体大小",
                type: "number",
                default: 12,
                group: "plugin_title"
            },
            {
                name: "title-color",
                alias: "文本颜色",
                type: "color",
                default: "#ff0000",
                group: "plugin_title"
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
    let funnel_direction = await ShanhaiBI.getSetting("funnel-direction") === "top" ? "ascending" : "descending";
    let data = await ShanhaiBI.getData();
    let category_axis = data.getColumn("axis-category");
    let value_axis = data.getColumn("axis-value");
    let data_option = [
        { value: 60, name: 'Visit' },
        { value: 40, name: 'Inquiry' },
        { value: 20, name: 'Order' },
        { value: 80, name: 'Click' },
        { value: 100, name: 'Show' }
    ]
    if(category_axis.length && value_axis.length) {
        data_option = [];
        let total = value_axis.reduce((prev, curr) => prev + curr);
        for(let i = 0; i < value_axis.length; i++) {
            data_option.push({name: category_axis[i], value: value_axis[i] * 100 / total});
        }

    } 

    let option = {
        color: await ShanhaiBI.getSetting("palette"),
        title: {
            text: await ShanhaiBI.getSetting("title-text"),
            show: await ShanhaiBI.getSetting("title"),
            textStyle: {
                color: await ShanhaiBI.getSetting("title-color"),
                fontSize: await ShanhaiBI.getSetting("title-size"),
            },
        },
        tooltip: {
            show: await ShanhaiBI.getSetting("tooltip"),
            trigger: 'item',
            formatter: '{b} : {c}%'
        },
        legend: {
            type: "scroll",
            textStyle: {
                color: "#aaa"
            }
        },
        series: [
            {
                name: 'Funnel',
                type: 'funnel',
                left: '10%',
                top: 60,
                bottom: 60,
                width: '80%',
                min: 0,
                max: 100,
                minSize: '0%',
                maxSize: '100%',
                sort: funnel_direction,
                gap: await ShanhaiBI.getSetting("funnel-gap"),
                label: {
                    show: true,
                    position: 'inside'
                },
                labelLine: {
                    length: 10,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1
                },
                emphasis: {
                    label: {
                        fontSize: 20
                    }
                },
                data: data_option
            }
        ]
    };
    myChart.setOption(option);
})();