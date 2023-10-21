import P5 from "p5"
import { Tilemap } from "./Tilemap"

export class Ray {
  public distance: number = 0
  public rayAngle: number
  public wasHitVertical: boolean = false
	public wallHitX: number = 0
	public wallHitY: number = 0
	public wallHitColour: number = 0

	private renderer: P5
	private originX: number
	private originY: number
	private isRayFacingDown: boolean
	private isRayFacingUp: boolean
	private isRayFacingRight: boolean
	private isRayFacingLeft: boolean
	private scaleFactor: number	

	public constructor(renderer: P5, origX: number, origY: number, rayAngle: number, scaleFactor: number) {
		this.renderer = renderer
		this.rayAngle = normaliseAngle(rayAngle)
		this.originX = origX
		this.originY = origY
		this.isRayFacingDown = this.rayAngle > 0 && this.rayAngle < Math.PI
		this.isRayFacingUp = !this.isRayFacingDown
		this.isRayFacingRight = this.rayAngle < 0.5 * Math.PI || this.rayAngle > 1.5 * Math.PI
		this.isRayFacingLeft = !this.isRayFacingRight
		this.scaleFactor = scaleFactor
	}

	public cast(tilemap: Tilemap): void {
		// Horizontal intercept
		let yIntercept: number = Math.floor(this.originY / tilemap.tileSize) * tilemap.tileSize
		yIntercept += this.isRayFacingDown ? tilemap.tileSize : 0

		let xIntercept: number = this.originX + (yIntercept - this.originY) / Math.tan(this.rayAngle)
		
		let yStep: number = tilemap.tileSize
		yStep *= this.isRayFacingUp ? -1 : 1

		let xStep: number = tilemap.tileSize / Math.tan(this.rayAngle)
		xStep *= this.isRayFacingLeft && xStep > 0 ? -1 : 1
		xStep *= this.isRayFacingRight && xStep < 0 ? -1 : 1

		let nextHorzTouchX: number = xIntercept
		let nextHorzTouchY: number = yIntercept
		let foundHorzWallHit: boolean = false
		let horzWallHitX: number = 0
		let horzWallHitY: number = 0
		let horzWallHitColour: number = 0
		
		while ( 
      nextHorzTouchX >= 0 && nextHorzTouchX <= tilemap.numCols * tilemap.tileSize
      && nextHorzTouchY >= 0 && nextHorzTouchY <= tilemap.numRows * tilemap.tileSize
		) {
      const wallGridContent: number = tilemap.getWallContentAt(
          nextHorzTouchX,
          nextHorzTouchY + (this.isRayFacingUp ? -1 : 0),
      );
      if (wallGridContent != 0) {
				foundHorzWallHit = true
				horzWallHitX = nextHorzTouchX
				horzWallHitY = nextHorzTouchY
				horzWallHitColour = wallGridContent
				break
			}

			nextHorzTouchX += xStep
			nextHorzTouchY += yStep
		}

		// Vertical intercept
    xIntercept = Math.floor(this.originX / tilemap.tileSize) * tilemap.tileSize
    xIntercept += this.isRayFacingRight ? tilemap.tileSize : 0

    yIntercept = this.originY + (xIntercept - this.originX) * Math.tan(this.rayAngle)

    xStep = tilemap.tileSize
    xStep *= this.isRayFacingLeft ? -1 : 1

    yStep = tilemap.tileSize * Math.tan(this.rayAngle)
    yStep *= this.isRayFacingUp && yStep > 0 ? -1 : 1
    yStep *= this.isRayFacingDown && yStep < 0 ? -1 : 1

    let nextVertTouchX: number = xIntercept
    let nextVertTouchY: number = yIntercept
		let foundVertWallHit: boolean = false
    let vertWallHitX: number = 0
    let vertWallHitY: number = 0
		let vertWallHitColour: number = 0

    while (
      nextVertTouchX >= 0 && nextVertTouchX <= tilemap.numCols * tilemap.tileSize
      && nextVertTouchY >= 0 && nextVertTouchY <= tilemap.numRows * tilemap.tileSize
		) {
			const wallGridContent: number = tilemap.getWallContentAt(
          nextVertTouchX + (this.isRayFacingLeft ? -1 : 0),
          nextVertTouchY,
      );
      if (wallGridContent != 0) {
        foundVertWallHit = true
        vertWallHitX = nextVertTouchX
        vertWallHitY = nextVertTouchY
				vertWallHitColour = wallGridContent
        break
			}

      nextVertTouchX += xStep
      nextVertTouchY += yStep
    }

    let horzHitDistance: number = foundHorzWallHit
        ? distanceBetweenPoints(this.originX, this.originY, horzWallHitX, horzWallHitY)
        : Number.MAX_VALUE
    let vertHitDistance: number = foundVertWallHit
        ? distanceBetweenPoints(this.originX, this.originY, vertWallHitX, vertWallHitY)
        : Number.MAX_VALUE

		if (vertHitDistance < horzHitDistance) {
			this.wallHitX = vertWallHitX
			this.wallHitY = vertWallHitY
			this.distance = vertHitDistance
	    this.wasHitVertical = true
			this.wallHitColour = vertWallHitColour
			return
		}

    this.wallHitX = horzWallHitX
    this.wallHitY = horzWallHitY
    this.distance = horzHitDistance
    this.wasHitVertical = false
		this.wallHitColour = horzWallHitColour
	}

	public render(): void {
		this.renderer.stroke("rgba(255, 0, 0, 0.05)")
		this.renderer.line(
			this.originX * this.scaleFactor,
			this.originY * this.scaleFactor,
			this.wallHitX * this.scaleFactor,
			this.wallHitY * this.scaleFactor,
		)
	}
}

function normaliseAngle(angle: number): number {
	let a: number = angle % (2 * Math.PI);
	if (a < 0) {
		a += 2 * Math.PI
	}
	return a
}

function distanceBetweenPoints(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}
