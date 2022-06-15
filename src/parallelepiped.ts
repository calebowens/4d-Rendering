import { Vec, Vec3, Vec4 } from './vector'
import { Columns, det3, Matrix } from './matrix'
import { Tableau } from 'gaussian-elimination-co'
import { WorldObject } from './worldObject'

export class Parallelepiped extends WorldObject {
  a: Vec4
  b: Vec4
  c: Vec4
  d: Vec4

  constructor([a, b, c, d]: Vec4[], color = new Vec4([9, 74, 254, 1])) {
    super(color)

    this.a = a
    this.b = b
    this.c = c
    this.d = d
  }

  static fromDirections(point: Vec4, [B, C, D]: Vec4[]) {
    return new Parallelepiped([
      point,
      point.add(B),
      point.add(C),
      point.add(D)
    ])
  }

  distanceTo(point: Vec4) {
    return this.getPointOnOutside(point).sub(point).size
  }

  getPointOnOutside(point: Vec4) {
    // We need to map the point to a side, edge, or vertex

    const [B, C, D] = this.directions
    const [alpha, beta, gamma] = this.normalToPointMultiples(point)
    const [alphaV, betaV, gammaV] = [alpha, beta, gamma].map((value) => Vec.fromScalar(value, 4))

    const alphaLess = alpha < 0
    const alphaMore = alpha > 1
    const betaLess = beta < 0
    const betaMore = beta > 1
    const gammaLess = gamma < 0
    const gammaMore = gamma > 1

    // this.a corner
    if (alphaLess && betaLess && gammaLess) {
      return this.a
    }

    // this.b corner
    if (alphaMore && betaLess && gammaLess) {
      return this.b
    }

    // this.c corner
    if (alphaLess && betaMore && gammaLess) {
      return this.c
    }

    // this.d corner
    if (alphaLess && betaLess && gammaMore) {
      return this.d
    }

    // AD + AC corner
    if (alphaLess && betaMore && gammaMore) {
      return this.a.add(D).add(C)
    }

    // AD + AB corner
    if (alphaMore && betaLess && gammaMore) {
      return this.a.add(D).add(B)
    }

    // AB + AC corner
    if (alphaMore && betaMore && gammaLess) {
      return this.a.add(B).add(C)
    }

    // AB + AD + AC corner
    if (alphaMore && betaMore && gammaMore) {
      return this.a.add(B).add(C).add(D)
    }

    // AB edge
    if (betaLess && gammaLess) {
      return this.a.add(B.mul(alphaV))
    }

    // AC edge
    if (gammaLess && alphaLess) {
      return this.a.add(C.mul(betaV))
    }

    // AD edge
    if (betaLess && alphaLess) {
      return this.a.add(D.mul(gammaV))
    }

    // AD -> AB edge
    if (betaLess && gammaMore) {
      return this.a.add(D).add(B.mul(alphaV))
    }

    // AD -> AC edge
    if (gammaMore && alphaLess) {
      return this.a.add(D).add(C.mul(betaV))
    }

    // AB -> AD edge
    if (alphaMore && betaLess) {
      return this.a.add(B).add(D.mul(gammaV))
    }

    // AC -> AD edge
    if (betaMore && alphaLess) {
      return this.a.add(C).add(D.mul(gammaV))
    }

    // AB -> AC edge
    if (alphaMore && gammaLess) {
      return this.a.add(B).add(C.mul(betaV))
    }

    // AC -> AB edge
    if (gammaLess && betaMore) {
      return this.a.add(C).add(B.mul(alphaV))
    }

    // AD -> AC -> AB edge
    if (gammaMore && betaMore) {
      return this.a.add(D).add(C).add(B.mul(alphaV))
    }

    // AD -> AB -> AC edge
    if (alphaMore && gammaMore) {
      return this.a.add(D).add(B).add(C.mul(betaV))
    }

    // AB -> AC -> AD edge
    if (alphaMore && betaMore) {
      return this.a.add(B).add(C).add(D.mul(gammaV))
    }

    // ADB plane
    if (betaLess) {
      return this.a.add(B.mul(alphaV)).add(D.mul(gammaV))
    }

    // ACD plane
    if (alphaLess) {
      return this.a.add(D.mul(gammaV)).add(C.mul(betaV))
    }

    // ACB plane
    if (gammaLess) {
      return this.a.add(B.mul(alphaV)).add(C.mul(betaV))
    }

    // AC -> ADB plane
    if (betaMore) {
      return this.a.add(C).add(B.mul(alphaV)).add(D.mul(gammaV))
    }

    // AB -> ACD plane
    if (alphaMore) {
      return this.a.add(B).add(D.mul(gammaV)).add(C.mul(betaV))
    }

    // AD -> ACB plane
    if (gammaMore) {
      return this.a.add(D).add(B.mul(alphaV)).add(C.mul(betaV))
    }

    return this.a
      .add(B.mul(alphaV))
      .add(C.mul(betaV))
      .add(D.mul(gammaV))
  }

  containsPoint(point: Vec4) {
    const [alpha, beta, gamma] = this.normalToPointMultiples(point)

    console.log(alpha, beta, gamma)

    return alpha >= 0 && alpha <= 1
      && beta >= 0 && beta <= 1
      && gamma >= 0 && gamma <= 1
  }

  normalToPointMultiples(point: Vec4) {
    const [B, C, D] = this.directions
    const N = this.normal

    const tableau = Tableau.from([
      [[B.x, C.x, D.x, -N.x], [point.x - this.a.x]],
      [[B.y, C.y, D.y, -N.y], [point.y - this.a.y]],
      [[B.z, C.z, D.z, -N.z], [point.z - this.a.z]],
      [[B.w, C.w, D.w, -N.w], [point.w - this.a.w]],
    ])

    tableau.solve()

    return tableau.getLHSFirsts()
  }

  get directions() {
    const B = this.b.sub(this.a)
    const C = this.c.sub(this.a)
    const D = this.d.sub(this.a)

    return [B, C, D]
  }

  get normal() {
    const [B, C, D] = this.directions

    /*
    | i , j , k , l |
    | b1, b2, b3, b4|
    | c1, c2, c3, c4|
    | d1, d2, d3, d4|
     */

    const Mat1 = new Matrix<3, 3>([
        new Vec3([B.y, C.y, D.y]),
        new Vec3([B.z, C.z, D.z]),
        new Vec3([B.w, C.w, D.w])
      ] as Columns<3, 3>
    )

    const Mat2 = new Matrix<3, 3>([
        new Vec3([B.x, C.x, D.x]),
        new Vec3([B.z, C.z, D.z]),
        new Vec3([B.w, C.w, D.w])
      ] as Columns<3, 3>
    )

    const Mat3 = new Matrix<3, 3>([
        new Vec3([B.x, C.x, D.x]),
        new Vec3([B.y, C.y, D.y]),
        new Vec3([B.w, C.w, D.w])
      ] as Columns<3, 3>
    )

    const Mat4 = new Matrix<3, 3>([
        new Vec3([B.x, C.x, D.x]),
        new Vec3([B.y, C.y, D.y]),
        new Vec3([B.z, C.z, D.z])
      ] as Columns<3, 3>
    )

    return new Vec4([
      det3(Mat1),
      -det3(Mat2),
      det3(Mat3),
      -det3(Mat4)
    ])
  }
}