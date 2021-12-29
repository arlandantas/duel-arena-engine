import Vehicle from './Vehicle';

class World {
  
  private vehicles: WorldVehicles = {};

  constructor () {};

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
}

interface WorldVehicles {
  [key: string]: Vehicle
}

export default World