(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "title",
                alias: "显示标题",
                type: "boolean",
                default: true
            },
            {
                name: "road-type",
                alias: "路径类型",
                type: "select",
                choices: [
                    {
                        value: "solid",
                        label: "直线"
                    },
                    {
                        value: "dotted",
                        label: "虚线"
                    }
                ],
                default: "solid"
            },
            {
                name: "road-color",
                alias: "路径颜色",
                type: "color",
                default: "#c46e54"
            },
            {
                name: "road-width",
                alias: "路径宽度",
                type: "number",
                default: 5
            },
            {
                name: "speed",
                alias: "速度",
                type: "number",
                default: 80
            }
        ]
    })
    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let road_type = await ShanhaiBI.getSetting("road-type");
    let road_color = await ShanhaiBI.getSetting("road-color");
    let road_width = await ShanhaiBI.getSetting("road-width");
    let title_display = await ShanhaiBI.getSetting("title");
    let speed = await ShanhaiBI.getSetting("speed")
    let data = (await ShanhaiBI.getData()).getColumns();
    if (data.length < 2) {
        data = [
            [
                110.6189462165178, 124.10988522879458, 123.9272226116071, 61.58708083147317,
                61.58708083147317, 258.29514854771196, 260.75457021484374, 280.5277985253906,
                275.948185765904, 111.06907909458701, 118.87138231445309, 221.36468155133926,
                307.86195445452006, 366.8489324762834, 492.8750778390066, 492.8750778390066,
                294.9255269587053, 282.79803391043527
            ],
            [
                456.64349563895087, 450.8570048730469, 389.9520693708147, 386.87942320312504,
                72.8954315876116, 72.8954315876116, 336.8559607533482, 410.2406672084263,
                528.0254369698661, 552.795792593471, 701.365737015904, 758.7870354617745,
                742.164737297712, 560.9895157073103, 560.9895157073103, 827.9639780566406,
                827.9639780566406, 868.2476088113839
            ]
        ];

    }
    let coords = [];
    for(let i = 0; i < data[0].length; i++) {
        coords.push([data[0][i], data[1][i]])
    }
    $.get(ROOT_PATH + '/data/asset/geo/MacOdrum-LV5-floorplan-web.svg', function (svg) {
        echarts.registerMap('MacOdrum-LV5-floorplan-web', { svg: svg });
        let option = {
            title: {
                text: 'Visit Route',
                left: 'center',
                bottom: 10,
                show: title_display
            },
            tooltip: {},
            geo: {
                map: 'MacOdrum-LV5-floorplan-web',
                roam: true,
                emphasis: {
                    itemStyle: {
                        color: undefined
                    },
                    label: {
                        show: false
                    }
                }
            },
            series: [
                {
                    name: 'Route',
                    type: 'lines',
                    coordinateSystem: 'geo',
                    geoIndex: 0,
                    emphasis: {
                        label: {
                            show: false
                        }
                    },
                    polyline: true,
                    lineStyle: {
                        color: road_color,
                        width: road_width,
                        opacity: 1,
                        type: road_type
                    },
                    effect: {
                        show: true,
                        period: 8,
                        color: '#a10000',
                        constantSpeed: speed,
                        trailLength: 0,
                        symbolSize: [20, 12],
                        symbol:
                            'path://M35.5 40.5c0-22.16 17.84-40 40-40s40 17.84 40 40c0 1.6939-.1042 3.3626-.3067 5H35.8067c-.2025-1.6374-.3067-3.3061-.3067-5zm90.9621-2.6663c-.62-1.4856-.9621-3.1182-.9621-4.8337 0-6.925 5.575-12.5 12.5-12.5s12.5 5.575 12.5 12.5a12.685 12.685 0 0 1-.1529 1.9691l.9537.5506-15.6454 27.0986-.1554-.0897V65.5h-28.7285c-7.318 9.1548-18.587 15-31.2715 15s-23.9535-5.8452-31.2715-15H15.5v-2.8059l-.0937.0437-8.8727-19.0274C2.912 41.5258.5 37.5549.5 33c0-6.925 5.575-12.5 12.5-12.5S25.5 26.075 25.5 33c0 .9035-.0949 1.784-.2753 2.6321L29.8262 45.5h92.2098z'
                    },
                    data: [
                        {
                            coords
                        }
                    ]
                }
            ]
        };
        myChart.setOption(option);
    });
})();