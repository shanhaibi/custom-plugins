(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-date",
                alias: "日期字段",
                type: "axis",
            },
            {
                name: "axis-data",
                alias: "数据字段",
                type: "axis"
            }
        ],
        "format": [
            {
                name: "legend",
                alias: "图例",
                type: "boolean",
                default: true
            },
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
                default: 10000
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
    
    let dataRaw = await ShanhaiBI.getData();
    let x_data = dataRaw.getColumn("axis-date");
    let y_data = dataRaw.getColumn("axis-data");
    let data = getVirtulData('2016');
    if(x_data.length && y_data.length) {
        data = []
        for(let i = 0; i < x_data.length; i++) {
            data.push([getDate(x_data[i]), y_data[i]]);
        }
    }
    let option = {
        color: await ShanhaiBI.getSetting("data-color"),
        title: {
            top: 30,
            left: 'center',
            text: 'Daily Step Count'
        },
        tooltip: {},
        visualMap: {
            min: await ShanhaiBI.getSetting("min-value"),
            max: await ShanhaiBI.getSetting("max-value"),
            type: 'piecewise',
            orient: 'horizontal',
            left: 'center',
            show: await ShanhaiBI.getSetting("legend"),
            top: 65
        },
        calendar: {
            top: 120,
            left: 30,
            cellSize: await ShanhaiBI.getSetting("cell-size"),
            range: [data[0][0], data[data.length - 1][0]],
            itemStyle: {
                borderWidth: 0.5
            },
            yearLabel: { show: false }
        },
        series: {
            type: 'heatmap',
            coordinateSystem: 'calendar',
            data: data
        }
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
                Math.floor(Math.random() * 10000)
            ]);
        }
        return data;
    }
    function getDate(dateRaw) {
        let date = new Date(dateRaw);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
})();