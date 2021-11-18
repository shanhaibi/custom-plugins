(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
            },
            {
                name: "shape-size",
                alias: "图形大小",
                type: "number",
                default: 20
            },
            {
                name: "split-number",
                alias: "最大分裂数",
                type: "number",
                default: 6
            }

        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);
    echarts.registerTransform(ecStat.transform.clustering);

    let data = (await ShanhaiBI.getData()).getColumns();
    if (data.length < 2) {
        data = [
            [3.275154, -3.344465, 0.355083, 1.852435, -2.078973, -0.993756, 2.682252, -3.087776, -1.565978, 2.441611, -0.659487, -0.459601, 2.17768, -2.920969, -0.028814, 3.625746, -3.912363, -0.551694, 2.855808, -3.594448, 0.421993, 1.650821, -2.082902, -0.718809, 4.513623, -4.822011, -0.656297, 1.919901, -3.287749, -1.576936, 3.598143, -3.977329, -1.79108, 3.914654, -1.910108, -1.226597, 1.148946, -2.113864, 0.845762, 2.629062, -1.640717, -1.881012, 4.606999, -4.366462, 0.765015, 3.121904, -4.025139, -0.559558, 4.376754, -1.874308, -0.089337, 3.997787, -3.082978, 0.845235, 1.327224, -2.889949, -0.966018, 2.960769, -3.275518, 0.639276],
            [2.957587, 2.603513, -3.376585, 3.547351, 2.552013, -0.884433, 4.007573, 2.878713, -1.256985, 0.444826, 3.111284, -2.618005, 2.387793, 2.917485, -4.168078, 2.119041, 1.325108, -2.814223, 3.483301, 2.856651, -2.372646, 3.407572, 3.384412, -2.492514, 3.841029, 4.607049, -1.449872, 4.439368, 3.918836, -2.977622, 1.97597, 4.900932, -2.184517, 3.559303, 4.166946, -3.317889, 3.345138, 3.548172, -3.589788, 3.535831, 2.990517, -2.485405, 3.510312, 4.023316, -3.00127, 2.173988, 4.65231, -3.840539, 4.863579, 4.032237, -3.026809, 2.518662, 2.884822, -3.454465, 3.358778, 3.596178, -2.839827, 3.079555, 1.577068, -3.41284]
        ]
    }
    let series_data = [];
    for (let i = 0; i < data[0].length; i++) {
        series_data.push([data[0][i], data[1][i]]);
    }
    let CLUSTER_COUNT = await ShanhaiBI.getSetting("split-number");
    let DIENSIION_CLUSTER_INDEX = 2;
    let COLOR_ALL = await ShanhaiBI.getSetting("shape-color");
    var pieces = [];
    for (var i = 0; i < CLUSTER_COUNT; i++) {
        pieces.push({
            value: i,
            label: 'cluster ' + i,
            color: COLOR_ALL[i]
        });
    }

    let option = {
        dataset: [
            {
                source: series_data
            },
            {
                transform: {
                    type: 'ecStat:clustering',
                    // print: true,
                    config: {
                        clusterCount: CLUSTER_COUNT,
                        outputType: 'single',
                        outputClusterIndexDimension: DIENSIION_CLUSTER_INDEX
                    }
                }
            }
        ],
        tooltip: {
            position: 'top'
        },
        visualMap: {
            type: 'piecewise',
            top: 'middle',
            min: 0,
            max: CLUSTER_COUNT,
            left: 10,
            splitNumber: CLUSTER_COUNT,
            dimension: DIENSIION_CLUSTER_INDEX,
            pieces: pieces,
            textStyle: {
                color: "#ccc",
                fontSize: 14
            }
        },
        grid: {
            left: 120
        },
        xAxis: {},
        yAxis: {},
        series: {
            type: 'scatter',
            encode: { tooltip: [0, 1] },
            symbolSize: await ShanhaiBI.getSetting("shape-size"),
            itemStyle: {
                borderColor: '#555'
            },
            datasetIndex: 1
        }
    };
    myChart.setOption(option);
})();