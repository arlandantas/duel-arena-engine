import Action from "../interfaces/Action";

class VehicleController {
	private vehicle_id: string = '';
	private addAction: Function = () => {};

	constructor(vehicle_id: string, addAction: (a: Action) => void) {
		this.vehicle_id = vehicle_id;
		this.addAction = addAction;
	}

	moveForward() {
		this.addAction({ action: 'moveForward' });
	}
}


export default VehicleController;