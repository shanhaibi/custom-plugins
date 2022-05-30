(async function () {
    await ShanhaiBI.initSettings({
        "format": [
            {
                name: "shape-color",
                alias: "图形颜色",
                type: "palette",
                default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
            },
            {
                name: "line-width",
                alias: "线条宽度(px)",
                type: "number",
                default: 2
            },
            {
                name: "line-type",
                alias: "线段类型",
                type: "select",
                choices: [
                    {
                        label: "实线",
                        value: "solid"
                    },
                    {
                        label: "虚线",
                        value: "dashed"
                    },
                    {
                        label: "点线",
                        value: "dotted"
                    }
                ],
                default: "solid",
            },
            {
                name: "animation-duration",
                alias: "动画持续时间(s)",
                type: "number",
                default: 1
            }
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let line_style = {
        width: await ShanhaiBI.getSetting("line-width"),
        type: await ShanhaiBI.getSetting("line-type")
    }
    let animation_duration = await ShanhaiBI.getSetting("animation-duration");
    let easingFuncs = {
        linear: function (k) {
            return k;
        },
        quadraticIn: function (k) {
            return k * k;
        },
        quadraticOut: function (k) {
            return k * (2 - k);
        },
        quadraticInOut: function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k;
            }
            return -0.5 * (--k * (k - 2) - 1);
        },
        cubicIn: function (k) {
            return k * k * k;
        },
        cubicOut: function (k) {
            return --k * k * k + 1;
        },
        cubicInOut: function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k * k;
            }
            return 0.5 * ((k -= 2) * k * k + 2);
        },
        quarticIn: function (k) {
            return k * k * k * k;
        },
        quarticOut: function (k) {
            return 1 - --k * k * k * k;
        },
        quarticInOut: function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k * k * k;
            }
            return -0.5 * ((k -= 2) * k * k * k - 2);
        },
        quinticIn: function (k) {
            return k * k * k * k * k;
        },
        quinticOut: function (k) {
            return --k * k * k * k * k + 1;
        },
        quinticInOut: function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k * k * k * k;
            }
            return 0.5 * ((k -= 2) * k * k * k * k + 2);
        },
        sinusoidalIn: function (k) {
            return 1 - Math.cos((k * Math.PI) / 2);
        },
        sinusoidalOut: function (k) {
            return Math.sin((k * Math.PI) / 2);
        },
        sinusoidalInOut: function (k) {
            return 0.5 * (1 - Math.cos(Math.PI * k));
        },
        exponentialIn: function (k) {
            return k === 0 ? 0 : Math.pow(1024, k - 1);
        },
        exponentialOut: function (k) {
            return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
        },
        exponentialInOut: function (k) {
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            if ((k *= 2) < 1) {
                return 0.5 * Math.pow(1024, k - 1);
            }
            return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
        },
        circularIn: function (k) {
            return 1 - Math.sqrt(1 - k * k);
        },
        circularOut: function (k) {
            return Math.sqrt(1 - --k * k);
        },
        circularInOut: function (k) {
            if ((k *= 2) < 1) {
                return -0.5 * (Math.sqrt(1 - k * k) - 1);
            }
            return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
        },
        elasticIn: function (k) {
            let s;
            let a = 0.1;
            let p = 0.4;
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            if (!a || a < 1) {
                a = 1;
                s = p / 4;
            } else {
                s = (p * Math.asin(1 / a)) / (2 * Math.PI);
            }
            return -(
                a *
                Math.pow(2, 10 * (k -= 1)) *
                Math.sin(((k - s) * (2 * Math.PI)) / p)
            );
        },
        elasticOut: function (k) {
            let s;
            let a = 0.1;
            let p = 0.4;
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            if (!a || a < 1) {
                a = 1;
                s = p / 4;
            } else {
                s = (p * Math.asin(1 / a)) / (2 * Math.PI);
            }
            return (
                a * Math.pow(2, -10 * k) * Math.sin(((k - s) * (2 * Math.PI)) / p) + 1
            );
        },
        elasticInOut: function (k) {
            let s;
            let a = 0.1;
            let p = 0.4;
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            if (!a || a < 1) {
                a = 1;
                s = p / 4;
            } else {
                s = (p * Math.asin(1 / a)) / (2 * Math.PI);
            }
            if ((k *= 2) < 1) {
                return (
                    -0.5 *
                    (a *
                        Math.pow(2, 10 * (k -= 1)) *
                        Math.sin(((k - s) * (2 * Math.PI)) / p))
                );
            }
            return (
                a *
                Math.pow(2, -10 * (k -= 1)) *
                Math.sin(((k - s) * (2 * Math.PI)) / p) *
                0.5 +
                1
            );
        },
        // 在某一动画开始沿指示的路径进行动画处理前稍稍收回该动画的移动
        backIn: function (k) {
            let s = 1.70158;
            return k * k * ((s + 1) * k - s);
        },
        backOut: function (k) {
            let s = 1.70158;
            return --k * k * ((s + 1) * k + s) + 1;
        },
        backInOut: function (k) {
            let s = 1.70158 * 1.525;
            if ((k *= 2) < 1) {
                return 0.5 * (k * k * ((s + 1) * k - s));
            }
            return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
        },
        // 创建弹跳效果
        bounceIn: function (k) {
            return 1 - easingFuncs.bounceOut(1 - k);
        },
        bounceOut: function (k) {
            if (k < 1 / 2.75) {
                return 7.5625 * k * k;
            } else if (k < 2 / 2.75) {
                return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
            } else if (k < 2.5 / 2.75) {
                return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
            } else {
                return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
            }
        },
        bounceInOut: function (k) {
            if (k < 0.5) {
                return easingFuncs.bounceIn(k * 2) * 0.5;
            }
            return easingFuncs.bounceOut(k * 2 - 1) * 0.5 + 0.5;
        }
    };
    let N_POINT = 30;
    let grids = [];
    let xAxes = [];
    let yAxes = [];
    let series = [];
    let titles = [];
    let count = 0;
    Object.keys(easingFuncs).forEach(function (easingName) {
        let easingFunc = easingFuncs[easingName];
        let data = [];
        for (let i = 0; i <= N_POINT; i++) {
            let x = i / N_POINT;
            let y = easingFunc(x);
            data.push([x, y]);
        }
        grids.push({
            show: true,
            borderWidth: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 2
        });
        xAxes.push({
            type: 'value',
            show: false,
            min: 0,
            max: 1,
            gridIndex: count
        });
        yAxes.push({
            type: 'value',
            show: false,
            min: -0.4,
            max: 1.4,
            gridIndex: count
        });
        series.push({
            name: easingName,
            type: 'line',
            xAxisIndex: count,
            yAxisIndex: count,
            data: data,
            lineStyle: line_style,
            showSymbol: false,
            animationEasing: easingName,
            animationDuration: animation_duration * 1000
        });
        titles.push({
            textAlign: 'center',
            text: easingName,
            textStyle: {
                fontSize: 12,
                fontWeight: 'normal'
            }
        });
        count++;
    });
    let rowNumber = Math.ceil(Math.sqrt(count));
    grids.forEach(function (grid, idx) {
        grid.left = ((idx % rowNumber) / rowNumber) * 100 + 0.5 + '%';
        grid.top = (Math.floor(idx / rowNumber) / rowNumber) * 100 + 0.5 + '%';
        grid.width = (1 / rowNumber) * 100 - 1 + '%';
        grid.height = (1 / rowNumber) * 100 - 1 + '%';
        titles[idx].left = parseFloat(grid.left) + parseFloat(grid.width) / 2 + '%';
        titles[idx].top = parseFloat(grid.top) + '%';
        titles[idx].textStyle = {
            color: "#aaa",
            fontSize: 12,
            fontWeight: "normal"
        }
    });
    let option = {
        color: await ShanhaiBI.getSetting("shape-color"),
        title: titles.concat([
            {
                text: 'Different Easing Functions',
                top: 'bottom',
                left: 'center',
            }
        ]),
        grid: grids,
        xAxis: xAxes,
        yAxis: yAxes,
        series: series
    };
    myChart.setOption(option);
})();