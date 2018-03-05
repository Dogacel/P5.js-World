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
        world.addWAction(smoothMove(tmp[i], V(300, 300), 100));
    }

  });

}

function draw() {
  world.tick();
  world.drawWorld();
}

function smoothMove(object, destination, time) {
  let dx = -(object.coordinate.x - destination.x);
  let dy = -(object.coordinate.y - destination.y);

  let vx = dx / time;
  let vy = dy / time;

  var dxtime = time;

  return new WAction(
  object.id, () =>
    {
      let angleTime = map(dxtime, time, 0, 0, PI);
      let sintime = sin(angleTime);
      return V(vx * sintime * 15709/10000 , vy * sintime * 15709/10000);
    }, () =>
    {

      if (--dxtime == 0) {
        //object.coordinate.x = destination.x;
        //object.coordinate.y = destination.y;
        //console.log(object.coordinate.x+ " : " + object.coordinate.y);
        return true;
      }
      return false;
    }
  );
}

function move(object, destination, time) {
  let vx = -(object.coordinate.x - destination.x) / time;
  let vy = -(object.coordinate.y - destination.y) / time;

  var dxtime = time;

  return new WAction(
  tmp.id, () =>
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

function WAction(bindID, deltaFunction = () => {}, endFunction = () => {}) {

  this.bindID = bindID;

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
        this.wactions.splice(i, 1);
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
    append(this.wactions, waction);
  }

}
