//let gradPoint = (Math.random() * 0.2) + 0.2;

export default function renderBounds(stage) {
  //const gradient = stage.ctx._.createLinearGradient(0, 0, stage.canvas.width * gradPoint, stage.canvas.height);
  //if (Math.random() > 0.99) { gradPoint = (Math.random() * 0.1) + 0.25; }
  //gradient.addColorStop(0, "#332b28");
  //gradient.addColorStop(gradPoint, "#4a4547");
  //gradient.addColorStop(1, "#332b28");
  //stage.ctx.fillStyle = gradient;
  stage.ctx.fillStyle = '#4b4547';
  stage.ctx._.fillRect(0, 0, stage.canvas.width, stage.canvas.height, false);
}
