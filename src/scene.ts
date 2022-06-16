import { WorldObject } from './worldObject'
import { Array4 } from './typedArray'

export class Scene {
  constructor(public objects: WorldObject[] = []) {
  }

  getNearestObjectAndDistance(point: Array4): [WorldObject, number] {
    let shortestDistance = Infinity
    let nearestObject = this.objects[0]

    for (let object of this.objects) {
      const distance = object.distanceTo(point)
      if (distance < shortestDistance) {
        nearestObject = object
        shortestDistance = distance
      }
    }

    return [nearestObject, shortestDistance]
  }
}