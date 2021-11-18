(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "start-color",
                alias: "起始颜色",
                type: "color",
                default: "#dbac00"
            },
            {
                name: "transitional-color",
                alias: "过渡颜色",
                type: "color",
                default: "#db6e00"
            },
            {
                name: "end-color",
                alias: "结束颜色",
                type: "color",
                default: "#db0000"
            },
        ]
    })
    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let start_color = await ShanhaiBI.getSetting("start-color");
    let transitional_color = await ShanhaiBI.getSetting("transitional-color");
    let end_color = await ShanhaiBI.getSetting("end-color");

    $.get(ROOT_PATH + '/data/asset/geo/Beef_cuts_France.svg', function (svg) {
        echarts.registerMap('Beef_cuts_France', { svg: svg });
        let option = {
            tooltip: {},
            visualMap: {
                left: 'center',
                bottom: '10%',
                min: 5,
                max: 100,
                orient: 'horizontal',
                text: ['', 'Price'],
                realtime: true,
                calculable: true,
                inRange: {
                    color: [start_color, transitional_color, end_color]
                }
            },
            series: [
                {
                    name: 'French Beef Cuts',
                    type: 'map',
                    map: 'Beef_cuts_France',
                    roam: true,
                    emphasis: {
                        label: {
                            show: false
                        }
                    },
                    selectedMode: false,
                    data: [
                        { name: 'Queue', value: 15 },
                        { name: 'Langue', value: 35 },
                        { name: 'Plat de joue', value: 15 },
                        { name: 'Gros bout de poitrine', value: 25 },
                        { name: 'Jumeau à pot-au-feu', value: 45 },
                        { name: 'Onglet', value: 85 },
                        { name: 'Plat de tranche', value: 25 },
                        { name: 'Araignée', value: 15 },
                        { name: 'Gîte à la noix', value: 55 },
                        { name: "Bavette d'aloyau", value: 25 },
                        { name: 'Tende de tranche', value: 65 },
                        { name: 'Rond de gîte', value: 45 },
                        { name: 'Bavettede de flanchet', value: 85 },
                        { name: 'Flanchet', value: 35 },
                        { name: 'Hampe', value: 75 },
                        { name: 'Plat de côtes', value: 65 },
                        { name: 'Tendron Milieu de poitrine', value: 65 },
                        { name: 'Macreuse à pot-au-feu', value: 85 },
                        { name: 'Rumsteck', value: 75 },
                        { name: 'Faux-filet', value: 65 },
                        { name: 'Côtes Entrecôtes', value: 55 },
                        { name: 'Basses côtes', value: 45 },
                        { name: 'Collier', value: 85 },
                        { name: 'Jumeau à biftek', value: 15 },
                        { name: 'Paleron', value: 65 },
                        { name: 'Macreuse à bifteck', value: 45 },
                        { name: 'Gîte', value: 85 },
                        { name: 'Aiguillette baronne', value: 65 },
                        { name: 'Filet', value: 95 }
                    ]
                }
            ]
        };
        myChart.setOption(option);
    });

})();