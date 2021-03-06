import VehicleController from '../controllers/VehicleController';
import Bullet from './Bullet';
import Vehicle from './Vehicle';
import Action from './Action';
import Heart from './Heart';
import FPSCounter from './FPSCounter';
import { checkBoundariesOvelap } from '../helpers/math';
import { Position } from '..';

class World {
  private fpsCounter: FPSCounter = new FPSCounter();
  private vehicles: WorldVehicles = {};
  private bullets: Array<Bullet> = [];
  private hearts: Array<Heart> = [];
  private vehicleControllers: Array<VehicleController> = [];
  private vehicleActionsOrder: Array<string> = [];
  private updateInterval: number|null = null;
  private executingVehicleActions: boolean = false;
  private updatingObjects: boolean = false;
  private width = 500;
  private height = 500;

  static ACTIONS = {
    ADD_BULLET: 'ADD_BULLET',
  };

  constructor (width: number = 500, height: number = 500) {
    this.width = width;
    this.height = height;
  };
  
  startUpdates() {
    this.stopUpdates();
    this.updateInterval = setInterval(() => this.updateObjects(), 10);
  }
  
  stopUpdates () {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
  }

  addHeart(heart: Heart): void {
    this.hearts.push(heart)
  }

  addHeartOnRandomPosition(): void {
    this.addHeart(new Heart(
      (Math.random() * (this.width - 20)) + 10,
      (Math.random() * (this.height - 20)) + 10
    ))
  }

  private removeHeart(index: number): Heart {
    return this.hearts.splice(index, 1)[0];
  }

  addVehicleController (controller: VehicleController): void {
    controller.setActionListener((action: Action) => {
      this.getVehicle(controller.getVehicleId()).addAction(action);
      this.vehicleActionsOrder.push(controller.getVehicleId());
    });
    controller.setWorld(this);
    this.vehicleControllers.push(controller);
  }

  executeAction(action: Action, vehicle_id: string) {
    switch (action.getType()) {
      case World.ACTIONS.ADD_BULLET:
        this.bullets.push(new Bullet(
          action.getParam('x', 10),
          action.getParam('y', 10),
          action.getParam('angle', 0),
          vehicle_id,
          action.getParam('speed', 50),
        ))
        break;
      default:
        console.error("World action type not found", action.getType());
    }
  }

  executeVehicleActions () {
    if (this.executingVehicleActions) return;

    let currentActions = [ ...this.vehicleActionsOrder ];
    this.vehicleActionsOrder = [];

    this.executingVehicleActions = true;

    while (currentActions.length > 0) {
      const vehicle_id = currentActions.shift();
      if (!vehicle_id) throw new Error('Empty vehicle id!');

      const vehicle = this.getVehicle(vehicle_id);

      if (!vehicle) continue

      const result_action = vehicle.executeAction();

      if (result_action) {
        this.executeAction(result_action, vehicle_id);
      }
    }

    this.executingVehicleActions = false;
  }

  updateObjects () {
    this.executeLoops();

    if (!this.executingVehicleActions && this.vehicleActionsOrder.length > 0) {
      this.executeVehicleActions();
    }

    if (this.updatingObjects) return;

    this.updatingObjects = true;

    Object.values(this.vehicles).forEach( vehicle => {
      vehicle.update();
    });

    this.bullets.forEach(bullet => {
      bullet.update();
    });

    this.checkCollisions();
    this.fpsCounter.addTickToCurrentSecond();

    this.updatingObjects = false;
  }

  getFPSLastSecond(): number {
    return this.fpsCounter.getLastSecondCounter();
  }

  checkCollisions() {
    Object.values(this.vehicles).forEach((vehicle) => {
      const vehicleBoundaries = vehicle.getBoundaries();
      this.bullets.forEach((bullet, k) => {
        const bulletBoundaries = bullet.getBoundaries();
        if (checkBoundariesOvelap(vehicleBoundaries, bulletBoundaries)) {
          vehicle.applyDamage(bullet.getDamageToApply(vehicle))
          this.removeBullet(k);
        }
      });
      this.hearts.forEach((heart, k) => {
        const heartBoundaries = heart.getBoundaries();
        if (checkBoundariesOvelap(vehicleBoundaries, heartBoundaries)) {
          vehicle.removeDamage(heart.getDamageToRemove(vehicle))
          this.removeHeart(k)
        }
      });
      if (vehicle.getLife() <= 0) {
        this.removeVehicle(vehicle.getVehicleId())
      }
    });

    this.bullets.forEach((bullet, k) => {
      const bulletPosition = bullet.getPosition();
      if (
        (bulletPosition.x < 0 - Bullet.RADIUS) ||
        (bulletPosition.y < 0 - Bullet.RADIUS) ||
        (bulletPosition.x > this.width + Bullet.RADIUS) ||
        (bulletPosition.y > this.height + Bullet.RADIUS)
      ) {
        return this.removeBullet(k);
      }

      const bulletBoundaries = bullet.getBoundaries();
      if (checkBoundariesOvelap(this.getBoundaries(), bulletBoundaries)) {
        return this.removeBullet(k);
      }
    });
  }

  executeLoops() {
    this.vehicleControllers.forEach(controller => {
      if (this.vehicles[controller.getVehicleId()]) {
        controller.loop();
      }
    });
  }

  addVehicle (vehicle: Vehicle): string {
    let randomId = Math.random().toString(25);
    while (this.vehicles[randomId]) {
      randomId = Math.random().toString(25);
    }
    this.vehicles[randomId] = vehicle;
    vehicle.setVehicleId(randomId)
    vehicle.setMaxBoundaries(this.width, this.height)
    return randomId;
  }

  private removeVehicle(vehicle_id: string): Vehicle {
    const vehicle = this.getVehicle(vehicle_id)

    if (vehicle) {
      delete this.vehicles[vehicle_id]
      this.vehicleControllers = this.vehicleControllers.filter(c => c.getVehicleId() != vehicle_id)
      return vehicle
    } else {
      throw new Error(`Vehicle not found with id: ${vehicle_id}`)
    }
  }

  getVehicle (id: string): Vehicle {
    return this.vehicles[id];
  }

  getVehicles (): Array<Vehicle> {
    return Object.values(this.vehicles);
  }

  addBullet (bullet: Bullet): void {
    this.bullets.push(bullet);
  }

  private removeBullet(index: number): Bullet {
    return this.bullets.splice(index, 1)[0];
  }

  getBullets (): Array<Bullet> {
    return this.bullets;
  }

  getHearts (): Array<Heart> {
    return this.hearts;
  }

  getWidth (): number {
    return this.width;
  }

  getHeight (): number {
    return this.height;
  }

  getBoundaries (): Array<Position> {
    return [
      { x: 0, y: 0 },
      { x: this.width, y: 0 },
      { x: this.width, y: this.height },
      { x: 0, y: this.height },
    ];
  }
}

interface WorldVehicles {
  [key: string]: Vehicle
}

export default World