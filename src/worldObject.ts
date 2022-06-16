import { Array4 } from './typedArray'

export abstract class WorldObject {
  protected constructor(public color: Array4) {
  }

  abstract distanceTo(point: Array4): number
}