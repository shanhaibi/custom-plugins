(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形边框颜色",
                type: "color",
                default: "#5873c6"
            },
            {
                name: "area-color",
                alias: "区域颜色",
                type: "color",
                default: "#fff"
            },
            {
                name: "scatter-color",
                alias: "散点颜色",
                type: "color",
                default: "#abd591"
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let data = (await ShanhaiBI.getData()).getColumns();
    if(!data.length) {
        data = [
            [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],
            [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
            [880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],
            [890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],
            [890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870]
        ];
    }
    echartsSetOption(myChart, data);

    async function echartsSetOption(echart, data) {
        let option = {
            title: [
                {
                    text: 'Michelson-Morley Experiment',
                    left: 'center',
                    textStyle: {
                        color: "#aaa"
                    },
                },
                {
                    text: 'upper: Q3 + 1.5 * IQR \nlower: Q1 - 1.5 * IQR',
                    borderColor: '#999',
                    borderWidth: 1,
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: 14,
                        lineHeight: 20,
                        color: "#aaa"
                    },
                    left: '10%',
                    top: '90%'
                }
            ],
            dataset: [
                {
                    // prettier-ignore
                    source: data
                },
                {
                    transform: {
                        type: 'boxplot',
                        config: { itemNameFormatter: 'expr {value}' }
                    }
                },
                {
                    fromDatasetIndex: 1,
                    fromTransformResult: 1
                }
            ],
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '15%'
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                nameGap: 30,
                splitArea: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                name: 'km/s minus 299,000',
                splitArea: {
                    show: true
                }
            },
            series: [
                {
                    name: 'boxplot',
                    type: 'boxplot',
                    datasetIndex: 1,
                    color: await ShanhaiBI.getSetting("shape-color"),
                    itemStyle: {
                        color: await ShanhaiBI.getSetting("area-color") 
                    }
                },
                {
                    name: 'outlier',
                    type: 'scatter',
                    color: await ShanhaiBI.getSetting("scatter-color"),
                    datasetIndex: 2
                }
            ]
        };
        echart.setOption(option);
    }
})();