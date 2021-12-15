(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-value",
                alias: "取值字段",
                type: "axis"
            }
        ],
        "format": [
            {
                name: "shape-color",
                type: "palette",
                default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
                alias: "图形颜色"
            },
            {
                name: "label-color",
                alias: "图形文本颜色",
                default: "#fff",
                type: "color"
            },
            {
                name: "label-size",
                alias: "字体大小",
                default: 12,
                type: "number"
            },
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let rawData = await ShanhaiBI.getData();
    let value_data = rawData.getColumns("axis-value");
    let labels = [];
    if(!value_data.length) {
        value_data = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 49, 67, 16, 0, 19, 19, 0, 0, 1, 10, 5, 6, 1, 1, 0, 25, 0, 0, 0],
            [0, 6, 3, 34, 0, 16, 1, 0, 0, 1, 6, 0, 1, 56, 0, 2, 0, 2, 0, 0],
            [0, 8, 13, 15, 0, 12, 23, 0, 0, 1, 0, 1, 0, 0, 6, 0, 0, 1, 0, 1],
            [0, 9, 28, 0, 91, 6, 1, 0, 0, 0, 7, 18, 0, 9, 16, 0, 1, 0, 0, 0],
            [0, 3, 42, 36, 21, 0, 1, 0, 0, 0, 0, 16, 30, 1, 4, 62, 55, 1, 0, 0],
            [0, 7, 13, 12, 64, 5, 0, 0, 0, 8, 17, 3, 72, 1, 1, 53, 1, 0, 0, 0],
            [1, 14, 13, 7, 8, 8, 7, 0, 1, 1, 14, 6, 44, 8, 7, 17, 21, 1, 0, 0],
            [0, 6, 14, 2, 14, 1, 0, 0, 0, 0, 2, 2, 7, 15, 6, 3, 0, 0, 0, 0],
            [0, 9, 11, 3, 0, 8, 0, 0, 14, 2, 0, 1, 1, 1, 7, 13, 2, 1, 0, 0],
            [0, 7, 5, 10, 8, 21, 0, 0, 130, 1, 2, 18, 6, 1, 5, 1, 4, 1, 0, 7],
            [0, 2, 15, 1, 5, 5, 0, 0, 6, 0, 0, 0, 4, 1, 3, 1, 17, 0, 0, 9],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [6, 27, 26, 1, 0, 11, 1, 0, 0, 0, 1, 1, 2, 0, 0, 9, 1, 0, 0, 0],
            [31, 81, 11, 6, 11, 0, 0, 0, 0, 0, 0, 0, 3, 2, 0, 3, 14, 0, 0, 12],
            [19, 53, 6, 20, 0, 4, 37, 0, 30, 86, 43, 7, 5, 7, 17, 19, 2, 0, 0, 5],
            [0, 22, 14, 6, 10, 24, 18, 0, 13, 21, 5, 2, 13, 35, 7, 1, 8, 0, 0, 1],
            [0, 56, 5, 0, 0, 0, 0, 0, 7, 24, 0, 17, 7, 0, 0, 3, 0, 0, 0, 8],
            [18, 29, 3, 6, 11, 0, 15, 0, 12, 42, 37, 0, 3, 3, 13, 8, 0, 0, 0, 1],
            [32, 39, 37, 3, 33, 21, 6, 0, 4, 17, 0, 11, 8, 2, 3, 0, 23, 0, 0, 17],
            [72, 15, 28, 0, 0, 0, 0, 0, 1, 3, 0, 35, 0, 9, 17, 1, 9, 1, 0, 8],
            [11, 15, 4, 2, 0, 18, 10, 0, 20, 3, 0, 0, 2, 0, 0, 2, 2, 30, 0, 0],
            [14, 29, 19, 3, 2, 17, 13, 0, 7, 12, 2, 0, 6, 0, 0, 1, 1, 34, 0, 1],
            [1, 1, 7, 6, 1, 1, 15, 1, 1, 2, 1, 3, 1, 1, 9, 1, 1, 25, 1, 72]
        ];
        labels = [
            'The Sea and Cake',
            'Andrew Bird',
            'Laura Veirs',
            'Brian Eno',
            'Christopher Willits',
            'Wilco',
            'Edgar Meyer',
            'B\xc3\xa9la Fleck',
            'Fleet Foxes',
            'Kings of Convenience',
            'Brett Dennen',
            'Psapp',
            'The Bad Plus',
            'Feist',
            'Battles',
            'Avishai Cohen',
            'Rachael Yamagata',
            'Norah Jones',
            'B\xc3\xa9la Fleck and the Flecktones',
            'Joshua Redman'
        ];
    } else {
        let value_axis = await ShanhaiBI.getSetting("axis-value");
        value_axis.forEach(dim => {
            labels.push(dim.alias);
        })
    }
    let data = [];
    for (let i = 0; i < value_data.length; i++) {
        for (let j = 0; j < value_data[i].length; j++) {
            let label = labels[i];
            data.push([j, value_data[i][j], label]);
        }
    }
    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: 'rgba(255,255,255,0.2)',
                    width: 1,
                    type: 'solid'
                }
            }
        },
        singleAxis: {
            max: 'dataMax',
        },
        series: [
            {
                type: 'themeRiver',
                color: await ShanhaiBI.getSetting("shape-color"),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 20,
                        shadowColor: 'rgba(0, 0, 0, 0.8)'
                    },
                    label: {
                        color: await ShanhaiBI.getSetting("label-color"),
                        offset: [- 35, 0],
                        fontSize: await ShanhaiBI.getSetting("label-size")
                    },
                },
                label: {
                    show: false
                },
                data: data
            }
        ]
    };
    myChart.setOption(option);
})();