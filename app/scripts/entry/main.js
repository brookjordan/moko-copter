import stage         from  '../method/stage.js';
import control       from  '../method/control.js';
import blocks        from  '../method/control-blocks.js';
import renderSquare  from  '../method/render-square.js';
import renderWorld   from  '../method/render-world.js';
import renderBlocks  from  '../method/render-blocks.js';
import threads       from  '../method/thread-runner.js';


const mokoGlider = new Image();
const mokoGliderURL = 'http://brookjordan.uk/tg/moko/images/moko-glider.png';
const simThread    = threads.addThread('sim-thread', { fps: 60 });
const renderThread = threads.addThread('render-thread', { fps: 10, simulate: false });
const renderQueue  = [
  () => renderWorld(stage),
  () => renderBlocks(stage, blocks.blocks),
];

renderThread.addTask(render);
mokoGlider.onload = () => {
  renderQueue.push(() => renderSquare(stage, mokoGlider, control.size.width, control.size.height, control.pos.x, control.pos.y, control.pos.rot));
};
mokoGlider.src = mokoGliderURL;
mokoGlider
stage.tools.resizeCanvas();
control.init(stage);

window.addEventListener('resize', stage.tools.resizeCanvas);

window.addEventListener('touchstart', addSim);
window.addEventListener('mousedown',  addSim);
window.addEventListener('keydown',    addSim);

function render() {
  renderQueue.forEach(renderQueueItem => {
    renderQueueItem();
  });
}

function addSim() {
  window.removeEventListener('touchstart', addSim);
  window.removeEventListener('mousedown',  addSim);
  window.removeEventListener('keydown',    addSim);
  simThread.addTask(controlSim);
  setTimeout(() => simThread.addTask(() => blocks.sim(stage, control)), 0);
}

function controlSim() {
  control.sim(stage);
}
