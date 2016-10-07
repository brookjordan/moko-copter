import stage         from  '../method/stage.js';
import control       from  '../method/control.js';
import blocks        from  '../method/control-blocks.js';
import renderSquare  from  '../method/render-square.js';
import renderWorld   from  '../method/render-world.js';
import renderBlocks  from  '../method/render-blocks.js';
import threads       from  '../method/thread-runner.js';


const simThread    = threads.addThread('sim-thread', { fps: 60 });
const renderThread = threads.addThread('render-thread', { fps: 10, simulate: false });
const renderQueue  = [
  () => renderWorld(stage),
  () => renderBlocks(stage, blocks, images.lamp, images.crates),
];
const imageURLs = [
  ['mokoCopter', 'http://brookjordan.uk/tg/moko/images/moko-copter.png'],
  ['lamp',       'http://brookjordan.uk/tg/moko/images/lamp.png'],
  ['crates',     'http://brookjordan.uk/tg/moko/images/crates.png'],
];
const images = {};

loadImages()
.then(init);

function init() {
  renderThread.addTask(render);
  renderQueue.push(() => renderSquare(stage, images.mokoCopter, control.size.width, control.size.height, control.pos.x, control.pos.y, control.pos.rot));
  stage.tools.resizeCanvas();
  control.init(stage);

  window.addEventListener('resize', stage.tools.resizeCanvas);

  window.addEventListener('touchstart', addSim);
  window.addEventListener('mousedown',  addSim);
  window.addEventListener('keydown',    addSim);
}

function loadImages() {
  let imagesLoaded = 0;

  return new Promise((resolve, reject) => {
    imageURLs.forEach(image => {
      const img = new Image();
      img.onload = () => {
        imagesLoaded +=1;
        if (imagesLoaded === imageURLs.length) {
          resolve();
        }
      };
      img.src = image[1];
      images[image[0]] = img;
    });
  });
}

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
