import { degreeToRad, rotatePoint } from "../helpers/math";
import Position from "../interfaces/Position";

class Bullet {
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
    let boundaries: Array<Position> = [];

    const initialPoint: Position = {
      x: this.x - Bullet.RADIUS,
      y: this.y
    };
    const currentPosition: Position = this.getPosition();

    for (let i = 0; i < 2; i += 0.2) {
      boundaries.push(rotatePoint(
        initialPoint,
        currentPosition,
        Math.PI * i
      ));
    }

    return boundaries;
  }
  
}

export default Bullet;