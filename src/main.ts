import { Canvas, registerComponent, WebComponent } from 'wecu'
import { Vec, Vec3, Vec4 } from './vector'
import { Plane } from './plane'
import { Columns, inverse, Matrix } from './matrix'
import { Parallelepiped } from './parallelepiped'
import { Scene } from './scene'
import { HyperCube } from './hyperCube'
import { Camera } from './camera'
import { HyperSphere } from './hyperSphere'

class XCanvas extends WebComponent {
  private canvas = new Canvas()
  private ctx = this.canvas.element.getContext('2d')
  constructor() {
    super()

    this.canvas.element.width = 200
    this.canvas.element.height = 100
  }

  onMount(parent: HTMLElement) {
    const scene = new Scene([])

    scene.objects.push(new HyperCube(new Vec4([-5, 5, -5, 0]), 10))
    scene.objects.push(new HyperCube(new Vec4([-10, 15, -7, 0]), 20, new Vec4([201, 240, 124, 1])))
    scene.objects.push(new HyperSphere(new Vec4([15, 10, 9, 10]), 4))

    const camera = new Camera(this.ctx, scene, 40, 40, 20, -Math.PI / 5, new Vec4([10, -10, 0, 0]))

    camera.render()
  }

  render() {
    return [
      this.canvas
    ]
  }
}

class XSettings extends WebComponent {

}


registerComponent(XCanvas, 'x-canvas')
registerComponent(XSettings, 'x-settings')