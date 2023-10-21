import P5 from "p5"

export class Tilemap {
  public grid: Array<Array<number>>
  public tileSize: number
	public numRows: number
	public numCols: number

  private renderer: P5
  private scaleFactor: number

  public constructor(renderer: P5, tileSize: number, numRows: number, numCols: number, scaleFactor: number) {
    this.renderer = renderer
    this.scaleFactor = scaleFactor
		this.tileSize = tileSize
		this.numRows = numRows
		this.numCols = numCols
    this.grid = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
  }

	public getWallAt(x: number, y: number): number {
    const col: number = Math.floor(x / this.tileSize)
    const row: number = Math.floor(y / this.tileSize)

		return this.grid[row][col]
	}

	public isWallAt(x: number, y: number): boolean {
    if (
      (x < 0 || x >= this.numCols * this.tileSize)
      || (y < 0 || y >= this.numRows * this.tileSize)
    ) {
      return true
    }

    return this.getWallAt(x, y) != 0
	}

  public render(): void {
    for (let i: number = 0; i < this.numRows; i++) {
      for (let j: number = 0; j < this.numCols; j++) {
        const tileX: number = j * this.tileSize
        const tileY: number = i * this.tileSize
        const [r, g, b]: number[] = getColour(this.grid[i][j])

        this.renderer.stroke("#222")
        this.renderer.fill(r, g, b)
        this.renderer.rect(
          tileX * this.scaleFactor,
          tileY * this.scaleFactor,
          this.tileSize * this.scaleFactor,
          this.tileSize * this.scaleFactor,
        )
      }
    }
  }
}

export const getColour: (col: number) => number[] = (col: number): number[] => {
  switch (col) {
    case 0: // White
      return [255, 255, 255]
    case 1: // Red
      return [70, 70, 70]
    case 2: // Green
      return [0, 255, 0]
    case 3: // Blue
      return [0, 0, 255]
  }

  return [80, 80, 80]
}
