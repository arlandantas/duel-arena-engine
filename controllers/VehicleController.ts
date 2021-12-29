class VehicleController {
	private vehicle_id: string = '';
	private addAction: Function = () => {};

	constructor(vehicle_id: string, addAction: (a: string) => void) {
		this.vehicle_id = vehicle_id;
		this.addAction = addAction;
	}

	moveForward() {
		this.addAction('moveForward');
	}
}


export default VehicleController;