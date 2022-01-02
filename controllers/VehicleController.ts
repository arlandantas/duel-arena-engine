import Action from "../models/Action";
import Vehicle from "../models/Vehicle";
import World from "../models/World";

class VehicleController {
	private vehicle_id: string = '';
	private world: World|null = null;
	private actionListener: ((a: Action) => void) = () => {};

	constructor(vehicle_id: string) {
		if (!vehicle_id) throw new Error('Vehicle id should not be empty');
		this.vehicle_id = vehicle_id;
	}

	setActionListener(listener: (a: Action) => void) {
		this.actionListener = listener;
	}

	private addAction(action: Action): void {
		this.actionListener(action);
	};

	loop() { }

	moveForward(speed: number = 10) {
		this.addAction(new Action(Vehicle.ACTIONS.MOVEFORWARD, { speed }));
	}

	moveBackward(speed: number = 10) {
		this.addAction(new Action(Vehicle.ACTIONS.MOVEBACKWARD, { speed }));
	}

	rotateClockwise(speed: number = 30) {
		this.addAction(new Action(Vehicle.ACTIONS.ROTATECLOCKWISE, { speed }));
	}

	rotateAnticlockwise(speed: number = 30) {
		this.addAction(new Action(Vehicle.ACTIONS.ROTATEANTICLOCKWISE, { speed }));
	}

	rotateGunClockwise(speed: number = 30) {
		this.addAction(new Action(Vehicle.ACTIONS.ROTATEGUNCLOCKWISE, { speed }));
	}

	rotateGunAnticlockwise(speed: number = 30) {
		this.addAction(new Action(Vehicle.ACTIONS.ROTATEGUNANTICLOCKWISE, { speed }));
	}

	fire() {
		this.addAction(new Action(Vehicle.ACTIONS.FIRE));
	}

	getVehicle(): Vehicle|null {
		if (!this.world) return null

		return this.world.getVehicle(this.getVehicleId())
	}

	getVehicles(): Array<Vehicle> {
		if (!this.world) return []

		return this.world.getVehicles()
	}

	setWorld(world: World) { this.world = world }
	
	getVehicleId(): string { return this.vehicle_id }
}


export default VehicleController;