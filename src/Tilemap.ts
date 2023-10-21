import P5 from "p5"

export class Tilemap {
  public grid: Array<Array<number>>

  private renderer: P5
  private tileSize: number
	private numRows: number
	private numCols: number

  public constructor(renderer: P5, tileSize: number, numRows: number, numCols: number) {
    this.renderer = renderer
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

	public isWallAt(x: number, y: number): boolean {
    const col: number = Math.floor(x / this.tileSize)
    const row: number = Math.floor(y / this.tileSize)
		return this.grid[row][col] == 1
	}

  public render(): void {
    for (let i: number = 0; i < this.numRows; i++) {
      for (let j: number = 0; j < this.numCols; j++) {
          let tileX: number = j * this.tileSize
          let tileY: number = i * this.tileSize
          let tileColour: string = this.grid[i][j] == 1 ? "#222" : "#fff"

          this.renderer.stroke("#222")
          this.renderer.fill(tileColour)
          this.renderer.rect(tileX, tileY, this.tileSize, this.tileSize)
      }
    }
  }
}
