export default function buildWorld({ zoom=1, panX=0, panY=0, posX=0, posY=0, canvas=null } = {}) {

  if (canvas) {
    setPosition();
  }

  const worldProxy = {
    coords2canvas,
    coords2world,
    setPosition,

    get zoom() { return zoom; },
    get panX() { return panX; },
    get panY() { return panY; },

    get posX() { return posX; },
    get posY() { return posY; },

    set zoom(to) { return isNaN(to) ? zoom : +to; },
    set panX(to) { return isNaN(to) ? panX : +to; },
    set panY(to) { return isNaN(to) ? panY : +to; },

    //  posX and posY should only be being defined manually if no canvas is provided
    set posX(to) { return canvas || isNaN(to) ? posX : +to; },
    set posY(to) { return canvas || isNaN(to) ? posY : +to; },
  };

  return Object.freeze(worldProxy);

  function setPosition(element=canvas) {
    const bounds = element.getBoundingClientRect();
    posX = bounds.left;
    posY = bounds.top;
  }

  function coords2canvas(coords) {
    switch (coords.type) {
      case 'world':
        return {
          type: 'canvas',
          x:    posX + ((coords.x - panX) * zoom),
          y:    posY + ((coords.y - panY) * zoom),
        }

      case 'canvas':
      default:
        return coords;
    }
  }

  function coords2world(coords) {
    switch (coords.type) {
      case 'canvas':
        return {
          type: 'world',
          x:    ((coords.x - posX) / zoom) + panX,
          y:    ((coords.x - posX) / zoom) + panX,
        }

      case 'world':
      default:
        return coords;
    }
  }

};
