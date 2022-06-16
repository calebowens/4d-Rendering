import { Scene } from './scene'
import { add4, Array4, mulScalar4, unit4 } from './typedArray'

const rayLength = 40

class Ray {
  private direction: Array4

  constructor (private scene: Scene, private start: Array4, direction: Array4) {
    unit4(direction)

    this.direction = direction
  }

  trace(): Array4 {
    let distanceTraveled = 0
    let workingPoint = this.start

    while (distanceTraveled < rayLength) {
      let [object, distance] = this.scene.getNearestObjectAndDistance(workingPoint)

      // exit condition
      if (distance < 0.05) {
        //const opacityLevel = Math.max(Math.min(Math.round(((distanceTraveled + distance) / rayLength)), 0), 1)

        // const color = object.color.sub(new Vec4([0, 0, 0, opacityLevel]))
        // console.log("hit", color, opacityLevel)

        return object.color
      } else {
        distanceTraveled += distance
        const direction = this.direction.slice() as Array4

        mulScalar4(direction, distance)
        add4(workingPoint, direction)
      }
    }

    return [0, 0, 0, 0] as Array4
  }
}

function blendColors(bg: Array4, fg: Array4) {
  const r = [0, 0, 0, 0] as Array4
  r[3] = 1 - (1 - fg[3]) * (1 - bg[3])
  // if (r.w < 1.0e-6) return r; // Fully transparent -- R,G,B not important
  r[0] = fg[0] * fg[3] / r[3] + bg[0] * bg[3] * (1 - fg[3]) / r[3]
  r[1] = fg[1] * fg[3] / r[3] + bg[1] * bg[3] * (1 - fg[3]) / r[3]
  r[2] = fg[2] * fg[3] / r[3] + bg[2] * bg[3] * (1 - fg[3]) / r[3]

  return r
}

export class Camera {
  constructor (private ctx: CanvasRenderingContext2D,
               private scene: Scene,
               private width: number,
               private depth: number,
               private height: number,
               private facing: number,
               private location: Array4
  ) {}

  updateLocation(facing: number, location: Array4) {
    this.facing = facing
    this.location = location
  }

  render() {
    const rays = this.rays

    for (let x in rays) {
      for (let y in rays[x]) {
        let color = [255, 255, 255, 1] as Array4
        for (let z in rays[x][y].reverse()) {
          color = blendColors(color, rays[x][y][z].trace())
        }

        this.setPixel(Number(x), Number(y), color)
      }
    }

    console.log('done')
  }

  private setPixel(x: number, y: number, color: Array4) {
    const canvasWidth = this.ctx.canvas.width
    const canvasHeight = this.ctx.canvas.height

    const xWidth = canvasWidth / this.width
    const yHeight = canvasHeight / this.height

    this.ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`
    this.ctx.fillRect((x / this.width) * canvasWidth, ((this.height - y - 1) / this.height) * canvasHeight, xWidth, yHeight)
  }

  private get rays(): Ray[][][] {
    const output = new Array(this.width).fill(0)
      .map(() => new Array(this.height).fill(0)
        .map(() => new Array(this.depth).fill(undefined))) as Ray[][][]

    for (let i = 0; i < this.width; ++i) {
      const leftToRight = (-this.width / 2 + i) / this.width * Math.PI / 2 + this.facing

      const x = Math.cos(leftToRight)
      const y = Math.sin(leftToRight)

      const facingC = Math.cos(this.facing)
      const facingS = Math.sin(this.facing)
      console.log(Math.sin(this.facing), Math.cos(this.facing))

      for (let j = 0; j < this.height; ++j) {
        const upDown = (-this.height / 2 + j) / this.height * Math.PI / 2 * (this.ctx.canvas.height / this.ctx.canvas.width)

        const z = Math.sin(upDown)


        for (let k = 0; k < this.depth; ++k) {
          const startingPosition = this.location.slice() as Array4
          add4(startingPosition, [
            (-this.width / 2 + i) * facingC + k * facingS,
            (-this.width / 2 + i) * facingS + k * facingC,
            (-this.height / 2 + j),
            0
          ] as Array4)


          output[i][j][k] = new Ray(this.scene, startingPosition, [
            y,
            x,
            z,
            1
          ] as Array4)
        }
      }
    }

    return output
  }
}