import { degreeToRad, normalizeDegrees } from "../helpers/math";

class Vehicle {
  private x: number = 0;
  private y: number = 0;
  private speed: number = 0;

  private angle: number = 90;
  private angle_rad: number = 0;
  private angle_speed: number = 0;
  
  private gun_angle: number = 0;
  private gun_angle_rad: number = 0;
  private gun_angle_speed: number = 0;

  constructor (x: number = 0, y: number = 0, angle: number = 90) {
    this.setX(x)
    this.setY(y)
    this.setAngle(angle)
    this.setGunAngle(0)
  }

  static DIRECTIONS = {
    FORWARD: 'FORWARD',
    BACKWARD: 'BACKWARD',
    CLOCKWISE: 'CLOCKWISE',
    ANTICLOCKWISE: 'ANTICLOCKWISE',
  }

  private setX (x: number) { this.x = x }

  private setY (y: number) { this.y = y }

  setSpeed (speed: number) { this.speed = speed }
  
  setAngleSpeed (angle_speed: number) { this.angle_speed = (angle_speed < 90 ? angle_speed : 90) }
  
  setGunAngleSpeed (gun_angle_speed: number) { this.gun_angle_speed = (gun_angle_speed < 90 ? gun_angle_speed : 90) }

  private setAngle (angle: number) {
    this.angle = normalizeDegrees(angle);
    this.angle_rad = degreeToRad(this.angle);
  }

  private setGunAngle (gun_angle: number) {
    this.gun_angle = normalizeDegrees(gun_angle);
    this.gun_angle_rad = degreeToRad(this.gun_angle);
  }

  move (direction: String = Vehicle.DIRECTIONS.FORWARD) {
    this.setY(this.y + (Math.sin(this.angle_rad) * (direction === Vehicle.DIRECTIONS.BACKWARD ? -1 : 1) * this.speed));
    this.setX(this.x + (Math.cos(this.angle_rad) * (direction === Vehicle.DIRECTIONS.BACKWARD ? -1 : 1) * this.speed));
  }

  rotate (direction: String = Vehicle.DIRECTIONS.CLOCKWISE) {
    this.setAngle(this.angle + (this.angle_speed * (direction === Vehicle.DIRECTIONS.ANTICLOCKWISE ? -1 : 1)))
  }

  rotateGun (direction: String = Vehicle.DIRECTIONS.CLOCKWISE) {
    this.setGunAngle(this.gun_angle + (this.gun_angle_speed * (direction === Vehicle.DIRECTIONS.ANTICLOCKWISE ? -1 : 1)))
  }

}

export default Vehicle
