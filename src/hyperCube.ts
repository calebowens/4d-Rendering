import { WorldObject } from './worldObject'
import { Parallelepiped } from './parallelepiped'
import { add4, Array4 } from './typedArray'

export class HyperCube extends WorldObject {
  private portions: Parallelepiped[]

  constructor(start: Array4, width: number, color = [227, 141, 51, 1] as Array4) {
    super(color)

    const hc = [0, 0, 0, width] as Array4
    add4(hc, start)
    const tm = [0, 0, width, width] as Array4
    add4(tm, start)
    const bm = [0, width, 0, 0] as Array4
    add4(bm, start)
    const rm = [width, 0, 0, 0] as Array4
    add4(rm, start)

    this.portions = [
      // Whole Real
      Parallelepiped.fromDirections(
        start,
        [
          [width, 0, 0, 0],
          [0, width, 0, 0],
          [0, 0, width, 0]
        ] as Array4[]
      ),
      // Whole Complex
      Parallelepiped.fromDirections(
        hc,
        [
          [width, 0, 0, 0],
          [0, width, 0, 0],
          [0, 0, width, 0]
        ] as Array4[]
      ),
      // Bottom Merge
      Parallelepiped.fromDirections(
        start,
        [
          [width, 0, 0, 0],
          [0, width, 0, 0],
          [0, 0, 0, width]
        ] as Array4[]
      ),
      // Left Merge
      Parallelepiped.fromDirections(
        start,
        [
          [0, 0, 0, width],
          [0, width, 0, 0],
          [0, 0, width, 0]
        ] as Array4[]
      ),
      // Front Merge
      Parallelepiped.fromDirections(
        start,
        [
          [width, 0, 0, 0],
          [0, 0, 0, width],
          [0, 0, width, 0]
        ] as Array4[]
      ),
      // Top Merge
      Parallelepiped.fromDirections(
        tm,
        [
          [width, 0, 0, 0],
          [0, width, 0, 0],
          [0, 0, 0, -width]
        ] as Array4[]
      ),
      // Back Merge
      Parallelepiped.fromDirections(
        bm,
        [
          [width, 0, 0, 0],
          [0, 0, 0, width],
          [0, 0, width, 0]
        ] as Array4[]
      ),
      // Right Merge
      Parallelepiped.fromDirections(
        rm,
        [
          [0, 0, 0, width],
          [0, width, 0, 0],
          [0, 0, width, 0]
        ] as Array4[]
      ),
    ]
  }

  distanceTo(point: Array4): number {
    let out = Infinity

    for (let i = 0; i !== 8; ++i) {
      const distance = this.portions[i].distanceTo(point)

      if (distance < out) {
        out = distance
      }
    }

    return out
  }
}