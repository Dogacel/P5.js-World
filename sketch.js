var world, tmp;

function setup() {
  var canvas = createCanvas(500, 500);

  world = new World(canvas);

  tmp = new WObject(100, 100, 100, 100);


  world.addWObject(tmp);

  let button = createButton("Click me");
  button.mouseClicked(() => {
    world.addWAction(new WAction(0, 0.1, 0, 0.01, 10, 10, tmp.id));
  });
}

function draw() {
  world.tick();
  world.drawWorld();
}


function WObject(a, b, x, y) {
  this.width = a;
  this.height = b;
  this.x = x;
  this.y = y;
  this.id;

  this.addID = function(id) {
    this.id = id;
  }

  this.draw = function() {
    rect(this.x, this.y, this.width, this.height);
  }
}

function WAction(ax, ay, fx, fy, vx0, vy0, bindID) {
  this.ax = ax;
  this.ay = ay;
  this.fx = fx;
  this.fy = fy;
  this.vx = vx0;
  this.vy = vy0;

  this.bindID = bindID;
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
      this.wobjects[waction.bindID].x += waction.vx;
      this.wobjects[waction.bindID].y += waction.vy;

      waction.vx += waction.ax;
      waction.vy += waction.ay;

      waction.ax -= waction.fx;
      waction.ay -= waction.fy;

      if ( waction.ax * waction.fx <= 0 ) {
        if (abs(waction.ax) <= abs(waction.fx)) {
          waction.ax = 0;
        }
      }

      if ( waction.ay * waction.fy <= 0 ) {
        if (abs(waction.ay) <= abs(waction.fy)) {
          waction.ay = 0;
        }
      }


      if (waction.ay == 0 && waction.ax == 0) {
        this.wactions.splice(i,1);
      }

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
