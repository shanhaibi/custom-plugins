(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-pie",
                alias: "饼图字段",
                type: "axis"
            },
            {
                name: "axis-donut",
                alias: "环形图字段",
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
                name: "radius",
                alias: "饼图半径(%)",
                type: "number",
                default: 30
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let radius = await ShanhaiBI.getSetting("radius");
    let rawData = await ShanhaiBI.getData();
    let pie_data = rawData.getColumns("axis-pie");
    let donut_data = rawData.getColumn("axis-donut");
    let data, legend_data = [];
    if (pie_data.length && donut_data.length) {
        let donut = [], pie = [];
        let pie_dims = await ShanhaiBI.getSetting("axis-pie");
        let donut_dims = await ShanhaiBI.getSetting("axis-donut");
        for (let i = 0; i < donut_dims.length; i++) {
            donut.push({value: donut_data[i], name: donut_dims[i].alias});
            legend_data.push(donut_dims[i].alias);
        }
        for(let i = 0; i < pie_dims.length; i++) {
            pie.push({value: pie_data[i], name: pie_dims[i].alias});
            legend_data.push(pie_dims[i].alias);
        }
        data = {donut, pie};
    } else {
        legend_data = [ 'Direct', 'Marketing', 'Search Engine', 'Email', 'Union Ads', 'Video Ads', 'Baidu', 'Google', 'Bing', 'Others' ];
        data = {
            pie: [
                { value: 1548, name: 'Search Engine' },
                { value: 775, name: 'Direct' },
                { value: 679, name: 'Marketing', selected: true }
            ],
            donut: [
                { value: 1048, name: 'Baidu' },
                { value: 335, name: 'Direct' },
                { value: 310, name: 'Email' },
                { value: 251, name: 'Google' },
                { value: 234, name: 'Union Ads' },
                { value: 147, name: 'Bing' },
                { value: 135, name: 'Video Ads' },
                { value: 102, name: 'Others' }
            ]
        }
    }

    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            data: legend_data,
            textStyle: {
                color: "#aaa"
            }
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                selectedMode: 'single',
                radius: [0, radius + "%"],
                label: {
                    position: 'inner',
                    fontSize: 14
                },
                labelLine: {
                    show: false
                },
                data: data.pie
            },
            {
                name: 'Access From',
                type: 'pie',
                radius: ['45%', '60%'],
                labelLine: {
                    length: 30
                },
                label: {
                    formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                    backgroundColor: '#F6F8FC',
                    borderColor: '#8C8D8E',
                    borderWidth: 1,
                    borderRadius: 4,
                    rich: {
                        a: {
                            color: '#6E7079',
                            lineHeight: 22,
                            align: 'center'
                        },
                        hr: {
                            borderColor: '#8C8D8E',
                            width: '100%',
                            borderWidth: 1,
                            height: 0
                        },
                        b: {
                            color: '#4C5058',
                            fontSize: 14,
                            fontWeight: 'bold',
                            lineHeight: 33
                        },
                        per: {
                            color: '#fff',
                            backgroundColor: '#4C5058',
                            padding: [3, 4],
                            borderRadius: 4
                        }
                    }
                },
                data: data.donut
            }
        ]
    };
    myChart.setOption(option);
})();