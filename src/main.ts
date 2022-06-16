import { Scene } from './scene'
import { HyperCube } from './hyperCube'
import { Camera } from './camera'
import { HyperSphere } from './hyperSphere'
import { Array4 } from './typedArray'

let time = Date.now()

const canvas = document.querySelector('#canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

const scene = new Scene([])

scene.objects.push(new HyperCube([-5, 5, -5, 0] as Array4, 10))
scene.objects.push(new HyperCube([-10, 15, -7, 0] as Array4, 20, [201, 240, 124, 1] as Array4))
scene.objects.push(new HyperSphere([15, 10, 9, 10] as Array4, 4))

const camera = new Camera(ctx, scene, 40, 40, 20, -Math.PI / 5, [10, -10, 0, 0] as Array4)

camera.render()

console.log((Date.now() - time) / 1000)
