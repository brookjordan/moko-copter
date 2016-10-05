import renderCanvas   from '../method/canvasSetter.js'


const canvasElement = document.getElementById('spryt-board');
const boardWidth    = 9;
const boardHeight   = 12;
const retinaScale   = Window.devicePixelRatio;

const sprytCanvas = renderCanvas(canvasElement, boardWidth, boardHeight, retinaScale);
const { resize, canvas, ctx, x, y, s, sq } = sprytCanvas;
const drawSquare = squareDropper({ before: showBounds });

canvasElement.style.transform = `scale(${1 / retinaScale})`;

resize();
showBounds();

window.addEventListener('resize', () => {
  resize();
  drawSquare();
});


function showBounds() {
  ctx.fillStyle = 'rgba(0,255,0,1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(0,0,255,1)';
  ctx.fillRect(...sq(0, 0, boardWidth, boardHeight));
}

function squareDropper({before=() => {}, after=() => {}} = {}) {
  const squareSize = 3;
  let x = (boardWidth / 2) - (squareSize / 2);
  let y = -squareSize;

  dropTheSquare();

  return draw;

  function dropTheSquare() {
    y += 0.05;
    x += Math.random() * 0.2 - 0.1;
    if (y > boardHeight) {
      y = -squareSize;
      x = (boardWidth / 2) - (squareSize / 2);
    }
    draw();
    requestAnimationFrame(dropTheSquare);
  }

  function draw() {
    before();
    ctx.fillStyle = 'rgb(255,0,0)';
    ctx.fillRect(...sq(x, y, squareSize, squareSize));
    after();
  }
}
