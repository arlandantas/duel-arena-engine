import VehicleController from './VehicleController';

class AIVehicleController extends VehicleController {
  private IAFunction: IACode;

  constructor (vehicle_id: string, code: string) {
    super(vehicle_id);
    this.IAFunction = this.getAICodeFromString(code);

    if (this.IAFunction.setup) {
      this.IAFunction.setup();
    } else {
      throw new Error("IA Controller without setup function");
    }
  }

  getAICodeFromString(code: string): IACode {
    let codeFunction = new Function(
      'move',
      'moveForward',
      'moveBackward',
      'rotateClockwise',
      'rotateAnticlockwise',
      'rotateGunClockwise',
      'rotateGunAnticlockwise',
      `
      ${code}

      return {
        setup: typeof setup == "function" ? setup : (() => { console.error("This IA has no setup method setted") }),
        loop: typeof loop == "function" ? loop : (() => { console.error("This IA has no loop method setted") }),
      };
      `
    );
    return codeFunction(
      () => this.moveForward(),
      () => this.moveForward(),
      () => this.moveBackward(),
      () => this.rotateClockwise(),
      () => this.rotateAnticlockwise(),
      () => this.rotateGunClockwise(),
      () => this.rotateGunAnticlockwise()
    );
  }

  loop() {
    if (this.IAFunction.loop) {
      this.IAFunction.loop();
    }
  }
}

interface IACode {
  setup: Function,
  loop: Function,
}

export default AIVehicleController;