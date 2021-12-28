import { degreeToRad } from "../helpers/math";

class Vehicle {
  #x = 0;
  #y = 0;
  #speed = 0;

  #angle = 90;
  #angle_rad = 0;
  #angle_speed = 0;
  
  #gun_angle = 0;
  #gun_angle_rad = 0;
  #gun_angle_speed = 0;

  constructor (x = 0, y = 0, angle = 90) {
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

  setX (x) { this.#x = x }

  setY (y) { this.#y = y }

  setSpeed (speed) { this.#speed = speed }
  
  setAngleSpeed (angle_speed) { this.#angle_speed = angle_speed }
  
  setGunAngleSpeed (gun_angle_speed) { this.#gun_angle_speed = gun_angle_speed }

  setAngle (angle) {
    this.#angle = angle;
    this.#angle_rad = degreeToRad(this.#angle + 90);
  }

  setGunAngle (gun_angle) {
    this.#gun_angle = gun_angle;
    this.#gun_angle_rad = degreeToRad(this.#gun_angle + 90);
  }

  move (direction = this.DIRECTIONS.FORWARD) {
    this.setY(this.#y + (Math.sin(this.#angle_rad) * (direction === this.DIRECTIONS.BACKWARD ? -1 : 1) * this.#speed));
    this.setX(this.#x + (Math.cos(this.#angle_rad) * (direction === this.DIRECTIONS.BACKWARD ? -1 : 1) * this.#speed));
  }

  rotate (direction = this.DIRECTIONS.CLOCKWISE) {
    this.setAngle(this.#angle + (this.#angle_speed * (direction === this.DIRECTIONS.ANTICLOCKWISE ? -1 : 1)))
  }

  rotateGun (direction = this.DIRECTIONS.CLOCKWISE) {
    this.setGunAngle(this.#gun_angle + (this.#gun_angle_speed * (direction === this.DIRECTIONS.ANTICLOCKWISE ? -1 : 1)))
  }

}