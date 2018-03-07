
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
