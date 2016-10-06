export default function renderBounds(stage) {
  stage.ctx.fillStyle = '#72b4dd';
  stage.ctx._.fillRect(0, 0, stage.canvas.width, stage.canvas.height, false);
  stage.ctx.fillStyle = '#9cc9da';
  stage.ctx.fillRect(.0, 0, stage.width, stage.height);
}
