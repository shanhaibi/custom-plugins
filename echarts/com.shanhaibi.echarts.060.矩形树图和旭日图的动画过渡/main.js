(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "loop-interval",
                alias: "循环间隔(s)",
                type: "number",
                default: 3
            },
            {
                name: "animation-duration",
                alias: "动画持续时间(s)",
                type: "number",
                default: 1
            },
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
            },
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let shape_color = await ShanhaiBI.getSetting("shape-color");
    let loop_interval = await ShanhaiBI.getSetting("loop-interval");
    let animation_duration = await ShanhaiBI.getSetting("animation-duration");

    $.getJSON(ROOT_PATH + '/data/asset/data/echarts-package-size.json', function (data) {
        let treemapOption = {
            color: shape_color,
            series: [
                {
                    type: 'treemap',
                    id: 'echarts-package-size',
                    animationDurationUpdate: animation_duration * 1000,
                    roam: false,
                    nodeClick: undefined,
                    data: data.children,
                    universalTransition: true,
                    label: {
                        show: true
                    },
                    breadcrumb: {
                        show: false
                    }
                }
            ]
        };
        let sunburstOption = {
            color: shape_color,
            series: [
                {
                    type: 'sunburst',
                    id: 'echarts-package-size',
                    radius: ['20%', '90%'],
                    animationDurationUpdate: animation_duration * 1000,
                    nodeClick: undefined,
                    data: data.children,
                    universalTransition: true,
                    itemStyle: {
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,.5)'
                    },
                    label: {
                        show: false
                    }
                }
            ]
        };
        let currentOption = treemapOption;
        myChart.setOption(currentOption);
        setInterval(function () {
            currentOption =
                currentOption === treemapOption ? sunburstOption : treemapOption;
            myChart.setOption(currentOption);
        }, (loop_interval + animation_duration) * 1000);
    }
    );
})()