import VehicleController from './VehicleController';

class AIVehicleController extends VehicleController {
  private IAFunction: IACode;

  constructor (vehicle_id: string, code: string) {
    super(vehicle_id);
    let codeFunction = new Function(`
      ${code}

      return {
        setup: typeof setup == "function" ? setup : (() => { console.error("This IA has no setup method setted") }),
        loop: typeof loop == "function" ? loop : (() => { console.error("This IA has no loop method setted") }),
      };
    `);
    this.IAFunction = codeFunction();
    this.IAFunction.setup();
  }
}

interface IACode {
  setup: Function,
  loop: Function,
}

export default AIVehicleController;