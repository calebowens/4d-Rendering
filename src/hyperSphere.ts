import { WorldObject } from './worldObject'
import { Array4, size4, sub4 } from './typedArray'

export class HyperSphere extends WorldObject {
  constructor(private point: Array4, private radius: number, color = [143, 206, 0, 1] as Array4) {
    super(color)
  }

  distanceTo(point: Array4): number {
    const thisPoint = this.point.slice(0) as Array4

    sub4(thisPoint, point)
    return Math.max(size4(thisPoint) - this.radius, 0)
  }
}