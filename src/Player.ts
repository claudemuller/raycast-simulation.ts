import P5 from 'p5'
import { Tilemap } from './Tilemap'

export class Player {
	public turnDirection: number = 0 // -1 for left; +1 for right
	public walkDirection: number = 0 // -1 for back; +1 for front
  public rotationAngle: number = Math.PI / 2
	public x: number
	public y: number

	private renderer: P5
	private rad: number = 3
	private moveSpeed: number = 2.0
	private rotationSpeed: number = 2 * Math.PI / 180
	private scaleFactor: number
	
	public constructor(renderer: P5, initX: number = 10, initY: number = 10, scaleFactor: number) {
		this.renderer = renderer
		this.x = initX
		this.y = initY
		this.scaleFactor = scaleFactor
	}

	public update(grid: Tilemap): void {
		this.rotationAngle += this.turnDirection * this.rotationSpeed

		const moveStep: number = this.walkDirection * this.moveSpeed
		const newX: number = this.x + Math.cos(this.rotationAngle) * moveStep
		const newY: number = this.y + Math.sin(this.rotationAngle) * moveStep

		if (!grid.isWallAt(newX, newY)) {
			this.x = newX
			this.y = newY
		}
	}

	public render(): void {
		this.renderer.noStroke()
    this.renderer.fill("blue")
    this.renderer.circle(
			this.x * this.scaleFactor,
			 this.y * this.scaleFactor,
			 this.rad * this.scaleFactor,
		)
    this.renderer.stroke("blue")
		this.renderer.line(
			this.x * this.scaleFactor,
			this.y * this.scaleFactor,
			(this.x + Math.cos(this.rotationAngle) * 30) * this.scaleFactor,
			(this.y + Math.sin(this.rotationAngle) * 30) * this.scaleFactor,
		)
	}
}
