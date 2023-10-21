import P5 from "p5";

const WINDOW_WIDTH: number = MAP_NUM_COLS * TILE_SIZE;
const WINDOW_HEIGHT: number = MAP_NUM_ROWS * TILE_SIZE;

class Tilemap {
  public grid: Array<Array<number>>;

  public constructor() {
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
    ];
  }

  public render(): void {
    for (let i: number = 0; i < MAP_NUM_ROWS; i++) {
      for (let j: number = 0; j < MAP_NUM_COLS; j++) {
          let tileX: number = j * TILE_SIZE;
          let tileY: number = i * TILE_SIZE;
          let tileColor: string = this.grid[i][j] == 1 ? "#222" : "#fff";

          p5.stroke("#222");
          P5.fill(tileColor);
          P5.rect(tileX, tileY, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

let grid: Tilemap = new Tilemap();

function setup(): void {
  P5.createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function update(): void {
  // TODO: update all game objects before we render the next frame
}

function draw(): void {
  update();

  grid.render();
}
