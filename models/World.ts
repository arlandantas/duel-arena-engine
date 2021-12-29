import VehicleController from '../controllers/VehicleController';
import Bullet from './Bullet';
import Vehicle from './Vehicle';

class World {
  
  private vehicles: WorldVehicles = {};
  private bullets: Array<Bullet> = [];
  private vehicleControllers: Array<VehicleController> = [];
  private vehicleActionsOrder: Array<string> = [];

  constructor () {};

  addVehicleController (vehicle_id: string): void {
    const vehicleController = new VehicleController(vehicle_id, (action: string) => {
      this.getVehicle(vehicle_id).addAction(action);
      this.vehicleActionsOrder.push(vehicle_id);
    })
  }

  executeLoop () {
    this.vehicleActionsOrder.forEach( vehicle_id => {
      const vehicle = this.getVehicle(vehicle_id);
      vehicle.executeAction();
    });

    this.vehicleActionsOrder = [];

    Object.values(this.vehicles).forEach( vehicle => {
      vehicle.move();
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