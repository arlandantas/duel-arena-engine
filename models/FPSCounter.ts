class FPSCounter {
	private currentSecond: number;
	private framesCounter: number;
	private lastSecondCounter: number;

	constructor() {
		this.currentSecond = Math.floor(Date.now()/1000);
		this.framesCounter = 0;
		this.lastSecondCounter = 0;
	}

	getLastSecondCounter(): number {
		return this.lastSecondCounter;
	}

	addTickToCurrentSecond(): void {
		const currentSecond = Math.floor(Date.now()/1000);
		if (currentSecond === this.currentSecond) {
			this.framesCounter++;
		} else {
			this.currentSecond = currentSecond;
			this.lastSecondCounter = this.framesCounter;
			this.framesCounter = 0;
		}
	}

}

export default FPSCounter;