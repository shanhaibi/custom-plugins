(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "line-color",
                alias: "线段颜色",
                type: "color",
                default: "#5873c6",
            },
            {
                name: "line-width",
                alias: "线条宽度(px)",
                type: "number",
                default: 3,
            },
            {
                name: "animation-interval",
                alias: "动画间隔",
                type: "number",
                default: 1
            }
        ]
    })

    function randomData() {
        now = new Date(+now + oneDay);
        value = value + Math.random() * 21 - 10;
        return {
            name: now.toString(),
            value: [
                [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
                Math.round(value)
            ]
        };
    }

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let animation_interval = await ShanhaiBI.getSetting("animation-interval");
    let data = [];
    let now = new Date(1997, 9, 3);
    let oneDay = 24 * 3600 * 1000;
    let value = Math.random() * 1000;
    for (var i = 0; i < 1000; i++) {
        data.push(randomData());
    }
    let option = {
        title: {
            text: 'Dynamic Data & Time Axis'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                params = params[0];
                var date = new Date(params.name);
                return (date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1]);
            },
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            type: 'time',
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            splitLine: {
                show: false
            }
        },
        series: [
            {
                name: 'Fake Data',
                type: 'line',
                lineStyle: {
                    width: await ShanhaiBI.getSetting("line-width"),
                    color: await ShanhaiBI.getSetting("line-color")
                },
                showSymbol: false,
                data: data
            }
        ]
    };
    setInterval(function () {
        for (var i = 0; i < 5; i++) {
            data.shift();
            data.push(randomData());
        }
        myChart.setOption({
            series: [
                {
                    data: data
                }
            ]
        });
    }, animation_interval * 1000);
    myChart.setOption(option);
})();