import VehicleController from '../controllers/VehicleController';
import Action from '../interfaces/Action';
import Bullet from './Bullet';
import Vehicle from './Vehicle';

class World {
  
  private vehicles: WorldVehicles = {};
  private bullets: Array<Bullet> = [];
  private vehicleControllers: Array<VehicleController> = [];
  private vehicleActionsOrder: Array<string> = [];
  private updateInterval: number|null = null;
  private executingActions: boolean = false;
  private updatingObjects: boolean = false;

  constructor () {
    this.updateInterval = setInterval(this.updateObjects, 10);
  };

  addVehicleController (vehicle_id: string): void {
    const vehicleController = new VehicleController(vehicle_id, (action: Action) => {
      this.getVehicle(vehicle_id).addAction(action);
      this.vehicleActionsOrder.push(vehicle_id);
    })
  }

  executeActions () {
    if (this.executingActions) return;

    let currentActions = [ ...this.vehicleActionsOrder ];

    this.executingActions = true;

    while (currentActions.length > 0) {
      const vehicle_id = currentActions.shift();
      if (!vehicle_id) throw new Error('Empty vehicle id!');

      const vehicle = this.getVehicle(vehicle_id);
      vehicle.executeAction();
    }

    this.executingActions = false;
  }

  updateObjects () {
    if (this.updatingObjects) return;

    this.updatingObjects = true;
    
    Object.values(this.vehicles).forEach( vehicle => {
      vehicle.move();
    });

    this.updatingObjects = false;

    if (!this.executingActions && this.vehicleActionsOrder.length > 0) {
      this.executeActions();
    }
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