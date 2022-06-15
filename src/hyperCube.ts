import { WorldObject } from './worldObject'
import { Vec4 } from './vector'
import { Parallelepiped } from './parallelepiped'

export class HyperCube extends WorldObject {
  private portions: Parallelepiped[]

  constructor(start: Vec4, width: number, color = new Vec4([227, 141, 51, 1])) {
    super(color)

    this.portions = [
      // Whole Real
      Parallelepiped.fromDirections(
        start,
        [
          new Vec4([width, 0, 0, 0]),
          new Vec4([0, width, 0, 0]),
          new Vec4([0, 0, width, 0])
        ]
      ),
      // Whole Complex
      Parallelepiped.fromDirections(
        start.add(new Vec4([0, 0, 0, width])),
        [
          new Vec4([width, 0, 0, 0]),
          new Vec4([0, width, 0, 0]),
          new Vec4([0, 0, width, 0])
        ]
      ),
      // Bottom Merge
      Parallelepiped.fromDirections(
        start,
        [
          new Vec4([width, 0, 0, 0]),
          new Vec4([0, width, 0, 0]),
          new Vec4([0, 0, 0, width])
        ]
      ),
      // Left Merge
      Parallelepiped.fromDirections(
        start,
        [
          new Vec4([0, 0, 0, width]),
          new Vec4([0, width, 0, 0]),
          new Vec4([0, 0, width, 0])
        ]
      ),
      // Front Merge
      Parallelepiped.fromDirections(
        start,
        [
          new Vec4([width, 0, 0, 0]),
          new Vec4([0, 0, 0, width]),
          new Vec4([0, 0, width, 0])
        ]
      ),
      // Top Merge
      Parallelepiped.fromDirections(
        start.add(new Vec4([0, 0, width, width])),
        [
          new Vec4([width, 0, 0, 0]),
          new Vec4([0, width, 0, 0]),
          new Vec4([0, 0, 0, -width])
        ]
      ),
      // Back Merge
      Parallelepiped.fromDirections(
        start.add(new Vec4([0, width, 0, 0])),
        [
          new Vec4([width, 0, 0, 0]),
          new Vec4([0, 0, 0, width]),
          new Vec4([0, 0, width, 0])
        ]
      ),
      // Right Merge
      Parallelepiped.fromDirections(
        start.add(new Vec4([width, 0, 0, 0])),
        [
          new Vec4([0, 0, 0, width]),
          new Vec4([0, width, 0, 0]),
          new Vec4([0, 0, width, 0])
        ]
      ),
    ]
  }

  distanceTo(point: Vec4): number {
    return this.portions.map((portion) => portion.distanceTo(point))
      .reduce((n, acc) => n < acc ? n : acc, Infinity)
  }
}