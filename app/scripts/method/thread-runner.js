/**
*  @typedef thread
*  @type {Object}
*
*  @property {number}   fps      - The number of times this threads' tasks run every second
*  @property {boolean}  active   - Whether or not this thread should currently be running its tasks
*  @property {array}    tasks    - An array of functions, or 'tasks', this thread will run every 'tick'
*/

/**
*  Returns a threadRunner object. This is used for running 'simulations', or 'multi-run-functions' a certain number of times per second in a way which setTimeout cannot guarantee.
*  @function
*  @name createThreadRunner
*  @returns {threadRunner} threadRunner
*/

const activeThreads = {};
const idleThreads   = {};
const threadRunner  = {
  addThread,
  __activeThreads: activeThreads,
  __idleThreads:   idleThreads,
};

let uuid = 0;
tick();

export default threadRunner;

function tick() {
  for (let i in activeThreads) {
    activeThreads[i].run()
  }

  requestAnimationFrame(tick);
}

function addThread ( newThreadID = ++uuid, options = {} ) {
  if (activeThreads[newThreadID] || idleThreads[newThreadID]) {
    throw new Error(`Thread with ID ${newThreadID} already exists.`);
  }
  const thread = new Thread(newThreadID, options);
  activeThreads[ newThreadID ] = thread;
  return thread;
}

function Thread (id, { fps = 60, active = false, tasks = [], frame = 0, simulate = true } = {}) {
  let atTime = +new Date();
  this.id     = id;

  this.resetFrame = () => {
    frame = 0;
  }

  this.destroy = () => {
    delete activeThreads[ id ];
  }

  this.play = () => {
    atTime = +new Date();
    activeThreads[ id ] = this;
    delete idleThreads[ id ];
  }

  this.pause = () => {
    idleThreads[ id ] = this;
    delete activeThreads[ id ];
  }

  this.addTask = task => {
    if (tasks.indexOf(task) === -1 ) {
      tasks.push( task.bind(this) );
    }
  }

  this.removeTask = task => {
    const taskIndex = tasks.indexOf(task);
    if (taskIndex > -1 ) {
      tasks.splice(taskIndex, 1);
    }
  }

  this.run = () => {
    const dateNow = +new Date();

    if (!simulate || atTime < dateNow) {
      tasks.forEach(task => {
        task();
      });

      atTime += 1000 / fps;
      frame  += 1;

      if (simulate) {
        this.run();
      }
    }
  }

  Object.defineProperty(this, 'frame', {
    get: ()    => { return frame; },
    set: value => { return frame; },
  });
}
