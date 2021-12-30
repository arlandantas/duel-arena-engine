import ActionParams from '../interfaces/ActionParams';

class Action {
  private type: string;
  private params: ActionParams = {};

  constructor (type: string, params: ActionParams = {}) {
    this.type = type;
    this.params = params;
  }

  getType(): string { return this.type }

  getParams(): ActionParams { return this.params }

  getParam(param_name: string, default_value: any = undefined): any {
    return this.params[param_name] ?? default_value
  }
}

export default Action;