(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
            },
            {
                name: "line-width",
                alias: "线条宽度(px)",
                type: "number",
                default: 3,
            },
            {
                name: "line-type",
                alias: "线条类型",
                type: "select",
                choices: [
                    {
                        label: "实线",
                        value: "solid"
                    },
                    {
                        label: "虚线",
                        value: "dashed"
                    },
                    {
                        label: "点线",
                        value: "dotted"
                    }
                ],
                default: "solid",
            },
            {
                name: "animation-duration",
                alias: "动画持续时间(s)",
                type: "number",
                default: 10
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let line_style = {
        type: await ShanhaiBI.getSetting("line-type"),
        width: await ShanhaiBI.getSetting("line-width")
    }
    let animation_duration = await ShanhaiBI.getSetting("animation-duration");
    $.get(ROOT_PATH + '/data/asset/data/life-expectancy-table.json', function (_rawData) {
        let countries = [
            'Finland',
            'France',
            'Germany',
            'Iceland',
            'Norway',
            'Poland',
            'Russia',
            'United Kingdom'
        ];
        let datasetWithFilters = [];
        let seriesList = [];
        echarts.util.each(countries, function (country) {
            let datasetId = 'dataset_' + country;
            datasetWithFilters.push({
                id: datasetId,
                fromDatasetId: 'dataset_raw',
                transform: {
                    type: 'filter',
                    config: {
                        and: [
                            { dimension: 'Year', gte: 1950 },
                            { dimension: 'Country', '=': country }
                        ]
                    }
                }
            });
            seriesList.push({
                type: 'line',
                datasetId: datasetId,
                showSymbol: false,
                name: country,
                endLabel: {
                    show: true,
                    formatter: function (params) {
                        return params.value[3] + ': ' + params.value[0];
                    },
                    color: "#aaa"
                },
                lineStyle: line_style,
                labelLayout: {
                    moveOverlap: 'shiftY'
                },
                emphasis: {
                    focus: 'series'
                },
                encode: {
                    x: 'Year',
                    y: 'Income',
                    label: ['Country', 'Income'],
                    itemName: 'Year',
                    tooltip: ['Income']
                }
            });
        });
        let option = {
            color: shape_color,
            animationDuration: animation_duration * 1000,
            dataset: [
                {
                    id: 'dataset_raw',
                    source: _rawData
                },
                ...datasetWithFilters
            ],
            title: {
                text: 'Income of Germany and France since 1950'
            },
            tooltip: {
                order: 'valueDesc',
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                nameLocation: 'middle'
            },
            yAxis: {
                name: 'Income'
            },
            grid: {
                right: 140
            },
            series: seriesList
        };
        myChart.setOption(option);
    }
    );
})();