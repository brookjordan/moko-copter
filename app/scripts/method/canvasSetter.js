let sprytCanvas;

let canvas;
let ctx;
let worldWidth;
let worldHeight;
let worldRatio;
let retinaScale;
let offsetX;
let offsetY;
let stageWidth;
let stageHeight;
let stageScale;
let windowWidth;
let windowHeight;

export default function (canvasElement, _worldWidth=1, _worldHeight=1, retina=false) {
  canvas       = canvasElement;
  ctx          = canvas.getContext('2d');
  worldWidth   = _worldWidth;
  worldHeight  = _worldHeight;
  worldRatio   = _worldWidth / _worldHeight;
  retinaScale  = typeof retina === 'boolean' ? retina ? 2 : 1 : retina;

  sprytCanvas = {
    canvas:   canvas,
    ctx:      ctx,
    dims:     getIdealSprytCanvasSize(),
    resize:   resizeCanvas,
    x:        offsetToStageX,
    y:        offsetToStageY,
    s:        scaleToStage,
    sq:       getSquareArray,
  };

  return sprytCanvas;
}

function getIdealSprytCanvasSize(browserWidth, browserHeight) {
  stageWidth   = browserWidth;
  stageHeight  = browserWidth / worldRatio;
    stageScale   = stageHeight / worldHeight;

  if (stageHeight > window.innerHeight) {
    stageWidth  = browserHeight * worldRatio;
    stageHeight = browserHeight;
  stageScale   = stageWidth / worldWidth;
  }

  offsetX      = ((browserWidth  - stageWidth)  / 2) * retinaScale;
  offsetY      = ((browserHeight - stageHeight) / 2) * retinaScale;

  stageWidth *= retinaScale;
  stageHeight *= retinaScale;

  return { stageScale, stageWidth , stageHeight, offsetX, offsetY };
}

function resizeCanvas() {
  windowWidth        = window.innerWidth;
  windowHeight       = window.innerHeight;

  sprytCanvas._dims = getIdealSprytCanvasSize(windowWidth, windowHeight);

  canvas.width  = windowWidth  * retinaScale;
  canvas.height = windowHeight * retinaScale;
}

function offsetToStageX(x) {
  return x * stageScale * retinaScale + offsetX;
}

function offsetToStageY(y) {
  return y * stageScale * retinaScale + offsetY;
}

function scaleToStage(s) {
  return s * stageScale * retinaScale;
}

function getSquareArray(x, y, width, height) {
  return [
    x * stageScale * retinaScale + offsetX,
    y * stageScale * retinaScale + offsetY,
    width * stageScale * retinaScale,
    height * stageScale * retinaScale,
  ];
}
