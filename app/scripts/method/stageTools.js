export default function buildStageModifier(canvas, worldWidth=1, worldHeight=1, retina=false) {
  const ctx          = canvas.getContext('2d');
  const worldRatio   = worldWidth / worldHeight;
  const retinaScale  = typeof retina === 'boolean' ? retina ? 2 : 1 : retina;
  const sprytCanvas = {
    ctx,
    canvas,
    resizeCanvas,
    offsetToStageX,
    offsetToStageY,
    scaleToStage,

    get stageWidth() {
      return stageWorldWidth;
    },
    get stageHeight() {
      return stageWorldHeight;
    },

    get worldOffsetX() {
      return stageWorldOffsetX;
    },
    get worldOffsetY() {
      return stageWorldOffsetY;
    },
  };

  let offsetX;
  let offsetY;
  let stageWidth;
  let stageHeight;
  let stageScale;
  let windowWidth;
  let windowHeight;
  let stageWorldWidth;
  let stageWorldHeight;
  let stageWorldOffsetX;
  let stageWorldOffsetY;

  return sprytCanvas;


  function getIdealSprytCanvasSize(windowWidth, windowHeight) {
    stageWidth   = windowWidth;
    stageHeight  = windowWidth / worldRatio;
    stageScale   = stageHeight / worldHeight;

    if (stageHeight > window.innerHeight) {
      stageWidth   = windowHeight * worldRatio;
      stageHeight  = windowHeight;
      stageScale   = stageWidth / worldWidth;
    }

    offsetX      = ((windowWidth  - stageWidth)  / 2) * retinaScale;
    offsetY      = ((windowHeight - stageHeight) / 2) * retinaScale;

    stageWidth        *= retinaScale;
    stageHeight       *= retinaScale;
    stageWorldWidth    = windowWidth / stageScale;
    stageWorldHeight   = windowHeight / stageScale;
    stageWorldOffsetX  = offsetX / stageScale;
    stageWorldOffsetY  = offsetY / stageScale;

    return { stageScale, stageWidth , stageHeight, offsetX, offsetY };
  }

  function resizeCanvas() {
    windowWidth        = window.innerWidth;
    windowHeight       = window.innerHeight;

    getIdealSprytCanvasSize(windowWidth, windowHeight);

    canvas.width     = windowWidth  * retinaScale;
    canvas.height    = windowHeight * retinaScale;
  }

  function offsetToStageX(x) {
    return x * stageScale * retinaScale + (offsetX);
  }

  function offsetToStageY(y) {
    return y * stageScale * retinaScale + offsetY;
  }

  function scaleToStage(s) {
    return s * stageScale * retinaScale;
  }
}
