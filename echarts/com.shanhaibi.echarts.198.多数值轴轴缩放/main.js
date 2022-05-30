(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#5470c6', '#91cc75'],
            },
            {
                name: "legend-label-color",
                alias: "文本颜色",
                type: "color",
                default: "#aaa",
                cluster: {title: "图例设置"}
            },
            {
                name: "legend-label-size",
                alias: "字体大小(px)",
                type: "number",
                default: 12,
                cluster: {title: "图例设置"}
            },
            {
                name: "tooltip",
                alias: "显示提示信息",
                type: "boolean",
                default: true
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let legend_label_color = await ShanhaiBI.getSetting("legend-label-color");
    let legend_label_size = await ShanhaiBI.getSetting("legend-label-size");
    let tooltip_display = await ShanhaiBI.getSetting("tooltip");

    myChart.showLoading();
    $.get(ROOT_PATH + '/data/asset/data/obama_budget_proposal_2012.list.json', function (obama_budget_2012) {
        myChart.hideLoading();
        let option = {
            color: shape_color,
            tooltip: {
                show: tooltip_display,
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    label: {
                        show: true
                    }
                }
            },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                }
            },
            calculable: true,
            legend: {
                data: ['Growth', 'Budget 2011', 'Budget 2012'],
                itemGap: 5,
                textStyle: {
                    color: legend_label_color,
                    fontSize: legend_label_size
                }
            },
            grid: {
                top: '12%',
                left: '1%',
                right: '10%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: obama_budget_2012.names
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: 'Budget (million USD)',
                    axisLabel: {
                        formatter: function (a) {
                            a = +a;
                            return isFinite(a) ? echarts.format.addCommas(+a / 1000) : '';
                        }
                    }
                }
            ],
            dataZoom: [
                {
                    show: true,
                    start: 94,
                    end: 100
                },
                {
                    type: 'inside',
                    start: 94,
                    end: 100
                },
                {
                    show: true,
                    yAxisIndex: 0,
                    filterMode: 'empty',
                    width: 30,
                    height: '80%',
                    showDataShadow: false,
                    left: '93%'
                }
            ],
            series: [
                {
                    name: 'Budget 2011',
                    type: 'bar',
                    data: obama_budget_2012.budget2011List
                },
                {
                    name: 'Budget 2012',
                    type: 'bar',
                    data: obama_budget_2012.budget2012List
                }
            ]
        };
        myChart.setOption(option);
    });
})();