import { Vec, Vec4 } from './vector'
import { Columns, inverse, Matrix } from './matrix'

export class Plane {
  public a: Vec4
  public b: Vec4
  public c: Vec4

  constructor([a, b, c]: Vec4[]) {
    this.a = a
    this.b = b
    this.c = c
  }

  distanceTo(point: Vec4) {
    const B = this.b.sub(this.a)
    const C = this.c.sub(this.a)
    const P = point.sub(this.a)

    const A = new Matrix([B, C])

    // sqrt(sum((p-a*inv(a'*a)*a'*p).^2))

    return P.sub(
      A.mul(
        inverse(A.transpose.mul(A) as Matrix<2, 2>)
          .mul(A.transpose as Matrix<4, 2>))
        .mul(new Matrix([P])).columns[0])
      .pow(2)
      .sum ** 0.5
  }
}