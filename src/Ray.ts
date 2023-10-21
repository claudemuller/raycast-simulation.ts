import P5 from "p5"
import { Tilemap } from "./Tilemap"

export class Ray {
  public distance: number = 0
  public rayAngle: number

	private renderer: P5
	private originX: number
	private originY: number
	private wallHitX: number = 0
	private wallHitY: number = 0
	private wasHitVertical: boolean = false
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

	public cast(columnId: number, tilemap: Tilemap): void {
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
		
		while ( 
      (nextHorzTouchX >= 0 || nextHorzTouchX <= tilemap.numCols * tilemap.tileSize)
      || (nextHorzTouchY >= 0 || nextHorzTouchY <= tilemap.numRows * tilemap.tileSize)
		) {
			if (tilemap.isWallAt(nextHorzTouchX, nextHorzTouchY - (this.isRayFacingUp ? 1 : 0))) {
				foundHorzWallHit = true
				horzWallHitX = nextHorzTouchX
				horzWallHitY = nextHorzTouchY
				break
			}

			nextHorzTouchX += xStep
			nextHorzTouchY += yStep
		}

		// Vertical intercept
    xIntercept = Math.floor(this.originX / tilemap.tileSize) * tilemap.tileSize;
    xIntercept += this.isRayFacingRight ? tilemap.tileSize : 0;

    yIntercept = this.originY + (xIntercept - this.originX) * Math.tan(this.rayAngle);

    xStep = tilemap.tileSize;
    xStep *= this.isRayFacingLeft ? -1 : 1;

    yStep = tilemap.tileSize * Math.tan(this.rayAngle);
    yStep *= this.isRayFacingUp && yStep > 0 ? -1 : 1;
    yStep *= this.isRayFacingDown && yStep < 0 ? -1 : 1;

    let nextVertTouchX: number = xIntercept;
    let nextVertTouchY: number = yIntercept;

		let foundVertWallHit: boolean = false;
    let vertWallHitX: number = 0;
    let vertWallHitY: number = 0;

    while (
      (nextHorzTouchX >= 0 || nextHorzTouchX <= tilemap.numCols * tilemap.tileSize)
      || (nextHorzTouchY >= 0 || nextHorzTouchY <= tilemap.numRows * tilemap.tileSize)
		) {
      if (tilemap.isWallAt(nextVertTouchX - (this.isRayFacingLeft ? 1 : 0), nextVertTouchY)) {
        foundVertWallHit = true;
        vertWallHitX = nextVertTouchX;
        vertWallHitY = nextVertTouchY;
        break;
			}

      nextVertTouchX += xStep;
      nextVertTouchY += yStep;
    }

    let horzHitDistance: number = foundHorzWallHit
        ? distanceBetweenPoints(this.originX, this.originY, horzWallHitX, horzWallHitY)
        : Number.MAX_VALUE;
    let vertHitDistance: number = foundVertWallHit
        ? distanceBetweenPoints(this.originX, this.originY, vertWallHitX, vertWallHitY)
        : Number.MAX_VALUE;

    this.wallHitX = horzHitDistance < vertHitDistance ? horzWallHitX : vertWallHitX;
    this.wallHitY = horzHitDistance < vertHitDistance ? horzWallHitY : vertWallHitY;
    this.distance = horzHitDistance < vertHitDistance ? horzHitDistance : vertHitDistance;
    this.wasHitVertical = vertHitDistance < horzHitDistance;
	}

	public render(): void {
		this.renderer.stroke("rgba(255, 0, 0, 0.3)")
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
