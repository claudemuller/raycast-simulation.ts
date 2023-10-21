import P5 from "p5"
import { Tilemap, getColour } from "./Tilemap"
import { Player } from "./Player"
import { Ray } from "./Ray"

const TILE_SIZE = 64
const MAP_NUM_ROWS = 11
const MAP_NUM_COLS = 15
const WINDOW_WIDTH: number = MAP_NUM_COLS * TILE_SIZE
const WINDOW_HEIGHT: number = MAP_NUM_ROWS * TILE_SIZE

const FOV_ANGLE: number = 60 * Math.PI / 180

const WALL_STRIP_WIDTH = 1
const NUM_RAYS: number = WINDOW_WIDTH / WALL_STRIP_WIDTH

const MINIMAP_SCALE_FACTOR = 0.2

const K_W: number = 87
const K_S: number = 83
const K_A: number = 65
const K_D: number = 68
  
const game = (p5: P5): void => {
  let grid: Tilemap = new Tilemap(
    p5,
    TILE_SIZE,
    MAP_NUM_ROWS,
    MAP_NUM_COLS,
    MINIMAP_SCALE_FACTOR,
  )
  let player: Player = new Player(p5, WINDOW_WIDTH/2, WINDOW_HEIGHT/2, MINIMAP_SCALE_FACTOR)
  let rays: Array<Ray> = []

  const castAllRays: () => void = (): void => {
    let rayAngle: number = player.rotationAngle - (FOV_ANGLE / 2)
    rays.length = 0
    
    for (let col: number = 0; col < NUM_RAYS; col++) {
      const ray: Ray = new Ray(p5, player.x, player.y, rayAngle, MINIMAP_SCALE_FACTOR)
      ray.cast(grid)
      rays.push(ray)
      rayAngle += FOV_ANGLE / NUM_RAYS
    }
  }

  const renderProjectedWalls: () => void = (): void => {
    for (let i: number = 0; i < NUM_RAYS; i++) {
      const correctedWallDistance: number = rays[i].distance * Math.cos(rays[i].rayAngle - player.rotationAngle)
      const distanceProjectionPlane: number = WINDOW_WIDTH / 2 / Math.tan(FOV_ANGLE / 2)
      const wallStripHeight: number = TILE_SIZE / correctedWallDistance * distanceProjectionPlane

      let alpha: number = 170 / correctedWallDistance
      alpha = rays[i].wasHitVertical ? 0.95 : alpha;

      // const brightness: number = rays[i].wasHitVertical ? 1.0 : 0.9;
      // const [r, g, b]: number[] = getColour(grid.getWallAt(rays[i].wallHitX, rays[i].wallHitY))
      const adjustedR: number = 255; //Math.min(255, Math.max(0, r * brightness))
      const adjustedG: number = 255; //Math.min(255, Math.max(0, g * brightness))
      const adjustedB: number = 255; //Math.min(255, Math.max(0, b * brightness))
 
      p5.fill(`rgba(${adjustedR}, ${adjustedG}, ${adjustedB}, ${alpha})`)
      p5.noStroke()
      p5.rect(
        i * WALL_STRIP_WIDTH,
        WINDOW_HEIGHT / 2 - wallStripHeight / 2,        
        WALL_STRIP_WIDTH,
        wallStripHeight,
      )
    }
  }

  const update: () => void = (): void => {
    player.update(grid)
    castAllRays()
  }

  p5.setup = (): void => {
    p5.createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT)
  }

  p5.keyPressed = (): void => {
    if (p5.keyCode == p5.UP_ARROW || p5.keyCode == K_W) {
      player.walkDirection = 1
    } else if (p5.keyCode == p5.DOWN_ARROW || p5.keyCode == K_S) {
      player.walkDirection = -1
    } else if (p5.keyCode == p5.RIGHT_ARROW || p5.keyCode == K_D) {
      player.turnDirection = 1
    } else if (p5.keyCode == p5.LEFT_ARROW || p5.keyCode == K_A) {
      player.turnDirection = -1
    }   
  }

  p5.keyReleased = (): void => {
    if (p5.keyCode == p5.UP_ARROW || p5.keyCode == K_W) {
      player.walkDirection = 0
    } else if (p5.keyCode == p5.DOWN_ARROW || p5.keyCode == K_S) {
      player.walkDirection = 0
    } else if (p5.keyCode == p5.RIGHT_ARROW || p5.keyCode == K_D) {
      player.turnDirection = 0
    } else if (p5.keyCode == p5.LEFT_ARROW || p5.keyCode == K_A) {
      player.turnDirection = 0
    }   
  }

  p5.draw = (): void => {
    update()

    p5.clear(21, 21, 21, 1.0)
    renderProjectedWalls()
    
    grid.render()

    for (const ray of rays) {
      ray.render()
    }

    player.render()
  }
}

new P5(game)
