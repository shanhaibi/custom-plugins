(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ["#00008b", "#f00", "#ffde00", "#002a8f", "#003580", "#ed2939", "#000", "#003897", "#f93", "#bc002d", "#024fa2", "#000", "#00247f", "#ef2b2d", "#dc143c", "#d52b1e", "#e30a17", "#00247d", "#b22234"],
            },
            {
                name: "y-max",
                alias: "y轴刻度最大值",
                type: "number",
                default: 10
            },
            {
                name: "align-with-label",
                alias: "刻度线与标签对齐",
                type: "boolean",
                default: true,
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
                cluster: { title: "图形文本设置" }
            },
            {
                name: "label-size",
                alias: "字体大小(px)",
                type: "number",
                default: 16,
                cluster: { title: "图形文本设置" }
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let updateFrequency = 2000;
    let dimension = 0;
    let colors = await ShanhaiBI.getSetting("shape-color");
    let y_max = await ShanhaiBI.getSetting("y-max");
    let align_with_label = await ShanhaiBI.getSetting("align-with-label");
    let isSort = await ShanhaiBI.getSetting("sort");
    let label_color = await ShanhaiBI.getSetting("label-color");
    let label_size = await ShanhaiBI.getSetting("label-size");
    $.when($.getJSON('https://cdn.jsdelivr.net/npm/emoji-flags@1.3.0/data.json'),
        $.getJSON(ROOT_PATH + '/data/asset/data/life-expectancy-table.json')).done(function (res0, res1) {
            let flags = res0[0];
            let data = res1[0];
            let years = [];
            for (let i = 0; i < data.length; ++i) {
                if (years.length === 0 || years[years.length - 1] !== data[i][4]) {
                    years.push(data[i][4]);
                }
            }
            function getFlag(countryName) {
                if (!countryName) {
                    return '';
                }
                return (
                    flags.find(function (item) {
                        return item.name === countryName;
                    }) || {}
                ).emoji;
            }
            let startIndex = 10;
            let startYear = years[startIndex];
            let option = {
                grid: {
                    top: 10,
                    bottom: 30,
                    left: 150,
                    right: 80
                },
                xAxis: {
                    max: 'dataMax',
                    axisLabel: {
                        formatter: function (n) {
                            return Math.round(n) + '';
                        }
                    }
                },
                dataset: {
                    source: data.slice(1).filter(function (d) {
                        return d[4] === startYear;
                    })
                },
                yAxis: {
                    type: 'category',
                    inverse: true,
                    max: y_max - 1,
                    axisLabel: {
                        show: true,
                        fontSize: 14,
                        formatter: function (value) {
                            return value + '{flag|' + getFlag(value) + '}';
                        },
                        rich: {
                            flag: {
                                fontSize: 25,
                                padding: 5
                            }
                        }
                    },
                    axisTick: {
                        alignWithLabel: align_with_label
                    },
                    animationDuration: 300,
                    animationDurationUpdate: 300
                },
                series: [
                    {
                        realtimeSort: isSort,
                        seriesLayoutBy: 'column',
                        type: 'bar',
                        itemStyle: {
                            color: function (param) {
                                return colors[param.dataIndex] || "#5470c6";
                            }
                        },
                        encode: {
                            x: dimension,
                            y: 3
                        },
                        label: {
                            show: true,
                            color: label_color,
                            fontSize: label_size,
                            precision: 1,
                            position: 'right',
                            valueAnimation: true,
                            fontFamily: 'monospace'
                        }
                    }
                ],
                // Disable init animation.
                animationDuration: 0,
                animationDurationUpdate: updateFrequency,
                animationEasing: 'linear',
                animationEasingUpdate: 'linear',
                graphic: {
                    elements: [
                        {
                            type: 'text',
                            right: 160,
                            bottom: 60,
                            style: {
                                text: startYear,
                                font: 'bolder 80px monospace',
                                fill: 'rgba(100, 100, 100, 0.25)'
                            },
                            z: 100
                        }
                    ]
                }
            };
            myChart.setOption(option);
            for (let i = startIndex; i < years.length - 1; ++i) {
                (function (i) {
                    setTimeout(function () {
                        updateYear(years[i + 1]);
                    }, (i - startIndex) * updateFrequency);
                })(i);
            }
            function updateYear(year) {
                let source = data.slice(1).filter(function (d) {
                    return d[4] === year;
                });
                option.series[0].data = source;
                option.graphic.elements[0].style.text = year;
                myChart.setOption(option);
            }
        });
})();