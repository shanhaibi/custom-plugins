(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "data-color",
                alias: "数据颜色",
                type: "palette",
                default: ['#f5eea6', '#e2b78d', '#d18073', '#c46060']
            },
            {
                name: "color-piece-size",
                alias: "色块大小(px)",
                type: "number",
                default: 20
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

    let color_piece_size = await ShanhaiBI.getSetting("color-piece-size");
    let label = {
        yearLabel: {
            show: await ShanhaiBI.getSetting("year"),
            color: await ShanhaiBI.getSetting("year-label-color")
        },
        dayLabel: {color: "#aaa"},
        monthLabel: {color: "#aaa"}
    };
    let max_scale = 1000;

    let option = {
        tooltip: {
            position: 'top'
        },
        visualMap: {
            min: 0,
            max: max_scale,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            top: 'top',
            inRange: {
                color: await ShanhaiBI.getSetting("data-color"),
            },
        },
        calendar: [
            {
                range: '2017',
                cellSize: color_piece_size,
                ...label
            },
            {
                top: 280,
                range: '2016',
                cellSize: color_piece_size,
                ...label
            },
            {
                top: 500,
                range: '2015',
                cellSize: color_piece_size,
                ...label
            }
        ],
        series: [
            {
                type: 'heatmap',
                coordinateSystem: 'calendar',
                calendarIndex: 0,
                data: getVirtulData('2017')
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
                data: getVirtulData('2015')
            }
        ]
    };
    myChart.setOption(option);

    function getVirtulData(year) {
        year = year || '2017';
        let date = +echarts.number.parseDate(year + '-01-01');
        let end = +echarts.number.parseDate(+year + 1 + '-01-01');
        let dayTime = 3600 * 24 * 1000;
        let data = [];
        for (let time = date; time < end; time += dayTime) {
            data.push([
                echarts.format.formatTime('yyyy-MM-dd', time),
                Math.floor(Math.random() * max_scale)
            ]);
        }
        return data;
    }
})();