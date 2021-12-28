import Vehicle from "./models/Vehicle";
import World from "./models/World";

let w = new World();

w.addVehicle(new Vehicle(10, 10, 0));

const v: Vehicle = w.getVehicle(0);

v.setSpeed(10);
// v.move();

// v.setAngleSpeed(90);
// v.rotate();

v.move();

console.log("I have created a world!", w.getVehicle(0));
