

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
