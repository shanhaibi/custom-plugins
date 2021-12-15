(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-calendar_date",
                alias: "日期字段",
                type: "axis",
                cluster: {
                    title:"日历图数据",
                }
            },
            {
                name: "axis-calendar",
                alias: "取值字段",
                type: "axis",
                cluster: {
                    title:"日历图数据",
                }
            },
            {
                name: "axis-graph_date",
                alias: "日期字段",
                type: "axis",
                cluster: {
                    title: "关系图数据"
                }
            },
            {
                name: "axis-graph",
                alias: "取值字段",
                type: "axis",
                cluster: {
                    title: "关系图数据"
                }
            }
        ],
        "format": [
            {
                name: "calendar-color",
                alias: "色块颜色",
                type: "palette",
                default: ['#5291FF', '#C7DBFF']
            },
            {
                name: "symbol-color",
                alias: "图形颜色",
                type: "color",
                default: "#ffff00"
            },
            {
                name: "color-piece-size",
                alias: "色块大小(px)",
                type: "number",
                default: 40
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

    let max_scale = 1000;
    let rawData = await ShanhaiBI.getData();
    let date_calendar_data = rawData.getColumn("axis-calendar_date");
    let calendar_data = rawData.getColumn("axis-calendar");
    let graph_data = rawData.getColumn("axis-graph");
    let date_graph_data = rawData.getColumn("axis-graph_date");
    let graphData = [
        ['2017-02-01', 260],
        ['2017-02-04', 200],
        ['2017-02-09', 279],
        ['2017-02-13', 847],
        ['2017-02-18', 241],
        ['2017-02-23', 411],
        ['2017-03-14', 985]
    ];
    let range = ['2017-02', '2017-03-31'];
    let data = getVirtulData('2017');
    if (date_calendar_data.length && calendar_data.length && graph_data.length && date_graph_data.length) {
        graphData = [], data = [];
        for (let i = 0; i < date_calendar_data.length; i++) {
            let date = new Date(date_calendar_data[i]);
            let date_str = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            data.push([date_str, calendar_data[i]]);

            if(date_graph_data[i] !== undefined) {
                let date = new Date(date_graph_data[i]);
                let date_str = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                graphData.push([date_str, graph_data[i]])
            }
        }
        range = [data[0][0], data[data.length - 1][0]];
    }
    let links = graphData.map(function (item, idx) {
        return {
            source: idx,
            target: idx + 1
        };
    });
    links.pop();

    let option = {
        tooltip: {},
        calendar: {
            top: 'middle',
            left: 'center',
            orient: 'vertical',
            cellSize: await ShanhaiBI.getSetting("color-piece-size"),
            yearLabel: {
                margin: 50,
                fontSize: 30,
                color: await ShanhaiBI.getSetting("year-label-color")
            },
            dayLabel: {
                firstDay: 1,
                nameMap: 'cn',
                color: '#999'
            },
            monthLabel: {
                nameMap: 'cn',
                margin: 15,
                fontSize: 20,
                color: '#999'
            },
            range: range
        },
        visualMap: {
            min: 10,
            max: 180,
            type: 'piecewise',
            left: 'center',
            bottom: 20,
            inRange: {
                color: await ShanhaiBI.getSetting("calendar-color")
            },
            seriesIndex: [1],
            textStyle: {
                color: "#aaa"
            },
            orient: 'horizontal'
        },
        series: [
            {
                type: 'graph',
                edgeSymbol: ['none', 'arrow'],
                coordinateSystem: 'calendar',
                links: links,
                symbolSize: 15,
                calendarIndex: 0,
                itemStyle: {
                    color: await ShanhaiBI.getSetting("symbol-color"),
                    shadowBlur: 9,
                    shadowOffsetX: 1.5,
                    shadowOffsetY: 3,
                    shadowColor: '#555'
                },
                lineStyle: {
                    color: '#D10E00',
                    width: 1,
                    opacity: 1
                },
                data: graphData,
                z: 20
            },
            {
                type: 'heatmap',
                coordinateSystem: 'calendar',
                data: data
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