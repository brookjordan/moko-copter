import React          from 'react';
import ReactDOM       from 'react-dom';
import buildWorld     from '../method/buildWorld.js';
import SprytCanvas    from '../component/SprytCanvas.jsx'

ReactDOM.render(<SprytCanvas/>, document.getElementById('app-entry'));

const WORLD = buildWorld({
  zoom:   87/Math.PI,
  canvas: document.querySelectorAll('p')[10],
});

const coords = {
  type: 'world',
  x:    10,
  y:    10,
};

const canvasCoords = WORLD.coords2canvas(coords);

const hello = () => { console.log('hello'); return false; }

hello();

console.log(coords);
console.log(WORLD.coords2canvas(coords));
console.log(WORLD.coords2world(canvasCoords));
