import VehicleController from './VehicleController';

class AIVehicleController extends VehicleController {
  private IAFunction?: IACode;

  constructor (vehicle_id: string, code: string) {
    super(vehicle_id);
    this.setIAFunction(code);
  }

  setIAFunction(code: string): void {
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
      'getVehicle',
      'getVehicles',
      'fire',
      `
      ${code}

      return {
        setup: typeof setup == "function" ? setup : (() => { console.error("This AI has no setup method setted") }),
        loop: typeof loop == "function" ? loop : (() => { console.error("This AI has no loop method setted") }),
      };
      `
    );
    return codeFunction(
      (speed?: number) => this.moveForward(speed),
      (speed?: number) => this.moveForward(speed),
      (speed?: number) => this.moveBackward(speed),
      (speed?: number) => this.rotateClockwise(speed),
      (speed?: number) => this.rotateAnticlockwise(speed),
      (speed?: number) => this.rotateGunClockwise(speed),
      (speed?: number) => this.rotateGunAnticlockwise(speed),
      () => this.getVehicle(),
      () => this.getVehicles(),
      () => this.fire(),
    );
  }

  loop() {
    if (this.IAFunction && this.IAFunction.loop) {
      this.IAFunction.loop();
    }
  }
}

interface IACode {
  setup: Function,
  loop: Function,
}

export default AIVehicleController;