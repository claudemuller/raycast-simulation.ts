import P5 from "p5"

const TILE_SIZE = 32
const MAP_NUM_ROWS = 10
const MAP_NUM_COLS = 10
const WINDOW_WIDTH: number = MAP_NUM_COLS * TILE_SIZE
const WINDOW_HEIGHT: number = MAP_NUM_ROWS * TILE_SIZE

class Tilemap {
  public grid: Array<Array<number>>

  private renderer: P5;

  public constructor(renderer: P5) {
    this.renderer = renderer
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

  public render(): void {
    for (let i: number = 0; i < MAP_NUM_ROWS; i++) {
      for (let j: number = 0; j < MAP_NUM_COLS; j++) {
          let tileX: number = j * TILE_SIZE
          let tileY: number = i * TILE_SIZE
          let tileColor: string = this.grid[i][j] == 1 ? "#222" : "#fff"

          this.renderer.stroke("#222")
          this.renderer.fill(tileColor)
          this.renderer.rect(tileX, tileY, TILE_SIZE, TILE_SIZE)
      }
    }
  }
}

const sketch = (p5: P5): void => {
  let grid: Tilemap = new Tilemap(p5)

  const update: () => void = (): void => {
    
  }

  p5.setup = (): void => {
    p5.createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT)
  }

  p5.draw = (): void => {
    update()

    grid.render()
  }
}

new P5(sketch);
