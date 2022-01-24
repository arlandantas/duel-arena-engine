import { degreeToRad, normalizeDegrees } from "../helpers/math";

class Angle {
	public degree: number = 0;
	public radian: number = 0;
	public cos: number = 0;
	public sin: number = 0;

	constructor (degree: number) {
			this.changeAngle(degree);
	}

	changeAngle (degree: number) {
		this.radian = degreeToRad(degree);
    this.degree = normalizeDegrees(degree);
    this.sin = Math.sin(this.radian);
    this.cos = Math.cos(this.radian);
	}
}

export default Angle;