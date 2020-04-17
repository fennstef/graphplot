export function getGridPointDist(min, max, factor) {
    const diff = max - min;
    let result = Math.pow(10.0, Math.ceil(Math.log(diff) / Math.log(10.0)) - 1);
    switch (diff / result) {
        case 7:
        case 6:
        case 5:
        case 4:
            result /= 2;
            break;
        case 3:
            result /= 4;
            break;
        case 2:
            result /= 5;
            break;
        case 1:
            result /= 10;
            break;
    }
    result *= factor;
    return result;
}

export function clear(c) {
    c.ctx.clearRect(0, 0, c.ctx.canvas.width, c.ctx.canvas.height);
}

export function drawGrid(c, xFactor, yFactor, axisColor, gridColor) {
    clear(c);
    const xDiff = c.xMax - c.xMin;
    const xPixPerUnit = c.ctx.canvas.width / xDiff;
    const yDiff = c.yMax - c.yMin;
    const yPixPerUnit = c.ctx.canvas.height / yDiff;
    xFactor = xFactor || 1;
    yFactor = yFactor || 1;
    const xF = getGridPointDist(c.xMin, c.xMax, xFactor);
    const yF = getGridPointDist(c.yMin, c.yMax, yFactor);
    axisColor = axisColor || "#000000";
    gridColor = gridColor || "#b0b0b0";

    {
        let startValue = Math.ceil(c.xMin / xF) * xF;
        let number = Math.round(Math.floor(xDiff / xF)) + 1;
        let axisPosition;
        if (c.yMin < 0 && c.yMax > 0) {
            axisPosition = c.ctx.canvas.height + c.yMin * yPixPerUnit + 12;
        } else {
            axisPosition = c.ctx.canvas.height - 12;
        }
        c.ctx.strokeStyle = gridColor;
        for (let i = 0; i < number; i++) {
            if (Math.abs(startValue) < xF * 0.5) {
                c.ctx.strokeStyle = axisColor;
            }
            const position = Math.round((startValue - c.xMin) * xPixPerUnit);
            drawLine(c.ctx, position, 0, position, c.ctx.canvas.height);
            c.ctx.fillStyle = axisColor;
            const text = Math.round(startValue * 100) / 100;
            c.ctx.fillText(text + '', position + 4, axisPosition);
            c.ctx.strokeStyle = gridColor;
            startValue += xF;
        }
    }

    {
        let startValue = Math.ceil(c.yMin / yF) * yF;
        const number = Math.round(Math.floor(yDiff / yF)) + 1;
        let axisPosition;
        if (c.xMin < 0 && c.xMax > 0) {
            axisPosition = -c.xMin * xPixPerUnit + 5;
        } else {
            axisPosition = 5;
        }
        c.ctx.strokeStyle = gridColor;
        for (let i = 0; i < number; i++) {
            if (Math.abs(startValue) < yF * 0.5) {
                c.ctx.strokeStyle = axisColor;
            }
            const position = c.ctx.canvas.height - Math.round((startValue - c.yMin) * yPixPerUnit);
            drawLine(c.ctx, 0, position, c.ctx.canvas.width, position);
            c.ctx.fillStyle = axisColor;
            const text = Math.round(startValue * 100) / 100;
            c.ctx.fillText(text + '', axisPosition, position - 4);
            c.ctx.strokeStyle = gridColor;
            startValue += yF;
        }
    }
}

export function xCoordToPix(c, xCoord) {
    const xDiff = c.xMax - c.xMin;
    const xPixPerUnit = c.ctx.canvas.width / xDiff;
    return (xCoord - c.xMin) * xPixPerUnit;
}

export function yCoordToPix(c, yCoord) {
    const yDiff = c.yMax - c.yMin;
    const yPixPerUnit = c.ctx.canvas.height / yDiff;
    return c.ctx.canvas.height - (yCoord - c.yMin) * yPixPerUnit;
}

export function xPixToCoord(c, xPix) {
    const xDiff = c.xMax - c.xMin;
    const xPixPerUnit = c.ctx.canvas.width / xDiff;
    return xPix / xPixPerUnit + c.xMin;
}

export function yPixToCoord(c, yPix) {
    const yDiff = c.yMax - c.yMin;
    const yPixPerUnit = c.ctx.canvas.height / yDiff;
    return -(yPix - c.ctx.canvas.height) / yPixPerUnit + c.yMin;
}

export function drawLine(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

export function drawFunction(c, strokeStyle, func) {
    clear(c);
    c.ctx.strokeStyle = strokeStyle;
    c.ctx.lineWidth = 3;
    c.ctx.beginPath();
    for (let w = 0; w <= c.ctx.canvas.width; w++) {
        const y = func(xPixToCoord(c, w));
        const h = yCoordToPix(c, y);
        if (w === 0) {
            c.ctx.moveTo(w, h);
            continue;
        }
        c.ctx.lineTo(w, h);
    }
    c.ctx.stroke();
}

export function getGradientVector(colorMapIndex, levels) {
    const gradientColors1 = {
        0.0: "rgb(51, 59, 126)",
        0.05: "rgb(45, 74, 138)",
        0.1: "rgb(38, 89, 149)",
        0.15: "rgb(28, 116, 174)",
        0.2: "rgb(18, 142, 186)",
        0.25: "rgb(19, 158, 198)",
        0.3: "rgb(22, 161, 191)",
        0.35: "rgb(28, 160, 163)",
        0.4: "rgb(47, 157, 119)",
        0.45: "rgb(86, 156,66)",
        0.5: "rgb(121, 162, 43)",
        0.55: "rgb(162, 172, 29)",
        0.6: "rgb(194, 184, 22)",
        0.65: "rgb(216, 194, 17)",
        0.7: "rgb(223, 204, 15)",
        0.75: "rgb(238, 201, 15)",
        0.8: "rgb(237, 180, 17)",
        0.85: "rgb(236, 144, 19)",
        0.9: "rgb(228, 96, 25)",
        0.95: "rgb(221, 60, 30)",
        1.0: "rgb(221, 49, 33)"
    };
    const gradientColors2 = {
        0.0: "rgb(204, 196, 129)",
        0.05: "rgb(210, 181, 117)",
        0.1: "rgb(217, 166, 106)",
        0.15: "rgb(227, 139, 81)",
        0.2: "rgb(237, 113, 69)",
        0.25: "rgb(236, 97, 57)",
        0.3: "rgb(233, 94, 64)",
        0.35: "rgb(227, 95, 92)",
        0.4: "rgb(208, 98, 136)",
        0.45: "rgb(169, 99, 189)",
        0.5: "rgb(134, 93, 212)",
        0.55: "rgb(93, 83, 226)",
        0.6: "rgb(61, 71, 233)",
        0.65: "rgb(39, 61, 238)",
        0.7: "rgb(32, 51, 240)",
        0.75: "rgb(17, 54, 240)",
        0.8: "rgb(18, 75, 238)",
        0.85: "rgb(19, 111, 236)",
        0.9: "rgb(27, 159, 230)",
        0.95: "rgb(34, 195, 225)",
        1.0: "rgb(34, 206, 222)"
    };
    const gradientColors3 = {
        0.0: "rgb(51, 0, 102)",
        0.5: "rgb(0, 0, 128)",
        1.0: "rgb(204, 255, 255)"
    };
    const gradientColors4 = {
        0.0: "rgb(102, 0, 0)",
        0.5: "rgb(102, 0, 0)",
        1.0: "rgb(255, 102, 0)"
    };
    const gradientColors5 = {
        0.0: "rgb(0, 0, 0)",
        0.05: "rgb(0, 0, 0)",
        0.05001: "rgb(255, 255, 255)",
        0.1: "rgb(255, 255, 255)",
        0.10001: "rgb(0, 0, 0)",
        0.15: "rgb(0, 0, 0)",
        0.15001: "rgb(255, 255, 255)",
        0.2: "rgb(255, 255, 255)",
        0.20001: "rgb(0, 0, 0)",
        0.25: "rgb(0, 0, 0)",
        0.25001: "rgb(255, 255, 255)",
        0.3: "rgb(255, 255, 255)",
        0.30001: "rgb(0, 0, 0)",
        0.35: "rgb(0, 0, 0)",
        0.35001: "rgb(255, 255, 255)",
        0.4: "rgb(255, 255, 255)",
        0.40001: "rgb(0, 0, 0)",
        0.45: "rgb(0, 0, 0)",
        0.45001: "rgb(255, 255, 255)",
        0.5: "rgb(255, 255, 255)",
        0.50001: "rgb(0, 0, 0)",
        0.55: "rgb(0, 0, 0)",
        0.55001: "rgb(255, 255, 255)",
        0.6: "rgb(255, 255, 255)",
        0.60001: "rgb(0, 0, 0)",
        0.65: "rgb(0, 0, 0)",
        0.65001: "rgb(255, 255, 255)",
        0.7: "rgb(255, 255, 255)",
        0.70001: "rgb(0, 0, 0)",
        0.75: "rgb(0, 0, 0)",
        0.75001: "rgb(255, 255, 255)",
        0.8: "rgb(255, 255, 255)",
        0.80001: "rgb(0, 0, 0)",
        0.85: "rgb(0, 0, 0)",
        0.85001: "rgb(255, 255, 255)",
        0.9: "rgb(255, 255, 255)",
        0.90001: "rgb(0, 0, 0)",
        0.95: "rgb(0, 0, 0)",
        0.95001: "rgb(255, 255, 255)",
        1.0: "rgb(255, 255, 255)"
    };
    const gradientColors6 = {
        0.0: "rgb(120, 28, 23)",
        0.5: "rgb(224, 137, 0)",
        1.0: "rgb(224, 206, 0)"
    };
    const gradientColors7 = {
        0.0: "rgb(55, 14, 77)",
        0.5: "rgb(128, 9, 14)",
        1.0: "rgb(115, 143, 79)"
    };
    const gradientColors8 = {
        0.0: "rgb(109, 79, 143)",
        0.33: "rgb(143, 79, 79)",
        0.66: "rgb(122, 76, 47)",
        1.0: "rgb(142, 143, 79)"
    };
    const gradientColors9 = {
        0:'#ff3800',
        0.1429:'#ff6500',
        0.2857:'#ffa54f',
        0.4286:'#ffc78f',
        0.5714:'#ffe1c6',
        0.7143:'#fef9ff',
        0.8571:'#c9d9ff',
        1:'#9fbfff'
    };

    const gradientColorList = [
        gradientColors1,
        gradientColors2,
        gradientColors3,
        gradientColors4,
        gradientColors5,
        gradientColors6,
        gradientColors7,
        gradientColors8,
        gradientColors9
    ];

    const gradientColors = gradientColorList[colorMapIndex];

    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = levels;
    const ctx2 = canvas.getContext("2d");
    const gradient = ctx2.createLinearGradient(0, 0, 0, levels);
    for (let pos of Object.keys(gradientColors)) {
        gradient.addColorStop(parseFloat(pos), gradientColors[pos]);
    }
    ctx2.fillStyle = gradient;
    ctx2.fillRect(0, 0, 1, levels);
    return ctx2.getImageData(0, 0, 1, levels).data;
}

export function draw3dFunction(c, zMin, zMax, alpha, gv, func) {
    clear(c);
    const data = c.ctx.createImageData(c.ctx.canvas.width, c.ctx.canvas.height);

    let w = 0;
    let h = -1;

    const drawInTimeSlot = function () {
        const start = +new Date();
        while (+new Date() - start < 70) {
            if (w >= c.ctx.canvas.width) {
                break;
            }
            h++;
            if (h === c.ctx.canvas.height + 1) {
                w++;
                h = 0;
            }
            const z = func(xPixToCoord(c, w), yPixToCoord(c, h));
            const pixelCount = gv.length / 4;
            let gradientIndex = Math.round(((z - zMin) / (zMax - zMin)) * pixelCount);
            if (gradientIndex < 0) {
                gradientIndex = 0;
            }
            if (gradientIndex >= pixelCount) {
                gradientIndex = pixelCount - 1;
            }
            const r = gv[gradientIndex * 4];
            const g = gv[gradientIndex * 4 + 1];
            const b = gv[gradientIndex * 4 + 2];
            let a = Math.round(alpha * 255);
            if (z < zMin || z > zMax) {
                a *= 0.5;
            }
            const index = h * c.ctx.canvas.width * 4 + w * 4;
            data.data[index] = r;
            data.data[index + 1] = g;
            data.data[index + 2] = b;
            data.data[index + 3] = a;
        }
        c.ctx.putImageData(data, 0, 0);
        if (w < c.ctx.canvas.width) {
            drawInTimeSlot();
        }
    };

    drawInTimeSlot();
    c.ctx.putImageData(data, 0, 0);
}