(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "data-color",
                alias: "数据颜色",
                type: "palette",
                default: ['#f5eea6', '#e2b78d', '#d18073', '#c46060', '#b6404c', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            },
            {
                name: "min-value",
                alias: "最小值",
                type: "number",
                default: 0
            },
            {
                name: "max-value",
                alias: "最大值",
                type: "number",
                default: 1000
            },
            {
                name: "cell-size",
                alias: "日历格大小",
                type: "number",
                default: 20
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let option = {
        color: await ShanhaiBI.getSetting("data-color"),
        tooltip: {
            position: 'top',
            formatter: function (p) {
                var format = echarts.format.formatTime('yyyy-MM-dd', p.data[0]);
                return format + ': ' + p.data[1];
            }
        },
        visualMap: {
            min: await ShanhaiBI.getSetting("min-value"),
            max: await ShanhaiBI.getSetting("max-value"),
            calculable: true,
            orient: 'vertical',
            left: '670',
            top: 'center'
        },
        calendar: [
            {
                orient: 'vertical',
                cellSize: await ShanhaiBI.getSetting("cell-size"),
                range: '2015'
            },
            {
                left: 300,
                orient: 'vertical',
                cellSize: await ShanhaiBI.getSetting("cell-size"),
                range: '2016'
            },
            {
                left: 520,
                cellSize: await ShanhaiBI.getSetting("cell-size"),
                orient: 'vertical',
                range: '2017',

            }
        ],
        series: [
            {
                type: 'heatmap',
                coordinateSystem: 'calendar',
                calendarIndex: 0,
                data: getVirtulData('2015')
            },
            {
                type: 'heatmap',
                coordinateSystem: 'calendar',
                calendarIndex: 1,
                data: getVirtulData('2016')
            },
            {
                type: 'heatmap',
                coordinateSystem: 'calendar',
                calendarIndex: 2,
                data: getVirtulData('2017')
            }
        ]
    };
    myChart.setOption(option);

    function getVirtulData(year) {
        year = year || '2017';
        var date = +echarts.number.parseDate(year + '-01-01');
        var end = +echarts.number.parseDate(+year + 1 + '-01-01');
        var dayTime = 3600 * 24 * 1000;
        var data = [];
        for (var time = date; time < end; time += dayTime) {
            data.push([
                echarts.format.formatTime('yyyy-MM-dd', time),
                Math.floor(Math.random() * 1000)
            ]);
        }
        return data;
    }
})();