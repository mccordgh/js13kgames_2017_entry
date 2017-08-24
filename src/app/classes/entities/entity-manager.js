import { Rectangle } from '../gfx/shapes/rectangle';

let handler, player, entities;

const compare = (a, b) => {
  let aY = a.getY();
  let bY = b.getY();
  let aH = a.getHeight();
  let bH = b.getHeight();
  if (aY + aH === bY + bH)  return 0;
  if (aY + aH < bY + bH) return -1;
  return 1;
};

export class EntityManager {
  constructor(_handler, _player){
    handler = _handler;
    player = _player;
    entities = new Array(player);
  }

  tick(_dt) {
    entities.sort(compare);
    for(let i = 0; i < entities.length; i++){
      const e = entities[i];
      e.tick(_dt);
    }
  }

  render(_g) {
    const player = this.getPlayer();

    //Iterate through every entity, check whether they are currently in the camera view.
    //If they are then draw them, if not and they are a monster draw offscreen monster pointer
    entities.forEach(function(e){
      const cameraXOffset = e.handler.getGameCamera().getxOffset();
      const cameraYOffset = e.handler.getGameCamera().getyOffset();

      let checkRight = e.handler.getWidth() + cameraXOffset;
      let checkBottom = e.handler.getHeight() + cameraYOffset;
      let checkLeft = cameraXOffset - e.width;
      let checkTop = cameraYOffset - e.height;

      let scaleX = 0, scaleY = 0, marker = null;
      const offScreen = (e.y < checkTop || e.x > checkRight || e.y > checkBottom || e.x < checkLeft);

      const wiggle = 12; //giving a little extra area to the check below
      const alertDistance = e.handler.getWidth();

      // this.x - this.handler.getGameCamera().getxOffset(), this.y - this.handler.getGameCamera().getyOffset()
      const alertArea = new Rectangle(
        player.x - alertDistance - cameraXOffset,
        player.y - alertDistance - cameraYOffset,
        alertDistance * 2 + player.width,
        alertDistance * 2 + player.height,
        );

      // console.log('player', player.x, player.y);
      // console.log('rect', alertArea.x, alertArea.y)

      // _g.fillStyle = 'pink';
      // _g.fillRect(alertArea.x, alertArea.y, alertArea.width, alertArea.height);

      //check if creature is near enough to alert player
      // const alert = () => (
      //   (e.y + wiggle - player.y > -alertDistance) &&  ||
      //   (e.y - player.y < alertDistance) ||
      //     (e.x - player.x > -alertDistance) ||
      //       (e.x - player.d < alertDistance)
      // );
      // if (alert) {
      
        _g.font = "64px Arial Bold";
        _g.fillStyle = "white";

        // if creature is directly above player
        if (e.x - wiggle < player.x && (e.x + e.width + wiggle) > player.x + player.width) {
          scaleX = 65;
          scaleY = 65;
          marker = "/\\";
        }
      // }
      // }
      // if (e.y < checkTop || e.x > checkRight || e.y > checkBottom || e.x < checkLeft) {
      //   offScreen = true;
      //
      //   if (e.y )
      // }

      // if (e.x > checkRight){
      //   scaleX = e.handler.getWidth() - 55;
      //   scaleY = e.y - cameraYOffset;
      //   // offScreen = true;
      //   marker = ">";
      // }
      // if (e.y > checkBottom){
      //   scaleX = e.x - cameraXOffset;
      //   scaleY = e.handler.getHeight() - 25;
      //   // offScreen = true;
      //   marker = "V";
      // }
      // if (e.x < checkLeft){
      //   scaleX = 10;
      //   scaleY = e.y - cameraYOffset;
      //   // offScreen = true;
      //   marker = "<";
      // }
      // if (e.y < checkTop) {
      //   scaleX = e.x - cameraXOffset;
      //   scaleY = 65;
      //   // offScreen = true;
      //   marker = "/\\";
      // }

      if (e.type === 'monster' && marker)
        _g.fillText(marker, cameraXOffset + scaleX, cameraYOffset + scaleY);

      if (!offScreen)
        e.render(_g);
    });
  }

  getPlayer() {
    return player;
  }

  getHandler() {
    return handler;
  }

  getEntities() {
    return entities;
  }

  getSingleEntity(_type) {
    let entityObj;

    entities.forEach((item) => {
      if (item.type === _type) {
        entityObj = {
          type: item.type,
          x: item.x,
          y: item.y
        };
      }
    });

    return entityObj;
  }

  addEntity(e) {
    entities.push(e);
    handler.getWorld().getSpatialGrid().insert(new Rectangle(e.x + e.bounds.x, e.y + e.bounds.y, e.bounds.width, e.bounds.height), e);
  }

  removeEntity(_entity) {
    for (let i = 0; i < entities.length; i++){
      const e = entities[i];
      if (e === _entity){
        entities.splice(i, 1);
      }
    }
  }

  removeAllMonsters() {
    for (let i = 0; i < entities.length; i++){
      const e = entities[i];
      if (e.type === 'monster'){
        entities.splice(i, 1);
      }
    }
  }
}
