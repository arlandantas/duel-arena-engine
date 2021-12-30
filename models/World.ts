import VehicleController from '../controllers/VehicleController';
import Bullet from './Bullet';
import Vehicle from './Vehicle';
import Action from './Action';

class World {
  
  private vehicles: WorldVehicles = {};
  private bullets: Array<Bullet> = [];
  private vehicleControllers: Array<VehicleController> = [];
  private vehicleActionsOrder: Array<string> = [];
  private updateInterval: number|null = null;
  private executingVehicleActions: boolean = false;
  private updatingObjects: boolean = false;

  static ACTIONS = {
    ADD_BULLET: 'ADD_BULLET',
  };

  constructor () {};
  
  startUpdates() {
    this.updateInterval = setInterval(() => this.updateObjects(), 10);
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

    Object.values(this.bullets).forEach(bullet => {
      bullet.update();
    });

    this.updatingObjects = false;
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
}

interface WorldVehicles {
  [key: string]: Vehicle
}

export default World