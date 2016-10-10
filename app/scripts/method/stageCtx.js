export default function buildStageCtx({ resize, canvas, ctx, offsetToStageX, offsetToStageY, scaleToStage } = {}) {
  const newCtx = {
    fillRect,
    drawImage,
    drawImagePart,
    rotate,
    translate,
    save,
    restore,
    createLinearGradient,
    fillText,
    font,

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

  function createLinearGradient(x0, y0, x1, y1) {
    return ctx.createLinearGradient(scaleToStage(x0), scaleToStage(y0), scaleToStage(x1), scaleToStage(y1));
  }

  function save() {
    return ctx.save();
  }

  function restore() {
    return ctx.restore();
  }

  function fillText(text, x, y, offset=true) {
    if (offset) {
      return ctx.fillText(text, offsetToStageX(x), offsetToStageY(y));
    }
    return ctx.fillText(text, scaleToStage(x), scaleToStage(y));
  }

  function font(size, text) {
    return ctx.font = `${scaleToStage(size)}px ${text}`;
  }
}
