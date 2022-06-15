import { Scene } from './scene'
import { Vec, Vec4 } from './vector'

const rayLength = 40

class Ray {
  private direction: Vec4
  constructor (private scene: Scene, private start: Vec4, direction: Vec4) {
    this.direction = direction.unit
  }

  trace(): Vec4 {
    let distanceTraveled = 0
    let workingPoint = this.start

    while (distanceTraveled < rayLength) {
      let [object, distance] = this.scene.getNearestObjectAndDistance(workingPoint)

      // exit condition
      if (distance < 0.03) {
        //const opacityLevel = Math.max(Math.min(Math.round(((distanceTraveled + distance) / rayLength)), 0), 1)

        // const color = object.color.sub(new Vec4([0, 0, 0, opacityLevel]))
        // console.log("hit", color, opacityLevel)

        return object.color
      } else {
        distanceTraveled += distance
        workingPoint = workingPoint.add(this.direction.mul(Vec.fromScalar(distance, 4)))
      }
    }

    return new Vec4([0, 0, 0, 0])
  }
}

function blendColors(bg: Vec4, fg: Vec4) {
  const r = new Vec4([0, 0, 0, 0])
  r.w = 1 - (1 - fg.w) * (1 - bg.w)
  // if (r.w < 1.0e-6) return r; // Fully transparent -- R,G,B not important
  r.x = fg.x * fg.w / r.w + bg.x * bg.w * (1 - fg.w) / r.w
  r.y = fg.y * fg.w / r.w + bg.y * bg.w * (1 - fg.w) / r.w
  r.z = fg.z * fg.w / r.w + bg.z * bg.w * (1 - fg.w) / r.w

  return r
}

export class Camera {
  constructor (private ctx: CanvasRenderingContext2D,
               private scene: Scene,
               private width: number,
               private depth: number,
               private height: number,
               private facing: number,
               private location: Vec4
  ) {}

  updateLocation(facing: number, location) {
    this.facing = facing
    this.location = location
  }

  render() {
    const rays = this.rays

    for (let x in rays) {
      for (let y in rays[x]) {
        let color = new Vec4([255, 255, 255, 1])
        for (let z in rays[x][y].reverse()) {
          color = blendColors(color, rays[x][y][z].trace())
        }

        this.setPixel(Number(x), Number(y), color)
      }
    }

    console.log('done')
  }

  private setPixel(x: number, y: number, color: Vec4) {
    const canvasWidth = this.ctx.canvas.width
    const canvasHeight = this.ctx.canvas.height

    const xWidth = canvasWidth / this.width
    const yHeight = canvasHeight / this.height

    this.ctx.fillStyle = `rgba(${color.x}, ${color.y}, ${color.z}, ${color.w})`
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
          const startingPosition = this.location.add(new Vec4([
            (-this.width / 2 + i) * facingC + k * facingS,
            (-this.width / 2 + i) * facingS + k * facingC,
            (-this.height / 2 + j),
            0
          ]))

          output[i][j][k] = new Ray(this.scene, startingPosition, new Vec4([
            y,
            x,
            z,
            1
          ]))
        }
      }
    }

    return output
  }
}