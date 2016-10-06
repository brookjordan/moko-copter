const blocks        = [];
const blockWidth    = 1;
const blockSpacing  = 6;
const holesize      = 5;
const holeHeightMin = 4;
const holeHeightMax = 11;


export default {
  sim:    controlBlocks,
  blocks: blocks,
}


function controlBlocks(stage, moko) {
  while (!blocks.length || blocks[blocks.length - 1].x < stage.tools.stageWidth - blockSpacing) {
    newBlock(stage);
  }

  for (let i = 0, l = blocks.length; i < l; l += 1) {
    if (blocks[i].x < -stage.tools.worldOffsetX - blockWidth) {
      blocks.shift();
    } else {
      break;
    }
  }

  blocks.forEach(block => collidBlock(block, moko));

  blocks.forEach(controlBlock);
}

function controlBlock(block) {
  block.x -= 0.1;
  if (block.opening) {
    block.hole += Math.pow(block.opening++, 1.1) / 3;
  }
}

function collidBlock(block, moko) {
  //  Block hasn't reached
  if (block.x > moko.pos.x + (moko.size.width / 2) + 0.5) {
    return false;
  }
  //  Block has passed
  if (block.x < moko.pos.x - (moko.size.width / 2) - 0.5) {
    return false;
  }
  //  Hit the top block
  if (moko.pos.y - (moko.size.height / 3) < block.height - (block.hole / 2)) {
    block.opening = 1;
    return true;
  }
  //  Hit the bottom block
  if (moko.pos.y + (moko.size.height / 3) > block.height + (block.hole / 2)) {
    block.opening = 1;
    return true;
  }

  return false;
}

function newBlock(stage) {
  const lastBlock = blocks[blocks.length - 1];
  blocks.push({
    x:       lastBlock ? lastBlock.x + blockSpacing : stage.tools.stageWidth,
    width:   blockWidth,
    height:  (Math.random() * (holeHeightMax - holeHeightMin)) + holeHeightMin,
    hole:    holesize,
    opening: false,
  });
}

function resetBlocks() {
  blocks.splice(0, blocks.length - 1);
}
