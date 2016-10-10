import sendScore from '../method/send-score.js';

const blocks        = [];
const blockWidth    = 1;
const blockSpacing  = 6;
const gapsize      = 5;
const gapHeightMin = 4;
const gapHeightMax = 11;

const score = {
  current: 0,
  high:    0,
};

let simRunning      = true;
let restartSimTimeout;
let insideGap           = false;
let insideGapPreviously = insideGap;


export default {
  sim:     controlBlocks,
  blocks:  blocks,
  score,
  pause:   pauseSim,
  restart: restartSim,
}


function controlBlocks(stage, moko) {
  if (simRunning) {
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

    insideGapPreviously = insideGap;
    insideGap           = false;
    blocks.forEach(block => collideBlock(block, moko));
    if (insideGapPreviously && !insideGap) {
      score.current += 1;
    }
  } else if (!blocks.length) {
    restartSim();
  } else {
    insideGapPreviously = false;
    insideGap = false;
    if (score.current > score.high) {
      score.high = score.current;
      sendScore(score.high);
    }
    score.current = 0;
    blocks.forEach(block => block.opening = block.opening || (Math.random() * 0.5) + 0.3);
  }

  blocks.forEach((block) => controlBlock(block, stage));
}

function controlBlock(block, stage) {
  block.x -= 0.1;
  if (block.opening) {
    block.gap += block.opening;
    block.opening *= 1.5;
    if (block.gap > stage.height * 2) {
      blocks.splice(blocks.indexOf(block), 1);
    }
  }
}

function collideBlock(block, moko) {
  //  Inside a gap
  if (block.x < moko.pos.x + (moko.size.width / 2) + 0.5 && block.x > moko.pos.x - (moko.size.width / 2) - 0.5) {
    insideGap = true;
    //  Hit the top block
    if (moko.pos.y - (moko.size.height / 4) < block.height - (block.gap / 2)) {
      pauseSim();
      return true;
    }
    //  Hit the bottom block
    if (moko.pos.y + (moko.size.height / 4) > block.height + (block.gap / 2)) {
      pauseSim();
      return true;
    }
  }

  return false;
}

function newBlock(stage) {
  const lastBlock = blocks[blocks.length - 1];
  blocks.push({
    x:       lastBlock ? lastBlock.x + blockSpacing : stage.tools.stageWidth,
    width:   blockWidth,
    height:  (Math.random() * (gapHeightMax - gapHeightMin)) + gapHeightMin,
    gap:    gapsize,
    opening: false,
  });
}

function resetBlocks() {
  blocks.splice(0, blocks.length - 1);
}

function pauseSim() {
  simRunning = false;
}

function restartSim() {
  simRunning = true;
}
