(async function () {
    await ShanhaiBI.initSettings({
        
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                default: ['#5873c6', '#99cc75', '#f5c657', '#FF917C', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
                type: "palette"
            },
            {
                name: "area-color",
                alias: "区域颜色",
                type: "color",
                default: "#fff"
            },
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);
    
    let data = [makeData(), makeData(), makeData()];
    echartsSetOption(myChart, data);

    async function echartsSetOption(echart, data) {
        let dataset = [], series = [];
        let length = data.length;
        let shape_colors = await ShanhaiBI.getSetting("shape-color");
        let area_color = await ShanhaiBI.getSetting("area-color");
        for (let i = 0; i < length * 2; i++) {
            if (i < length) {
                dataset.push({ source: data[i] });
                series.push({
                    name: 'category' + i,
                    type: 'boxplot',
                    datasetIndex: i + length,
                    color: shape_colors[i],
                    itemStyle: {
                        color: area_color
                    }
                })
            } else {
                dataset.push({
                    fromDatasetIndex: i - length,
                    transform: { type: "boxplot" }
                })
            }
        }
        let option = {
            title: {
                text: 'Multiple Categories',
                left: 'center'
            },
            dataset: dataset,
            legend: {
                top: '10%',
                textStyle: {
                    color: "#aaa"
                }
            },
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '10%',
                top: '20%',
                right: '10%',
                bottom: '15%'
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                nameGap: 30,
                splitArea: {
                    show: true
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                name: 'Value',
                min: -400,
                max: 600,
                splitArea: {
                    show: false
                }
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 20
                },
                {
                    show: true,
                    type: 'slider',
                    top: '90%',
                    xAxisIndex: [0],
                    start: 0,
                    end: 20
                }
            ],
            series: series
        };
        echart.setOption(option);
    }
    function makeData() {
        let data = [];
        for (let i = 0; i < 18; i++) {
            let cate = [];
            for (let j = 0; j < 100; j++) {
                cate.push(Math.random() * 200);
            }
            data.push(cate);
        }
        return data;
    }
})();