(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-date",
                alias: "日期字段",
                type: "axis"
            },
            {
                name: "axis-category",
                alias: "分类字段",
                type: "axis"
            },
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
            {
                name: "label-offset-left",
                alias: "图形文本据左侧位置(px)",
                type: "number",
                default: 35
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let rawData = await ShanhaiBI.getData();
    let date_data = rawData.getColumn("axis-date");
    let category_data = rawData.getColumn("axis-category");
    let value_data = rawData.getColumn("axis-value");
    let legend_data = [], data = [];
    if(date_data.length && category_data.length && value_data.length) {
        legend_data = [...new Set(category_data)];
        for(let i = 0; i < date_data.length; i++) {
            let date = new Date(date_data[i]);
            let date_str = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            data.push([date_str, value_data[i], category_data[i]]);
        }
    } else {
        legend_data = ['DQ', 'TY', 'SS', 'QG', 'SY', 'DD'];
        data = [
            ['2015/11/08', 10, 'DQ'],
            ['2015/11/09', 15, 'DQ'],
            ['2015/11/10', 35, 'DQ'],
            ['2015/11/11', 38, 'DQ'],
            ['2015/11/12', 22, 'DQ'],
            ['2015/11/13', 16, 'DQ'],
            ['2015/11/14', 7, 'DQ'],
            ['2015/11/15', 2, 'DQ'],
            ['2015/11/16', 17, 'DQ'],
            ['2015/11/17', 33, 'DQ'],
            ['2015/11/18', 40, 'DQ'],
            ['2015/11/19', 32, 'DQ'],
            ['2015/11/20', 26, 'DQ'],
            ['2015/11/21', 35, 'DQ'],
            ['2015/11/22', 40, 'DQ'],
            ['2015/11/23', 32, 'DQ'],
            ['2015/11/24', 26, 'DQ'],
            ['2015/11/25', 22, 'DQ'],
            ['2015/11/26', 16, 'DQ'],
            ['2015/11/27', 22, 'DQ'],
            ['2015/11/28', 10, 'DQ'],
            ['2015/11/08', 35, 'TY'],
            ['2015/11/09', 36, 'TY'],
            ['2015/11/10', 37, 'TY'],
            ['2015/11/11', 22, 'TY'],
            ['2015/11/12', 24, 'TY'],
            ['2015/11/13', 26, 'TY'],
            ['2015/11/14', 34, 'TY'],
            ['2015/11/15', 21, 'TY'],
            ['2015/11/16', 18, 'TY'],
            ['2015/11/17', 45, 'TY'],
            ['2015/11/18', 32, 'TY'],
            ['2015/11/19', 35, 'TY'],
            ['2015/11/20', 30, 'TY'],
            ['2015/11/21', 28, 'TY'],
            ['2015/11/22', 27, 'TY'],
            ['2015/11/23', 26, 'TY'],
            ['2015/11/24', 15, 'TY'],
            ['2015/11/25', 30, 'TY'],
            ['2015/11/26', 35, 'TY'],
            ['2015/11/27', 42, 'TY'],
            ['2015/11/28', 42, 'TY'],
            ['2015/11/08', 21, 'SS'],
            ['2015/11/09', 25, 'SS'],
            ['2015/11/10', 27, 'SS'],
            ['2015/11/11', 23, 'SS'],
            ['2015/11/12', 24, 'SS'],
            ['2015/11/13', 21, 'SS'],
            ['2015/11/14', 35, 'SS'],
            ['2015/11/15', 39, 'SS'],
            ['2015/11/16', 40, 'SS'],
            ['2015/11/17', 36, 'SS'],
            ['2015/11/18', 33, 'SS'],
            ['2015/11/19', 43, 'SS'],
            ['2015/11/20', 40, 'SS'],
            ['2015/11/21', 34, 'SS'],
            ['2015/11/22', 28, 'SS'],
            ['2015/11/23', 26, 'SS'],
            ['2015/11/24', 37, 'SS'],
            ['2015/11/25', 41, 'SS'],
            ['2015/11/26', 46, 'SS'],
            ['2015/11/27', 47, 'SS'],
            ['2015/11/28', 41, 'SS'],
            ['2015/11/08', 10, 'QG'],
            ['2015/11/09', 15, 'QG'],
            ['2015/11/10', 35, 'QG'],
            ['2015/11/11', 38, 'QG'],
            ['2015/11/12', 22, 'QG'],
            ['2015/11/13', 16, 'QG'],
            ['2015/11/14', 7, 'QG'],
            ['2015/11/15', 2, 'QG'],
            ['2015/11/16', 17, 'QG'],
            ['2015/11/17', 33, 'QG'],
            ['2015/11/18', 40, 'QG'],
            ['2015/11/19', 32, 'QG'],
            ['2015/11/20', 26, 'QG'],
            ['2015/11/21', 35, 'QG'],
            ['2015/11/22', 40, 'QG'],
            ['2015/11/23', 32, 'QG'],
            ['2015/11/24', 26, 'QG'],
            ['2015/11/25', 22, 'QG'],
            ['2015/11/26', 16, 'QG'],
            ['2015/11/27', 22, 'QG'],
            ['2015/11/28', 10, 'QG'],
            ['2015/11/08', 10, 'SY'],
            ['2015/11/09', 15, 'SY'],
            ['2015/11/10', 35, 'SY'],
            ['2015/11/11', 38, 'SY'],
            ['2015/11/12', 22, 'SY'],
            ['2015/11/13', 16, 'SY'],
            ['2015/11/14', 7, 'SY'],
            ['2015/11/15', 2, 'SY'],
            ['2015/11/16', 17, 'SY'],
            ['2015/11/17', 33, 'SY'],
            ['2015/11/18', 40, 'SY'],
            ['2015/11/19', 32, 'SY'],
            ['2015/11/20', 26, 'SY'],
            ['2015/11/21', 35, 'SY'],
            ['2015/11/22', 4, 'SY'],
            ['2015/11/23', 32, 'SY'],
            ['2015/11/24', 26, 'SY'],
            ['2015/11/25', 22, 'SY'],
            ['2015/11/26', 16, 'SY'],
            ['2015/11/27', 22, 'SY'],
            ['2015/11/28', 10, 'SY'],
            ['2015/11/08', 10, 'DD'],
            ['2015/11/09', 15, 'DD'],
            ['2015/11/10', 35, 'DD'],
            ['2015/11/11', 38, 'DD'],
            ['2015/11/12', 22, 'DD'],
            ['2015/11/13', 16, 'DD'],
            ['2015/11/14', 7, 'DD'],
            ['2015/11/15', 2, 'DD'],
            ['2015/11/16', 17, 'DD'],
            ['2015/11/17', 33, 'DD'],
            ['2015/11/18', 4, 'DD'],
            ['2015/11/19', 32, 'DD'],
            ['2015/11/20', 26, 'DD'],
            ['2015/11/21', 35, 'DD'],
            ['2015/11/22', 40, 'DD'],
            ['2015/11/23', 32, 'DD'],
            ['2015/11/24', 26, 'DD'],
            ['2015/11/25', 22, 'DD'],
            ['2015/11/26', 16, 'DD'],
            ['2015/11/27', 22, 'DD'],
            ['2015/11/28', 10, 'DD']
        ]
    }
    let label_offset_left = await ShanhaiBI.getSetting("label-offset-left");

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
        legend: {
            data: legend_data,
            textStyle: {
                color: "#aaa"
            }
        },
        singleAxis: {
            top: 50,
            bottom: 50,
            axisTick: {},
            axisLabel: {},
            type: 'time',
            axisPointer: {
                animation: true,
                label: {
                    show: true
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    opacity: 0.2
                }
            }
        },
        series: [
            {
                type: 'themeRiver',
                color: await ShanhaiBI.getSetting("shape-color"),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 20,
                        shadowColor: 'rgba(0, 0, 0, 0.8)'
                    }
                },
                label: {
                    color: await ShanhaiBI.getSetting("label-color"),
                    offset: [- label_offset_left, 0],
                    fontSize: await ShanhaiBI.getSetting("label-size")
                },
                data: data
            }
        ]
    };
    myChart.setOption(option);
})();