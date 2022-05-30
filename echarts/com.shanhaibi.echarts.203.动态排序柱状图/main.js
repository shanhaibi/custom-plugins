(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "color",
                default: "#5470C6",
            },
            {
                name: "y-max",
                alias: "y轴刻度最大值",
                type: "number",
                default: 3
            },
            {
                name: "align-with-label",
                alias: "刻度线与标签对齐",
                type: "boolean",
                default: true,
            },
            {
                name: "legend",
                alias: "显示图例",
                type: "boolean",
                default: true
            },
            {
                name: "sort",
                alias: "是否排序",
                type: "boolean",
                default: true
            },
            {
                name: "label-color",
                alias: "文本颜色",
                type: "color",
                default: "#aaa",
                cluster: {title: "图形文本设置"}
            },
            {
                name: "label-size",
                alias: "字体大小(px)",
                type: "number",
                default: 16,
                cluster: {title: "图形文本设置"}
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let y_max = await ShanhaiBI.getSetting("y-max");
    let data = [];
    for (let i = 0; i < 5; ++i) {
        data.push(Math.round(Math.random() * 200));
    }
    let option = {
        xAxis: {
            max: 'dataMax'
        },
        yAxis: {
            type: 'category',
            data: ['A', 'B', 'C', 'D', 'E'],
            inverse: true,
            axisTick: {
                alignWithLabel: await ShanhaiBI.getSetting("align-with-label")
            },
            animationDuration: 300,
            animationDurationUpdate: 300,
            max: y_max - 1 // only the largest 3 bars will be displayed
        },
        series: [
            {
                realtimeSort: await ShanhaiBI.getSetting("sort"),
                name: 'X',
                type: 'bar',
                color: await ShanhaiBI.getSetting("shape-color"),
                data: data,
                label: {
                    show: true,
                    color: await ShanhaiBI.getSetting("label-color"),
                    fontSize: await ShanhaiBI.getSetting("label-size"),
                    position: 'right',
                    valueAnimation: true
                }
            }
        ],
        legend: {
            show: await ShanhaiBI.getSetting("legend")
        },
        animationDuration: 0,
        animationDurationUpdate: 3000,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear'
    };
    myChart.setOption(option);

    function run() {
        for (let i = 0; i < data.length; ++i) {
            if (Math.random() > 0.9) {
                data[i] += Math.round(Math.random() * 2000);
            } else {
                data[i] += Math.round(Math.random() * 200);
            }
        }
        myChart.setOption({
            series: [
                {
                    type: 'bar',
                    data
                }
            ]
        });
    }
    setTimeout(function () {
        run();
    }, 0);
    setInterval(function () {
        run();
    }, 3000);
})();