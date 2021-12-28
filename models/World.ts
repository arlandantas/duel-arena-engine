import Vehicle from './Vehicle';

class World {
  
  private vehicles: Array<Vehicle> = [];

  constructor () {};

  addVehicle (vehicle: Vehicle): World {
    this.vehicles.push(vehicle);
    return this;
  }

  getVehicle (index: number): Vehicle {
    return this.vehicles[index];
  }

}

export default World