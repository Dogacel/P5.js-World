var world, tmp;

function V(x, y) {
  return {'x' : x, 'y' : y};
}

function setup() {
  var canvas = createCanvas(500, 500);

  world = new World(canvas);

  tmp = []

  for (let i = 0 ; i < 6 ; i++) {
      append(tmp, new WObject(50, 50, 50 + i*55, 50));
      world.addWObject(tmp[i]);
      console.log(world.wobjects[i]);
  }

  let button = createButton("Click me");

  button.mouseClicked(() => {
    for(let i = 0 ; i < tmp.length ; i++) {
        world.addWAction(smoothMove(tmp[i], V(300, 300), 40))
        .queueAction(smoothMove(tmp[i], V(0, 0), 100));
    }

  });

}

function draw() {
  world.tick();
  world.drawWorld();
}

function smoothMove(object, destination, time) {

  var dx, dy, vx, vy, dxtime;

  return new WAction(
  object.id,() => {
    dx = -(object.coordinate.x - destination.x);
    dy = -(object.coordinate.y - destination.y);

    vx = dx / time;
    vy = dy / time;

    dxtime = time;
  }, () =>
    {
      let angleTime = map(dxtime, time, 0, 0, PI);
      let sintime = sin(angleTime);
      return V(vx * sintime * PI / 2  , vy * sintime * PI / 2);
    }, () =>
    {

      if (--dxtime == 0) {
        object.coordinate.x = round(object.coordinate.x);
        object.coordinate.y = round(object.coordinate.y);
        //console.log(object.coordinate.x+ " : " + object.coordinate.y);
        return true;
      }
      return false;
    }
  );
}

function move(object, destination, time) {

  var dx, dy, vx, vy, dxtime;

  return new WAction(
  tmp.id,() => {
    vx = -(object.coordinate.x - destination.x) / time;
    vy = -(object.coordinate.y - destination.y) / time;

    dxtime = time;
  }, () =>
    {
      return V(vx, vy);
    }, () =>
    {
      return --dxtime == 0;
    }
  );
}

function WObject(a, b, x, y) {
  this.width = a;
  this.height = b;
  this.coordinate = {'x' : x , 'y' : y};
  this.id;

  this.addID = function(id) {
    this.id = id;
  }

  this.draw = function() {
    rect(this.coordinate.x, this.coordinate.y, this.width, this.height);
  }
}

function WAction(bindID, initFunction = () => {}, deltaFunction = () => {}, endFunction = () => {}) {

  this.bindID = bindID;
  this.queuedAction = null;
  this.queueAction = function(nextAction) {
    if (this.queuedAction != null) {
      this.queuedAction.queueAction(nextAction);
    } else {
      this.queuedAction = nextAction;
    }
    return this;
  }

  this.hasQueue = function () {
    return this.queuedAction != null;
  }

  this.getNextQueue = function () {
    return this.queuedAction;
  }

  this.init = initFunction;

  this.delta = deltaFunction;

  this.end = endFunction;
}

function World(canvas) {
  this.canvas = canvas;
  this.wobjects = [];
  this.wactions = [];

  this.drawWorld = function() {
    background(0);
    for (let i = 0 ; i < this.wobjects.length ; i++) {
      this.wobjects[i].draw();
    }
  }

  this.tick = function() {
    for (let i = 0 ; i < this.wactions.length ; i++) {
      let waction = this.wactions[i];

      if(this.wactions[i].end()) {
        if (this.wactions[i].hasQueue()) {
          this.wactions[i] = this.wactions[i].getNextQueue();
          this.wactions[i].init();
        } else {
          this.wactions.splice(i, 1);
        }
        continue;
      }

      let delta = this.wactions[i].delta()
      this.wobjects[waction.bindID].coordinate.x += delta.x;
      this.wobjects[waction.bindID].coordinate.y += delta.y;

    }
  }

  this.addWObject = function(wobject) {
    wobject.addID(this.wobjects.length);
    append(this.wobjects, wobject);
  }

  this.addWAction = function(waction) {
    waction.init();
    append(this.wactions, waction);
    return this.wactions[this.wactions.length - 1];
  }

}
