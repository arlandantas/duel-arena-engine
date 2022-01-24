import { degreeToRad, normalizeDegrees, rotatePoint } from "../helpers/math";
import Position from "../interfaces/Position";
import Damageable from "../interfaces/Damageable";
import Angle from "../interfaces/Angle";
import Action from "./Action";
import World from "./World";
import Bullet from "./Bullet";

class Vehicle extends Damageable {
  private x: number = 0;
  private y: number = 0;
  private speed: number = 0;

  private maxX: number|null = null
  private maxY: number|null = null

  private angle_speed: number = 0;
  private angle: Angle = {
    degree: 90,
    radian: 0,
    sin: 1,
    cos: 0
  };

  
  private gun_angle: number = 0;
  private gun_angle_rad: number = 0;
  private gun_angle_speed: number = 0;

  private vehicle_id: string = ''

  public colors: VehicleColors = {
    wheel: 'black',
    gun: 'black',
    tank: 'black'
  }

  private actions: Array<Action> = [];

  constructor (x: number = 0, y: number = 0, angle: number = 90, colors?: VehicleColors) {
    super(100)
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
    FIRE: 'FIRE',
  }

  static SIZE = {
    WIDTH: 40,
    HEIGHT: 40
  };

  private setX (x: number) { this.x = x }

  private setY (y: number) { this.y = y }

  setMaxBoundaries (x: number, y: number) {
    this.maxX = x
    this.maxY = y
  }

  private normalizeY () {
    if (!this.maxY) return

    const boundariesYs = this.getBoundaries().map(p => p.y)
    const smallestY = Math.min(...boundariesYs)
    if (smallestY < 0) {
      this.y += Math.abs(smallestY)
    }

    const greatestY = Math.max(...boundariesYs)
    if (greatestY > this.maxY) {
      this.y -= greatestY - this.maxY
    }
  }

  private normalizeX () {
    if (!this.maxX) return

    const boundariesXs = this.getBoundaries().map(p => p.x)
    const smallestX = Math.min(...boundariesXs)
    if (smallestX < 0) {
      this.x += Math.abs(smallestX)
    }

    const greatestX = Math.max(...boundariesXs)
    if (greatestX > this.maxX) {
      this.x -= greatestX - this.maxX
    }
  }

  addAction (action: Action) { this.actions.push(action) };

  setVehicleId (vehicle_id: string) { this.vehicle_id = vehicle_id }

  setSpeed (speed: number) {
    this.speed = (speed < 30 ? speed : 30)
  }
  
  setAngleSpeed (angle_speed: number) {
    this.angle_speed = (angle_speed < 90 ? angle_speed : 90)
  }
  
  setGunAngleSpeed (gun_angle_speed: number) {
    this.gun_angle_speed = (gun_angle_speed < 90 ? gun_angle_speed : 90)
  }

  executeAction(): Action|null {
    const currAction = this.actions.shift();

    if (!currAction) return null;

    switch (currAction.getType()) {
      case Vehicle.ACTIONS.MOVEFORWARD:
        this.setSpeed(currAction.getParam('speed', 10));
        break;
      case Vehicle.ACTIONS.MOVEBACKWARD:
        this.setSpeed(currAction.getParam('speed', 10) * -1);
        break;
      case Vehicle.ACTIONS.ROTATECLOCKWISE:
        this.setAngleSpeed(currAction.getParam('speed', 30));
        break;
      case Vehicle.ACTIONS.ROTATEANTICLOCKWISE:
        this.setAngleSpeed(currAction.getParam('speed', 30) * -1);
        break;
      case Vehicle.ACTIONS.ROTATEGUNCLOCKWISE:
        this.setGunAngleSpeed(currAction.getParam('speed', 30));
        break;
      case Vehicle.ACTIONS.ROTATEGUNANTICLOCKWISE:
        this.setGunAngleSpeed(currAction.getParam('speed', 30) * -1);
        break;
      case Vehicle.ACTIONS.FIRE:
        const outPoint = rotatePoint(
          {
            x: this.x + Vehicle.SIZE.WIDTH + Bullet.RADIUS + 5,
            y: this.y + Vehicle.SIZE.HEIGHT / 2
          },
          {
            x: this.x + Vehicle.SIZE.WIDTH / 2,
            y: this.y + Vehicle.SIZE.HEIGHT / 2
          },
          this.gun_angle_rad + this.angle.radian
        );
        return new Action(World.ACTIONS.ADD_BULLET, {
          angle: this.gun_angle + this.angle.degree,
          x: outPoint.x,
          y: outPoint.y,
          speed: 2
        });
      default: 
        throw new Error('Action type not found');
    }

    return null;
  }

  getBoundaries(): Array<Position> {
    const originPosition = {
      x: this.x + (Vehicle.SIZE.WIDTH / 2),
      y: this.y + (Vehicle.SIZE.HEIGHT / 2),
    }
    return [
      rotatePoint(
        this.getPosition(),
        originPosition,
        this.angle.radian
      ),
      rotatePoint(
        { x: this.x + Vehicle.SIZE.WIDTH, y: this.y },
        originPosition,
        this.angle.radian
      ),
      rotatePoint(
        { x: this.x + Vehicle.SIZE.WIDTH, y: this.y + Vehicle.SIZE.HEIGHT },
        originPosition,
        this.angle.radian
      ),
      rotatePoint(
        { x: this.x, y: this.y + Vehicle.SIZE.HEIGHT },
        originPosition,
        this.angle.radian
      ),
    ];
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
    this.normalizeX()
    this.normalizeY()
  }

  private setAngle (angle: number) {
    const angleRad = degreeToRad(angle);
    this.angle = {
      degree: normalizeDegrees(angle),
      radian: angleRad,
      sin: Math.sin(angleRad),
      cos: Math.cos(angleRad)
    };
  }

  private setGunAngle (gun_angle: number) {
    this.gun_angle = normalizeDegrees(gun_angle);
    this.gun_angle_rad = degreeToRad(this.gun_angle);
  }

  move () {
    this.setY(this.y + (this.angle.sin * this.speed));
    this.setX(this.x + (this.angle.cos * this.speed));
  }

  rotate () {
    this.setAngle(this.angle.degree + this.angle_speed);
  }

  rotateGun () {
    this.setGunAngle(this.gun_angle + this.gun_angle_speed)
  }

  getPosition(): Position { return { x: this.x, y: this.y } }
  getSpeed() { return this.speed }
  getAngle() { return this.angle.degree }
  getAngleSpeed() { return this.angle_speed }
  getGunAngle() { return this.gun_angle }
  getGunAngleSpeed() { return this.gun_angle_speed }
  getVehicleId() { return this.vehicle_id }

}
interface VehicleColors {
  wheel: string,
  gun: string,
  tank: string
}

export default Vehicle
