export default function buildStageCtx({ resize, canvas, ctx, offsetToStageX, offsetToStageY, scaleToStage } = {}) {
  const newCtx = {
    fillRect,
    drawImage,
    drawImagePart,
    rotate,
    translate,
    save,
    restore,

    _: ctx,

    set fillStyle(val) {
      ctx.fillStyle = val;
    },
    get fillStyle() {
      return ctx.fillStyle;
    },
  };


  return newCtx;


  function fillRect(x, y, width, height, offset=true) {
    if (offset) {
      return ctx.fillRect(offsetToStageX(x), offsetToStageY(y), scaleToStage(width), scaleToStage(height));
    }
    return ctx.fillRect(scaleToStage(x), scaleToStage(y), scaleToStage(width), scaleToStage(height));
  }

  function clearRect(x, y, width, height, offset=true) {
    if (offset) {
      return ctx.clearRect(offsetToStageX(x), offsetToStageY(y), scaleToStage(width), scaleToStage(height));
    }
    return ctx.clearRect(scaleToStage(x), scaleToStage(y), scaleToStage(width), scaleToStage(height));
  }

  function drawImage(image, dx, dy, dWidth, dHeight, offset=true) {
    if (offset) {
      return ctx.drawImage(image, offsetToStageX(dx), offsetToStageY(dy), scaleToStage(dWidth), scaleToStage(dHeight));
    }
    return ctx.drawImage(image, scaleToStage(dx), scaleToStage(dy), scaleToStage(dWidth), scaleToStage(dHeight));
  }

  function drawImagePart(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight, offset=true) {
    if (offset) {
      return ctx.drawImage(image, sx, sy, sWidth, sHeight,
        offsetToStageX(dx), offsetToStageY(dy), scaleToStage(dWidth), scaleToStage(dHeight));
    }
    return ctx.drawImage(image, sx, sy, sWidth, sHeight,
      scaleToStage(dx), scaleToStage(dy), scaleToStage(dWidth), scaleToStage(dHeight));
  }

  function rotate(deg) {
    return ctx.rotate(deg);
  }

  function translate(x, y) {
    return ctx.translate(offsetToStageX(x), offsetToStageY(y));
  }

  function save() {
    return ctx.save();
  }

  function restore() {
    return ctx.restore();
  }
}
