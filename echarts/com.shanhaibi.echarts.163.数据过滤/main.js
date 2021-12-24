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
                name: "line-width",
                alias: "线条宽度",
                type: "number",
                default: 3,
            },
            {
                name: "line-type",
                alias: "线段类型",
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
                default: "solid"
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let line_style = {
        width: await ShanhaiBI.getSetting("line-width"),
        type: await ShanhaiBI.getSetting("line-type")
    };
    $.get(ROOT_PATH + '/data/asset/data/life-expectancy-table.json', function (_rawData) {
        let option = {
            color: shape_color,
            dataset: [
                {
                    id: 'dataset_raw',
                    source: _rawData
                },
                {
                    id: 'dataset_since_1950_of_germany',
                    fromDatasetId: 'dataset_raw',
                    transform: {
                        type: 'filter',
                        config: {
                            and: [
                                { dimension: 'Year', gte: 1950 },
                                { dimension: 'Country', '=': 'Germany' }
                            ]
                        }
                    }
                },
                {
                    id: 'dataset_since_1950_of_france',
                    fromDatasetId: 'dataset_raw',
                    transform: {
                        type: 'filter',
                        config: {
                            and: [
                                { dimension: 'Year', gte: 1950 },
                                { dimension: 'Country', '=': 'France' }
                            ]
                        }
                    }
                }
            ],
            title: {
                text: 'Income of Germany and France since 1950'
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                nameLocation: 'middle'
            },
            yAxis: {
                name: 'Income'
            },
            series: [
                {
                    type: 'line',
                    datasetId: 'dataset_since_1950_of_germany',
                    showSymbol: false,
                    encode: {
                        x: 'Year',
                        y: 'Income',
                        itemName: 'Year',
                        tooltip: ['Income']
                    },
                    lineStyle: line_style
                },
                {
                    type: 'line',
                    datasetId: 'dataset_since_1950_of_france',
                    showSymbol: false,
                    encode: {
                        x: 'Year',
                        y: 'Income',
                        itemName: 'Year',
                        tooltip: ['Income']
                    },
                    lineStyle: line_style
                }
            ]
        };
        myChart.setOption(option);
    }

    );

})();