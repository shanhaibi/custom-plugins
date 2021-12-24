(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "line-color",
                alias: "线条颜色",
                type: "color",
                default: "#f7a200"
            },
            {
                name: "opacity",
                alias: "透明度",
                type: "number",
                default: 0.3
            }
        ]
    })

    let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let CHUNK_COUNT = 32;
    let dataCount = 0;
    function fetchData(idx) {
        if (idx >= CHUNK_COUNT) {
            return;
        }
        let dataURL = ROOT_PATH + '/data/asset/data/links-ny/links_ny_' + idx + '.bin';
        let xhr = new XMLHttpRequest();
        xhr.open('GET', dataURL, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function (e) {
            let rawData = new Float32Array(this.response);
            let data = new Float64Array(rawData.length - 2);
            let offsetX = rawData[0];
            let offsetY = rawData[1];
            let off = 0;
            let addedDataCount = 0;
            for (let i = 2; i < rawData.length;) {
                let count = rawData[i++];
                data[off++] = count;
                for (let k = 0; k < count; k++) {
                    let x = rawData[i++] + offsetX;
                    let y = rawData[i++] + offsetY;
                    data[off++] = x;
                    data[off++] = y;
                    addedDataCount++;
                }
            }
            myChart.appendData({
                seriesIndex: 0,
                data: data
            });
            dataCount += addedDataCount;
            fetchData(idx + 1);
        };
        xhr.send();
    }
    let option = {
        progressive: 20000,
        geo: {
            center: [-74.04327099998152, 40.86737600240287],
            zoom: 360,
            map: 'world',
            roam: true,
            silent: true,
            itemStyle: {
                normal: {
                    color: 'transparent',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1
                }
            }
        },
        series: [
            {
                type: 'linesGL',
                coordinateSystem: 'geo',
                blendMode: 'lighter',
                dimensions: ['value'],
                data: new Float64Array(),
                polyline: true,
                large: true,
                lineStyle: {
                    color: await ShanhaiBI.getSetting("line-color"),
                    opacity: await ShanhaiBI.getSetting("opacity")
                }
            }
        ]
    };
    fetchData(0);
    myChart.setOption(option);
})();