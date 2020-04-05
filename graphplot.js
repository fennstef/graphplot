var getGridPointDist = function(min, max, factor) {
  var diff = max - min;
  var result = Math.pow(10.0, Math.ceil(Math.log(diff) / Math.log(10.0)) - 1);
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
};

var clear = function(c) {
  c.ctx.clearRect(0, 0, c.width, c.height);
};

var drawGrid = function(c) {
  clear(c);
  var xDiff = c.xMax - c.xMin;
  var xPixPerUnit = c.width / xDiff;
  var yDiff = c.yMax - c.yMin;
  var yPixPerUnit = c.height / yDiff;
  var xF = getGridPointDist(c.xMin, c.xMax, c.xFactor);
  var yF = getGridPointDist(c.yMin, c.yMax, c.yFactor);

  var startValue = Math.ceil(c.xMin / xF) * xF;
  var number = Math.round(Math.floor(xDiff / xF)) + 1;
  var axisPosition = 0;
  if (c.yMin < 0 && c.yMax > 0) {
    axisPosition = c.height + c.yMin * yPixPerUnit + 12;
  } else {
    axisPosition = c.height - 12;
  }
  ctx.strokeStyle = c.gridColor;
  for (var i = 0; i < number; i++) {
    if (Math.abs(startValue) < xF * 0.5) {
      ctx.strokeStyle = c.axisColor;
    }
    var position = Math.round((startValue - c.xMin) * xPixPerUnit);
    drawLine(ctx, position, 0, position, c.height);
    ctx.fillStyle = c.axisColor;
    text = Math.round(startValue * 100) / 100;
    ctx.fillText(text, position + 4, axisPosition);
    ctx.strokeStyle = c.gridColor;
    startValue += xF;
  }

  startValue = Math.ceil(c.yMin / yF) * yF;
  var number = Math.round(Math.floor(yDiff / yF)) + 1;
  var axisPosition = 0;
  if (c.xMin < 0 && c.xMax > 0) {
    axisPosition = -c.xMin * xPixPerUnit + 5;
  } else {
    axisPosition = 5;
  }
  ctx.strokeStyle = c.gridColor;
  for (var i = 0; i < number; i++) {
    if (Math.abs(startValue) < yF * 0.5) {
      ctx.strokeStyle = c.axisColor;
    }
    var position = c.height - Math.round((startValue - c.yMin) * yPixPerUnit);
    drawLine(ctx, 0, position, c.width, position);
    ctx.fillStyle = c.axisColor;
    text = Math.round(startValue * 100) / 100;
    ctx.fillText(text, axisPosition, position - 4);
    ctx.strokeStyle = c.gridColor;
    startValue += yF;
  }
};

var xCoordToPix = function(c, xCoord) {
  var xDiff = c.xMax - c.xMin;
  var xPixPerUnit = c.width / xDiff;
  return (xCoord - c.xMin) * xPixPerUnit;
};

var yCoordToPix = function(c, yCoord) {
  var yDiff = c.yMax - c.yMin;
  var yPixPerUnit = c.height / yDiff;
  return c.height - (yCoord - c.yMin) * yPixPerUnit;
};

var xPixToCoord = function(c, xPix) {
  var xDiff = c.xMax - c.xMin;
  var xPixPerUnit = c.width / xDiff;
  return xPix / xPixPerUnit + c.xMin;
};

var yPixToCoord = function(c, yPix) {
  var yDiff = c.yMax - c.yMin;
  var yPixPerUnit = c.height / yDiff;
  return -(yPix - c.height) / yPixPerUnit + c.yMin;
};

var drawLine = function(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
};

var drawFunction = function(c, strokeStyle, func) {
  clear(c);
  c.ctx.strokeStyle = strokeStyle;
  c.ctx.lineWidth = 3;
  c.ctx.beginPath();
  for (var w = 0; w <= c.width; w++) {
    var y = func(xPixToCoord(c, w));
    var h = yCoordToPix(c, y);
    if (w === 0) {
      c.ctx.moveTo(w, h);
      continue;
    }
    c.ctx.lineTo(w, h);
  }
  c.ctx.stroke();
};

var getGradientVector = function(colorMapIndex, levels) {
  var gradientColors1 = {
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
  var gradientColors2 = {
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
  var gradientColors3 = {
    0.0: "rgb(51, 0, 102)",
    0.5: "rgb(0, 0, 128)",
    1.0: "rgb(204, 255, 255)"
  };
  var gradientColors4 = {
    0.0: "rgb(102, 0, 0)",
    0.5: "rgb(102, 0, 0)",
    1.0: "rgb(255, 102, 0)"
  };
  var gradientColors5 = {
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
  var gradientColors6 = {
    0.0: "rgb(120, 28, 23)",
    0.5: "rgb(224, 137, 0)",
    1.0: "rgb(224, 206, 0)"
  };
  var gradientColors7 = {
    0.0: "rgb(55, 14, 77)",
    0.5: "rgb(128, 9, 14)",
    1.0: "rgb(115, 143, 79)"
  };
  var gradientColors8 = {
    0.0: "rgb(109, 79, 143)",
    0.33: "rgb(143, 79, 79)",
    0.66: "rgb(122, 76, 47)",
    1.0: "rgb(142, 143, 79)"
  };

  var gradientColorList = [
    gradientColors1,
    gradientColors2,
    gradientColors3,
    gradientColors4,
    gradientColors5,
    gradientColors6,
    gradientColors7,
    gradientColors8
  ];

  var gradientColors = gradientColorList[colorMapIndex];

  var canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = levels;
  var ctx2 = canvas.getContext("2d");
  var gradient = ctx2.createLinearGradient(0, 0, 0, levels);
  for (var pos in gradientColors) {
    gradient.addColorStop(pos, gradientColors[pos]);
  }
  ctx2.fillStyle = gradient;
  ctx2.fillRect(0, 0, 1, levels);
  var gradientPixels = ctx2.getImageData(0, 0, 1, levels).data;
  return gradientPixels;
};

var draw3dFunction = function(c, zMin, zMax, alpha, gv, func) {
  clear(c);
  var data = c.ctx.createImageData(c.width, c.height);

  var w = 0;
  var h = -1;

  var drawInTimeSlot = function() {
    start = +new Date();
    while (+new Date() - start < 70) {
      if (w >= c.width) {
        break;
      }
      h++;
      if (h == c.height + 1) {
        w++;
        h = 0;
      }
      var z = func(xPixToCoord(c, w), yPixToCoord(c, h));
      var pixelCount = gv.length / 4;
      var gradientIndex = Math.round(((z - zMin) / (zMax - zMin)) * pixelCount);
      if (gradientIndex < 0) {
        gradientIndex = 0;
      }
      if (gradientIndex >= pixelCount) {
        gradientIndex = pixelCount - 1;
      }
      var r = gv[gradientIndex * 4];
      var g = gv[gradientIndex * 4 + 1];
      var b = gv[gradientIndex * 4 + 2];
      var a = Math.round(alpha * 255);
      if (z < zMin || z > zMax) {
        a *= 0.5;
      }
      var index = h * c.width * 4 + w * 4;
      data.data[index] = r;
      data.data[index + 1] = g;
      data.data[index + 2] = b;
      data.data[index + 3] = a;
    }
    c.ctx.putImageData(data, 0, 0);
    setTimeout(drawInTimeSlot);
  };

  drawInTimeSlot();

  c.ctx.putImageData(data, 0, 0);
};