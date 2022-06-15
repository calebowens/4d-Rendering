import { WorldObject } from './worldObject'
import { Vec4 } from './vector'

export class HyperSphere extends WorldObject {
  constructor(private point: Vec4, private radius: number, color = new Vec4([143, 206, 0, 1])) {
    super(color)
  }

  distanceTo(point: Vec4): number {
    return Math.max(this.point.sub(point).size - 4, 0)
  }
}