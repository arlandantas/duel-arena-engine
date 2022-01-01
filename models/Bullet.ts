import { degreeToRad, rotatePoint } from "../helpers/math";
import Position from "../interfaces/Position";
import Damager from "../interfaces/Damager";
import Damageable from "../interfaces/Damageable";
import Vehicle from './Vehicle';

class Bullet extends Damager {
  private x: number = 0;
  private y: number = 0;
  private speed: number = 0;
  private angle: number = 90;
  private angle_rad: number = 0;
  private vehicle_id: string = '?';

  static RADIUS = 2;

  constructor (
    x: number = 0,
    y: number = 0,
    angle: number = 0,
    vehicle_id: string = '?',
    speed: number = 10,
  ) {
    super()
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.angle = angle;
    this.angle_rad = degreeToRad(angle);
    this.vehicle_id = vehicle_id;
  }

  getPosition(): Position {
    return { x: this.x, y: this.y };
  }

  getSpeed(): number { return this.speed; }
  getAngle(): number { return this.angle; }
  getAngleRad(): number { return this.angle_rad; }
  getVehicleId(): string { return this.vehicle_id; }

  update () {
    this.y = this.y + (Math.sin(this.angle_rad) * this.speed);
    this.x = this.x + (Math.cos(this.angle_rad) * this.speed);
  }

  getBoundaries(): Array<Position> {
    return [
      { x: this.x, y: this.y - Bullet.RADIUS },
      { x: this.x + Bullet.RADIUS, y: this.y },
      { x: this.x, y: this.y + Bullet.RADIUS },
      { x: this.x - Bullet.RADIUS, y: this.y },
    ];
  }

  getDamageToApply(damageable: Damageable): number {
    if (damageable instanceof Vehicle) {
      if (damageable.getVehicleId() == this.vehicle_id) return 0

      return 30
    }
    return 2
  };
  
}

export default Bullet;