class Action {
  private type: string;
  private params: Array<any> = [];

  constructor (type: string, ...params: Array<any>) {
    this.type = type;
    this.params = params;
  }

  getType(): string { return this.type }

  getParams(): Array<any> { return this.params }

  getParam(index: number, default_value: any = undefined): any {
    return this.params[index] ?? default_value
  }
}

export default Action;