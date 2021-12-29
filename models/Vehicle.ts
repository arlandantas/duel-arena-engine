import { degreeToRad, normalizeDegrees } from "../helpers/math";
import Action from "../interfaces/Action";

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

  public colors: VehicleColors = {
    wheel: 'black',
    gun: 'black',
    tank: 'black'
  }

  private actions: Array<Action> = [];

  constructor (x: number = 0, y: number = 0, angle: number = 90, colors?: VehicleColors) {
    this.setX(x)
    this.setY(y)
    this.setAngle(angle)
    this.setGunAngle(0)
    this.colors = colors ?? this.colors;
  }

  static ACTIONS = {
    MOVEFORWARD: 'MOVEFORWARD',
    MOVEBACKWARD: 'MOVEBACKWARD',
    ROTATECLOCKWISE: 'ROTATECLOCKWISE',
    ROTATEANTICLOCKWISE: 'ROTATEANTICLOCKWISE',
    ROTATEGUNCLOCKWISE: 'ROTATEGUNCLOCKWISE',
    ROTATEGUNANTICLOCKWISE: 'ROTATEGUNANTICLOCKWISE',
  }

  private setX (x: number) { this.x = x }

  private setY (y: number) { this.y = y }

  addAction (action: Action) { this.actions.push(action) };

  setSpeed (speed: number) { this.speed = (speed < 30 ? speed : 30) }
  
  setAngleSpeed (angle_speed: number) { this.angle_speed = (angle_speed < 90 ? angle_speed : 90) }
  
  setGunAngleSpeed (gun_angle_speed: number) { this.gun_angle_speed = (gun_angle_speed < 90 ? gun_angle_speed : 90) }

  executeAction() {
    const currAction = this.actions.shift();

    if (!currAction) throw new Error('Action list is empty')

    switch (currAction?.type) {
      case Vehicle.ACTIONS.MOVEFORWARD: 
        this.setSpeed(10);
        break;
      case Vehicle.ACTIONS.MOVEBACKWARD:
        this.setSpeed(-10);
        break;
      case Vehicle.ACTIONS.ROTATECLOCKWISE:
        this.setAngleSpeed(30);
        break;
      case Vehicle.ACTIONS.ROTATEANTICLOCKWISE:
        this.setAngleSpeed(-30);
        break;
      case Vehicle.ACTIONS.ROTATEGUNCLOCKWISE:
        this.setGunAngleSpeed(30);
        break;
      case Vehicle.ACTIONS.ROTATEGUNANTICLOCKWISE:
        this.setGunAngleSpeed(-30);
        break;
      default: 
        throw new Error('Action type not found');
    }
  }

  update () {
    if (this.speed != 0) {
      this.move();
      this.setSpeed(0);
    }
    if (this.angle_speed != 0) {
      this.rotate();
      this.setAngleSpeed(0);
    }
    if (this.gun_angle_speed != 0) {
      this.rotateGun();
      this.setGunAngleSpeed(0);
    }
  }

  private setAngle (angle: number) {
    this.angle = normalizeDegrees(angle);
    this.angle_rad = degreeToRad(this.angle);
  }

  private setGunAngle (gun_angle: number) {
    this.gun_angle = normalizeDegrees(gun_angle);
    this.gun_angle_rad = degreeToRad(this.gun_angle);
  }

  move () {
    this.setY(this.y + (Math.sin(this.angle_rad) * this.speed));
    this.setX(this.x + (Math.cos(this.angle_rad) * this.speed));
  }

  rotate () {
    this.setAngle(this.angle + this.angle_speed)
  }

  rotateGun () {
    this.setGunAngle(this.gun_angle + this.gun_angle_speed)
  }

  getX() { return this.x }
  getY() { return this.y }
  getSpeed() { return this.speed }
  getAngle() { return this.angle }
  getAngleSpeed() { return this.angle_speed }
  getGunAngle() { return this.gun_angle }
  getGunAngleSpeed() { return this.gun_angle_speed }

}
interface VehicleColors {
  wheel: string,
  gun: string,
  tank: string
}

export default Vehicle
