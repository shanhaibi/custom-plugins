(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "title-color",
                alias: "标题颜色",
                type: "color",
                default: "#fff",
                cluster: {title: "标题设置"}
            },
            {
                name: "title-size",
                alias: "字体大小(px)",
                type: "number",
                default: 16,
                cluster: {title: "标题设置"}
            },
            {
                name: "base-map-color",
                alias: "底图颜色",
                type: "color",
                default: "#323c48",
                cluster: { title: "地图设置" }
            },
            {
                name: "boundary-color",
                alias: "分界线颜色",
                type: "color",
                default: "#111",
                cluster: { title: "地图设置" }
            },
            {
                name: "symbol-color",
                alias: "图形颜色",
                type: "color",
                default: "#140f02",
                cluster: { title: "散点设置" }
            },
            {
                name: "symbol-size",
                alias: "图形大小(px)",
                type: "number",
                default: 1,
                cluster: { title: "散点设置" }
            },

        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    const CHUNK_COUNT = 230;
    function fetchData(idx) {
        if (idx >= CHUNK_COUNT) {
            return;
        }
        let dataURL = ROOT_PATH + '/data/asset/data/gps/gps_' + idx + '.bin';
        let xhr = new XMLHttpRequest();
        xhr.open('GET', dataURL, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function (e) {
            let rawData = new Int32Array(this.response);
            let data = new Float32Array(rawData.length);
            for (let i = 0; i < rawData.length; i += 2) {
                data[i] = rawData[i + 1] / 1e7;
                data[i + 1] = rawData[i] / 1e7;
            }
            myChart.appendData({
                seriesIndex: 0,
                data: data
            });
            fetchData(idx + 1);
        };
        xhr.send();
    }
    let option = {
        title: {
            text: '10000000 GPS Points',
            left: 'center',
            textStyle: {
                color: await ShanhaiBI.getSetting("title-color"),
                fontSize: await ShanhaiBI.getSetting("title-size")
            }
        },
        geo: {
            map: 'world',
            roam: true,
            label: {
                emphasis: {
                    show: false
                }
            },
            silent: true,
            itemStyle: {
                normal: {
                    areaColor: await ShanhaiBI.getSetting("base-map-color"),
                    borderColor: await ShanhaiBI.getSetting("boundary-color")
                }
            }
        },
        series: [
            {
                name: '弱',
                type: 'scatterGL',
                progressive: 1e6,
                coordinateSystem: 'geo',
                symbolSize: await ShanhaiBI.getSetting("symbol-size"),
                zoomScale: 0.002,
                blendMode: 'lighter',
                large: true,
                itemStyle: {
                    color: await ShanhaiBI.getSetting("symbol-color")
                },
                postEffect: {
                    enable: true
                },
                silent: true,
                dimensions: ['lng', 'lat'],
                data: new Float32Array()
            }
        ]
    };
    fetchData(0);
    myChart.setOption(option);
})();