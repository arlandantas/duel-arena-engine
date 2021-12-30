import { Vehicle } from "..";
import Action from "../models/Action";

class VehicleController {
	private vehicle_id: string = '';
	private actionListeners: Array<(a: Action) => void> = [];

	constructor(vehicle_id: string) {
		if (!vehicle_id) throw new Error('Vehicle id should not be empty');
		this.vehicle_id = vehicle_id;
	}

	addListener(listener: (a: Action) => void) {
		this.actionListeners.push(listener);
	}

	private addAction(action: Action) {
		this.actionListeners.forEach(listener => listener(action));
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

	getVehicleId(): string { return this.vehicle_id }
}


export default VehicleController;