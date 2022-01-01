import VehicleController from '../controllers/VehicleController';
import Bullet from './Bullet';
import Vehicle from './Vehicle';
import Action from './Action';
import Heart from './Heart';
import { checkBoundariesOvelap } from '../helpers/math';
import { Position } from '..';

class World {

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
    this.updateInterval = setInterval(() => this.updateObjects(), 10);
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

  addVehicleController (controller: VehicleController): void {
    controller.addListener((action: Action) => {
      this.getVehicle(controller.getVehicleId()).addAction(action);
      this.vehicleActionsOrder.push(controller.getVehicleId());
    });
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

    this.updatingObjects = false;
  }

  checkCollisions() {
    Object.values(this.vehicles).forEach((vehicle) => {
      const vehicleBoundaries = vehicle.getBoundaries();
      this.bullets.forEach((bullet, k) => {
        const bulletBoundaries = bullet.getBoundaries();
        if (checkBoundariesOvelap(vehicleBoundaries, bulletBoundaries)) {
          vehicle.applyDamage(bullet.getDamageToApply(vehicle))
          this.bullets.splice(k, 1);
        }
      });
      this.hearts.forEach((heart, k) => {
        const heartBoundaries = heart.getBoundaries();
        if (checkBoundariesOvelap(vehicleBoundaries, heartBoundaries)) {
          vehicle.removeDamage(heart.getDamageToRemove(vehicle))
          this.hearts.splice(k, 1);
        }
      });
      if (vehicle.getLife() <= 0) {
        // TODO: Remove vehicleController
        delete this.vehicles[vehicle.getVehicleId()]
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
        return this.bullets.splice(k, 1);
      }

      const bulletBoundaries = bullet.getBoundaries();
      if (checkBoundariesOvelap(this.getBoundaries(), bulletBoundaries)) {
        return this.bullets.splice(k, 1);
      }
    });
  }

  executeLoops() {
    this.vehicleControllers.forEach(controller => {
      controller.loop();
    });
  }

  addVehicle (vehicle: Vehicle): string {
    let randomId = Math.random().toString(25);
    while (this.vehicles[randomId]) {
      randomId = Math.random().toString(25);
    }
    this.vehicles[randomId] = vehicle;
    vehicle.setVehicleId(randomId)
    return randomId;
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