import Bullet from './Bullet';
import Vehicle from './Vehicle';

class World {
  
  private vehicles: WorldVehicles = {};
  private bullets: Array<Bullet> = [];

  constructor () {};

  addVehicle (vehicle: Vehicle): string {
    const randomId = Math.random().toString(25);
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