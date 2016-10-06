export default function renderBlocks(stage, blocks) {
  blocks.forEach(block => renderBlock(block, stage));
}

function renderBlock(block, stage) {
  stage.ctx.fillStyle = '#8e6831';
  stage.ctx.fillRect(block.x, 0, block.width, block.height - (block.hole / 2));
  stage.ctx.fillRect(block.x, block.height + (block.hole / 2), block.width, stage.height - (block.height + (block.hole / 2)));
}
