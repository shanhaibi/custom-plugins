(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ["#83bff6", "#188df0", "#188df0"],
            },
            {
                name: "emphasis-shape-color",
                alias: "高亮图形颜色",
                type: "palette",
                default: ["#2378f7", "#2378f7", "#83bff6"]
            },
            {
                name: "min-zoom-size",
                alias: "点击显示最小显示柱子数量",
                type: "number",
                default: 6
            },
            {
                name: "background",
                alias: "显示背景",
                type: "boolean",
                default: true
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let emphasis_shape_color = await ShanhaiBI.getSetting("emphasis-shape-color");
    // prettier-ignore
    let dataAxis = ['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触', '屏', '上', '滑', '动', '能', '够', '自', '动', '缩', '放'];
    // prettier-ignore
    let data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
    let yMax = 500;
    let dataShadow = [];
    for (let i = 0; i < data.length; i++) {
        dataShadow.push(yMax);
    }
    let option = {
        title: {
            text: '特性示例：渐变色 阴影 点击缩放',
            subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
        },
        xAxis: {
            data: dataAxis,
            axisLabel: {
                inside: true,
                color: '#fff'
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            z: 10
        },
        yAxis: {
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#999'
            }
        },
        dataZoom: [
            {
                type: 'inside'
            }
        ],
        series: [
            {
                type: 'bar',
                showBackground: await ShanhaiBI.getSetting("background"),
                itemStyle: {
                    color: generateLinearGradient(shape_color)
                },
                emphasis: {
                    itemStyle: {
                        color: generateLinearGradient(emphasis_shape_color)
                    }
                },
                data: data
            }
        ]
    };
    // Enable data zoom when user click bar.
    let zoomSize = await ShanhaiBI.getSetting("min-zoom-size");
    myChart.on('click', function (params) {
        let start_index = Math.floor(Math.max(params.dataIndex - zoomSize / 2, 0));
        myChart.dispatchAction({
            type: 'dataZoom',
            startValue: dataAxis[start_index],
            endValue: dataAxis[Math.min(start_index + zoomSize - 1, data.length - 1)]
        });
    });
    myChart.setOption(option);
    
    function generateLinearGradient(colors) {
        if (colors.length < 2) return colors[0] ? colors[0] : "#1890ff";
        let color_arr = [], colors_len = colors.length;
        for (let i = 0; i < colors_len; i++) {
            color_arr.push({
                offset: i / (colors_len - 1),
                color: colors[i]
            })
        }
        return new echarts.graphic.LinearGradient(0, 0, 0, 1, color_arr)
    }
})();