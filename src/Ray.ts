import P5 from "p5"

export class Ray {
	private renderer: P5
	private rayAngle: number
	private originX: number
	private originY: number

	public constructor(renderer: P5, origX: number, origY: number, rayAngle: number) {
		this.renderer = renderer
		this.rayAngle = rayAngle
		this.originX = origX
		this.originY = origY
	}

	public render(): void {
		this.renderer.stroke("yellow")
		this.renderer.line(
			this.originX,
			this.originY,
			this.originX + Math.cos(this.rayAngle) * 30,
			this.originY + Math.sin(this.rayAngle) * 30,
		)
	}
}
