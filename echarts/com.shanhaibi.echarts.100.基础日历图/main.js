(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-date",
                alias: "日期字段",
                type: "axis",
            },
            {
                name: "axis-value",
                alias: "取值字段",
                type: "axis"
            }
        ],
        "format": [
            {
                name: "data-color",
                alias: "数据颜色",
                type: "palette",
                default: ['#f5eea6', '#e2b78d', '#d18073', '#c46060']
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
                name: "year",
                alias: "显示年份",
                type: "boolean",
                default: true
            },
            {
                name: "year-label-color",
                alias: "年份颜色",
                type: "color",
                default: "#ccc"
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let max_value = await ShanhaiBI.getSetting("max-value");
    let min_value = await ShanhaiBI.getSetting("min-value");
    let rawData = await ShanhaiBI.getData();
    let date_data = rawData.getColumn("axis-date");
    let value_data = rawData.getColumn("axis-value");
    let data = getVirtulData("2017");
    if (date_data.length && value_data.length) {
        data = [];
        for (let i = 0; i < date_data.length; i++) {
            let date = new Date(date_data[i]);
            let date_str = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            data.push([date_str, value_data[i]])
        }
    }
    
    let option = {
        tooltip: {},
        visualMap: {
            show: false,
            min: min_value,
            max: max_value,
            inRange: {
                color: await ShanhaiBI.getSetting("data-color"),
            },
        },
        calendar: {
            range: [data[0][0], data[data.length - 1][0]],
            yearLabel: {
                show: await ShanhaiBI.getSetting("year"),
                color: await ShanhaiBI.getSetting("year-label-color")
            },
            dayLabel: { color: "#aaa" },
            monthLabel: { color: "#aaa" },
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
        var end = +echarts.number.parseDate(year + '-12-31');
        var dayTime = 3600 * 24 * 1000;
        var data = [];
        for (var time = date; time <= end; time += dayTime) {
            data.push([
                echarts.format.formatTime('yyyy-MM-dd', time),
                Math.floor(Math.random() * (max_value - min_value)) + min_value
            ]);
        }
        return data;
    }
})();