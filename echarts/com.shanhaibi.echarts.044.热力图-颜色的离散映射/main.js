(async function () {
    await ShanhaiBI.initSettings({
        "fields": [
            {
                name: "axis-x",
                alias: "x轴字段",
                type: "axis",
            },
            {
                name: "axis-y",
                alias: "y轴字段",
                type: "axis"
            }
        ],
        "format": [
            {
                name: "legend",
                alias: "图例",
                type: "boolean",
                default: true
            },
            {
                name: "data-color",
                alias: "数据颜色",
                type: "palette",
                default: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
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
                default: 1
            },
        ]
    })

    let dom = document.getElementById("container");
    let myChart = echarts.init(dom);

    let xData = [];
    let yData = [];

    let data_raw = await ShanhaiBI.getData();
    let x_data = data_raw.getColumn("axis-x");
    let y_data = data_raw.getColumns("axis-y");
    let data = [];
    if (x_data.length && y_data.length) {
        let y_axis = await ShanhaiBI.getSetting("axis-y");
        for (let i = 0; i < y_data.length; i++) {
            xData.push(y_axis[i].alias);
            for (let j = 0; j < y_data[i].length; j++) {
                if (i === 0) {
                    yData.push(j);
                }
                data.push([i, j, y_data[i][j] || 0]);
            }
        }
    } else {
        let noise = getNoiseHelper();
        noise.seed(Math.random());
        data = generateData(noise);
    }
    let option = {
        tooltip: {},
        grid: {
            right: 140,
            left: 40
        },
        xAxis: {
            type: 'category',
            data: xData
        },
        yAxis: {
            type: 'category',
            data: yData
        },
        visualMap: {
            type: 'piecewise',
            min: await ShanhaiBI.getSetting("min-value"),
            max: await ShanhaiBI.getSetting("max-value"),
            left: 'right',
            top: 'center',
            textStyle: {
                color: "#aaa"
            },
            calculable: true,
            realtime: false,
            show: await ShanhaiBI.getSetting("legend"),
            splitNumber: 8,
            inRange: {
                color: await ShanhaiBI.getSetting("data-color")
            }
        },
        series: [
            {
                name: 'Gaussian',
                type: 'heatmap',
                data: data,
                emphasis: {
                    itemStyle: {
                        borderColor: '#333',
                        borderWidth: 1
                    }
                },
                progressive: 1000,
                animation: false
            }
        ]
    };
    myChart.setOption(option);

    function generateData(noise) {
        let data = [];
        for (let i = 0; i <= 200; i++) {
            for (let j = 0; j <= 100; j++) {
                // let x = (max - min) * i / 200 + min;
                // let y = (max - min) * j / 100 + min;
                data.push([i, j, noise.perlin2(i / 40, j / 20) + 0.5]);
                // data.push([i, j, normalDist(theta, x) * normalDist(theta, y)]);
            }
            xData.push(i);
        }
        for (let j = 0; j < 100; j++) {
            yData.push(j);
        }
        return data;
    }
    ///////////////////////////////////////////////////////////////////////////
    // Simplex and perlin noise helper from https://github.com/josephg/noisejs
    ///////////////////////////////////////////////////////////////////////////
    function getNoiseHelper() {
        let module = {};
        function Grad(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        Grad.prototype.dot2 = function (x, y) {
            return this.x * x + this.y * y;
        };
        Grad.prototype.dot3 = function (x, y, z) {
            return this.x * x + this.y * y + this.z * z;
        };
        let grad3 = [
            new Grad(1, 1, 0),
            new Grad(-1, 1, 0),
            new Grad(1, -1, 0),
            new Grad(-1, -1, 0),
            new Grad(1, 0, 1),
            new Grad(-1, 0, 1),
            new Grad(1, 0, -1),
            new Grad(-1, 0, -1),
            new Grad(0, 1, 1),
            new Grad(0, -1, 1),
            new Grad(0, 1, -1),
            new Grad(0, -1, -1)
        ];
        let p = [
            151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
            36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120,
            234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
            88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71,
            134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133,
            230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161,
            1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130,
            116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250,
            124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227,
            47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44,
            154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98,
            108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34,
            242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14,
            239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121,
            50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243,
            141, 128, 195, 78, 66, 215, 61, 156, 180
        ];
        // To remove the need for index wrapping, double the permutation table length
        let perm = new Array(512);
        let gradP = new Array(512);
        // This isn't a very good seeding function, but it works ok. It supports 2^16
        // different seed values. Write something better if you need more seeds.
        module.seed = function (seed) {
            if (seed > 0 && seed < 1) {
                // Scale the seed out
                seed *= 65536;
            }
            seed = Math.floor(seed);
            if (seed < 256) {
                seed |= seed << 8;
            }
            for (let i = 0; i < 256; i++) {
                let v;
                if (i & 1) {
                    v = p[i] ^ (seed & 255);
                } else {
                    v = p[i] ^ ((seed >> 8) & 255);
                }
                perm[i] = perm[i + 256] = v;
                gradP[i] = gradP[i + 256] = grad3[v % 12];
            }
        };
        module.seed(0);
        /*
          for(let i=0; i<256; i++) {
            perm[i] = perm[i + 256] = p[i];
            gradP[i] = gradP[i + 256] = grad3[perm[i] % 12];
          }*/
        // Skewing and unskewing factors for 2, 3, and 4 dimensions
        let F2 = 0.5 * (Math.sqrt(3) - 1);
        let G2 = (3 - Math.sqrt(3)) / 6;
        let F3 = 1 / 3;
        let G3 = 1 / 6;
        // 2D simplex noise
        module.simplex2 = function (xin, yin) {
            let n0, n1, n2; // Noise contributions from the three corners
            // Skew the input space to determine which simplex cell we're in
            let s = (xin + yin) * F2; // Hairy factor for 2D
            let i = Math.floor(xin + s);
            let j = Math.floor(yin + s);
            let t = (i + j) * G2;
            let x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.
            let y0 = yin - j + t;
            // For the 2D case, the simplex shape is an equilateral triangle.
            // Determine which simplex we are in.
            let i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
            if (x0 > y0) {
                // lower triangle, XY order: (0,0)->(1,0)->(1,1)
                i1 = 1;
                j1 = 0;
            } else {
                // upper triangle, YX order: (0,0)->(0,1)->(1,1)
                i1 = 0;
                j1 = 1;
            }
            // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
            // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
            // c = (3-sqrt(3))/6
            let x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
            let y1 = y0 - j1 + G2;
            let x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
            let y2 = y0 - 1 + 2 * G2;
            // Work out the hashed gradient indices of the three simplex corners
            i &= 255;
            j &= 255;
            let gi0 = gradP[i + perm[j]];
            let gi1 = gradP[i + i1 + perm[j + j1]];
            let gi2 = gradP[i + 1 + perm[j + 1]];
            // Calculate the contribution from the three corners
            let t0 = 0.5 - x0 * x0 - y0 * y0;
            if (t0 < 0) {
                n0 = 0;
            } else {
                t0 *= t0;
                n0 = t0 * t0 * gi0.dot2(x0, y0); // (x,y) of grad3 used for 2D gradient
            }
            let t1 = 0.5 - x1 * x1 - y1 * y1;
            if (t1 < 0) {
                n1 = 0;
            } else {
                t1 *= t1;
                n1 = t1 * t1 * gi1.dot2(x1, y1);
            }
            let t2 = 0.5 - x2 * x2 - y2 * y2;
            if (t2 < 0) {
                n2 = 0;
            } else {
                t2 *= t2;
                n2 = t2 * t2 * gi2.dot2(x2, y2);
            }
            // Add contributions from each corner to get the final noise value.
            // The result is scaled to return values in the interval [-1,1].
            return 70 * (n0 + n1 + n2);
        };
        // 3D simplex noise
        module.simplex3 = function (xin, yin, zin) {
            let n0, n1, n2, n3; // Noise contributions from the four corners
            // Skew the input space to determine which simplex cell we're in
            let s = (xin + yin + zin) * F3; // Hairy factor for 2D
            let i = Math.floor(xin + s);
            let j = Math.floor(yin + s);
            let k = Math.floor(zin + s);
            let t = (i + j + k) * G3;
            let x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.
            let y0 = yin - j + t;
            let z0 = zin - k + t;
            // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
            // Determine which simplex we are in.
            let i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
            let i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
            if (x0 >= y0) {
                if (y0 >= z0) {
                    i1 = 1;
                    j1 = 0;
                    k1 = 0;
                    i2 = 1;
                    j2 = 1;
                    k2 = 0;
                } else if (x0 >= z0) {
                    i1 = 1;
                    j1 = 0;
                    k1 = 0;
                    i2 = 1;
                    j2 = 0;
                    k2 = 1;
                } else {
                    i1 = 0;
                    j1 = 0;
                    k1 = 1;
                    i2 = 1;
                    j2 = 0;
                    k2 = 1;
                }
            } else {
                if (y0 < z0) {
                    i1 = 0;
                    j1 = 0;
                    k1 = 1;
                    i2 = 0;
                    j2 = 1;
                    k2 = 1;
                } else if (x0 < z0) {
                    i1 = 0;
                    j1 = 1;
                    k1 = 0;
                    i2 = 0;
                    j2 = 1;
                    k2 = 1;
                } else {
                    i1 = 0;
                    j1 = 1;
                    k1 = 0;
                    i2 = 1;
                    j2 = 1;
                    k2 = 0;
                }
            }
            // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
            // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
            // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
            // c = 1/6.
            let x1 = x0 - i1 + G3; // Offsets for second corner
            let y1 = y0 - j1 + G3;
            let z1 = z0 - k1 + G3;
            let x2 = x0 - i2 + 2 * G3; // Offsets for third corner
            let y2 = y0 - j2 + 2 * G3;
            let z2 = z0 - k2 + 2 * G3;
            let x3 = x0 - 1 + 3 * G3; // Offsets for fourth corner
            let y3 = y0 - 1 + 3 * G3;
            let z3 = z0 - 1 + 3 * G3;
            // Work out the hashed gradient indices of the four simplex corners
            i &= 255;
            j &= 255;
            k &= 255;
            let gi0 = gradP[i + perm[j + perm[k]]];
            let gi1 = gradP[i + i1 + perm[j + j1 + perm[k + k1]]];
            let gi2 = gradP[i + i2 + perm[j + j2 + perm[k + k2]]];
            let gi3 = gradP[i + 1 + perm[j + 1 + perm[k + 1]]];
            // Calculate the contribution from the four corners
            let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
            if (t0 < 0) {
                n0 = 0;
            } else {
                t0 *= t0;
                n0 = t0 * t0 * gi0.dot3(x0, y0, z0); // (x,y) of grad3 used for 2D gradient
            }
            let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
            if (t1 < 0) {
                n1 = 0;
            } else {
                t1 *= t1;
                n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
            }
            let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
            if (t2 < 0) {
                n2 = 0;
            } else {
                t2 *= t2;
                n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
            }
            let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
            if (t3 < 0) {
                n3 = 0;
            } else {
                t3 *= t3;
                n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
            }
            // Add contributions from each corner to get the final noise value.
            // The result is scaled to return values in the interval [-1,1].
            return 32 * (n0 + n1 + n2 + n3);
        };
        // ##### Perlin noise stuff
        function fade(t) {
            return t * t * t * (t * (t * 6 - 15) + 10);
        }
        function lerp(a, b, t) {
            return (1 - t) * a + t * b;
        }
        // 2D Perlin Noise
        module.perlin2 = function (x, y) {
            // Find unit grid cell containing point
            let X = Math.floor(x),
                Y = Math.floor(y);
            // Get relative xy coordinates of point within that cell
            x = x - X;
            y = y - Y;
            // Wrap the integer cells at 255 (smaller integer period can be introduced here)
            X = X & 255;
            Y = Y & 255;
            // Calculate noise contributions from each of the four corners
            let n00 = gradP[X + perm[Y]].dot2(x, y);
            let n01 = gradP[X + perm[Y + 1]].dot2(x, y - 1);
            let n10 = gradP[X + 1 + perm[Y]].dot2(x - 1, y);
            let n11 = gradP[X + 1 + perm[Y + 1]].dot2(x - 1, y - 1);
            // Compute the fade curve value for x
            let u = fade(x);
            // Interpolate the four results
            return lerp(lerp(n00, n10, u), lerp(n01, n11, u), fade(y));
        };
        // 3D Perlin Noise
        module.perlin3 = function (x, y, z) {
            // Find unit grid cell containing point
            let X = Math.floor(x),
                Y = Math.floor(y),
                Z = Math.floor(z);
            // Get relative xyz coordinates of point within that cell
            x = x - X;
            y = y - Y;
            z = z - Z;
            // Wrap the integer cells at 255 (smaller integer period can be introduced here)
            X = X & 255;
            Y = Y & 255;
            Z = Z & 255;
            // Calculate noise contributions from each of the eight corners
            let n000 = gradP[X + perm[Y + perm[Z]]].dot3(x, y, z);
            let n001 = gradP[X + perm[Y + perm[Z + 1]]].dot3(x, y, z - 1);
            let n010 = gradP[X + perm[Y + 1 + perm[Z]]].dot3(x, y - 1, z);
            let n011 = gradP[X + perm[Y + 1 + perm[Z + 1]]].dot3(x, y - 1, z - 1);
            let n100 = gradP[X + 1 + perm[Y + perm[Z]]].dot3(x - 1, y, z);
            let n101 = gradP[X + 1 + perm[Y + perm[Z + 1]]].dot3(x - 1, y, z - 1);
            let n110 = gradP[X + 1 + perm[Y + 1 + perm[Z]]].dot3(x - 1, y - 1, z);
            let n111 = gradP[X + 1 + perm[Y + 1 + perm[Z + 1]]].dot3(
                x - 1,
                y - 1,
                z - 1
            );
            // Compute the fade curve value for x, y, z
            let u = fade(x);
            let v = fade(y);
            let w = fade(z);
            // Interpolate
            return lerp(
                lerp(lerp(n000, n100, u), lerp(n001, n101, u), w),
                lerp(lerp(n010, n110, u), lerp(n011, n111, u), w),
                v
            );
        };
        return module;
    }
})();