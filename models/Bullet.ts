import { degreeToRad } from "../helpers/math";
import Position from "../interfaces/Position";

class Bullet {
  private x: number = 0;
  private y: number = 0;
  private speed: number = 0;
  private angle: number = 90;
  private angle_rad: number = 0;
  private vehicle_id: string = '?';

  constructor (
    x: number = 0,
    y: number = 0,
    angle: number = 0,
    vehicle_id: string = '?',
    speed: number = 50,
  ) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.angle = angle;
    this.angle_rad = degreeToRad(angle);
    this.vehicle_id = vehicle_id;
  }

  public getPosition(): Position {
    return { x: this.x, y: this.y };
  }

  public getSpeed(): number { return this.speed; }
  public getAngle(): number { return this.angle; }
  public getAngleRad(): number { return this.angle_rad; }
  public getVehicleId(): string { return this.vehicle_id; }
  
}

export default Bullet;