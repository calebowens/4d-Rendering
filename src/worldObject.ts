import { Vec4 } from './vector'

export abstract class WorldObject {
  protected constructor(public color: Vec4) {
  }

  abstract distanceTo(point: Vec4): number
}