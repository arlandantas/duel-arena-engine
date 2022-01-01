import Position from "../interfaces/Position";
import Damageable from "../interfaces/Damageable";
import Vehicle from './Vehicle';
import DamageRemover from "../interfaces/DamageRemover";

class Heart extends DamageRemover {
  private x: number = 0;
  private y: number = 0;

  static RADIUS = 2;

  constructor (
    x: number = 0,
    y: number = 0,
  ) {
    super()
    this.x = x;
    this.y = y;
  }

  getPosition(): Position {
    return { x: this.x, y: this.y };
  }

  getBoundaries(): Array<Position> {
    return [
      { x: this.x, y: this.y },
      { x: this.x + 3, y: this.y - 3 },
      { x: this.x + 6, y: this.y },
      { x: this.x, y: this.y + 6 },
      { x: this.x - 6, y: this.y },
      { x: this.x - 3, y: this.y - 3 },
    ];
  }

  getDamageToRemove(damageable: Damageable): number {
    if (damageable instanceof Vehicle) {
      return 30
    }
    return 2
  }
  
}

export default Heart;