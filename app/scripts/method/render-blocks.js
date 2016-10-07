export default function renderBlocks(stage, blocks, topImage, bottomImage) {
  blocks.blocks.forEach(block => renderBlock(block, stage, topImage, bottomImage, blocks.score));
}

function renderBlock(block, stage, topImage, bottomImage, score) {
  const gapTop     = block.height - (block.gap / 2);
  const blockHeight = block.width * 8;
  stage.ctx.drawImage(topImage, block.x, gapTop - blockHeight, block.width, blockHeight);
  stage.ctx.drawImage(bottomImage, block.x, block.height + (block.gap / 2), block.width, blockHeight);

  stage.ctx.fillStyle = '#3a302c';
  stage.ctx.font(1, "'Open Sans', sans-serif");
  stage.ctx.fillText(`${score.current}`, 0.2, 1);
  stage.ctx.font(0.5, "'Open Sans', sans-serif");
  stage.ctx.fillText(`Hi-Score: ${score.high}`, 0.2, 2);
}
