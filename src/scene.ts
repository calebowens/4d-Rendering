import { WorldObject } from './worldObject'
import { Vec4 } from './vector'

export class Scene {
  constructor(public objects: WorldObject[] = []) {
  }

  getNearestObjectAndDistance(point: Vec4): [WorldObject, number] {
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