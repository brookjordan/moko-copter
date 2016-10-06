export default function renderSquare(stage, image, width, height, x, y, rotate=0) {
  stage.ctx.save();
  stage.ctx.translate(x, y);
  stage.ctx.rotate(rotate);
  stage.ctx.drawImage(image, -width / 2, -height / 2, width, height, false);
  stage.ctx.restore();
}
