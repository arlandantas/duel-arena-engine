import { Vehicle } from "..";
import Action from "../interfaces/Action";

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

	moveForward() {
		this.addAction({ type: Vehicle.ACTIONS.MOVEFORWARD });
	}

	moveBackward() {
		this.addAction({ type: Vehicle.ACTIONS.MOVEBACKWARD });
	}

	rotateClockwise() {
		this.addAction({ type: Vehicle.ACTIONS.ROTATECLOCKWISE });
	}

	rotateAnticlockwise() {
		this.addAction({ type: Vehicle.ACTIONS.ROTATEANTICLOCKWISE });
	}

	rotateGunClockwise() {
		this.addAction({ type: Vehicle.ACTIONS.ROTATEGUNCLOCKWISE });
	}

	rotateGunAnticlockwise() {
		this.addAction({ type: Vehicle.ACTIONS.ROTATEGUNANTICLOCKWISE });
	}

	getVehicleId(): string { return this.vehicle_id }
}


export default VehicleController;