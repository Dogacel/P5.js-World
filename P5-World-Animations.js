
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
