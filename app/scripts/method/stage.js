import buildStageTools  from  '../method/stageTools.js';
import buildStageCtx    from  '../method/stageCtx.js';


const canvasElement = document.getElementById('spryt-stage');
const stageWidth    = 9;
const stageHeight   = 15;
const retinaScale   = window.devicePixelRatio;

const stageTools    = buildStageTools(canvasElement, stageWidth, stageHeight, retinaScale);
const stageCtx      = buildStageCtx(stageTools);


export default {
  tools:  stageTools,
  ctx:    stageCtx,
  canvas: canvasElement,
  width:  stageWidth,
  height: stageHeight,
}
