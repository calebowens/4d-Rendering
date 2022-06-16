import { det3, Matrix } from './matrix'
import { Tableau } from './gaussianElimination'
import { WorldObject } from './worldObject'
import { add4, Array4, mulScalar4, size4, sub4 } from './typedArray'

export class Parallelepiped extends WorldObject {
  a: Array4
  b: Array4
  c: Array4
  d: Array4

  AB: Array4
  AC: Array4
  AD: Array4

  normal: Array4

  constructor([a, b, c, d]: Array4[], color = [9, 74, 254, 1] as Array4) {
    super(color)

    this.a = a
    this.b = b
    this.c = c
    this.d = d

    this.AB = b.slice(0) as Array4
    sub4(this.AB, a)
    this.AC = c.slice(0) as Array4
    sub4(this.AC, a)
    this.AD = d.slice(0) as Array4
    sub4(this.AD, a)

    this.normal = this.generateNormal()
  }

  static fromDirections(point: Array4, [B, C, D]: Array4[]) {
    add4(B, point)
    add4(C, point)
    add4(D, point)

    return new Parallelepiped([
      point,
      B,
      C,
      D
    ])
  }

  distanceTo(point: Array4) {
    const out = this.getPointOnOutside(point)

    sub4(out, point)

    return size4(out)
  }

  getPointOnOutside(point: Array4) {
    // We need to map the point to a side, edge, or vertex

    const [alpha, beta, gamma] = this.normalToPointMultiples(point)

    const alphaLess = alpha < 0
    const alphaMore = alpha > 1
    const betaLess = beta < 0
    const betaMore = beta > 1
    const gammaLess = gamma < 0
    const gammaMore = gamma > 1

    // this.a corner
    if (alphaLess && betaLess && gammaLess) {
      return this.a.slice() as Array4
    }

    // this.b corner
    if (alphaMore && betaLess && gammaLess) {
      return this.b.slice() as Array4
    }

    // this.c corner
    if (alphaLess && betaMore && gammaLess) {
      return this.c.slice() as Array4
    }

    // this.d corner
    if (alphaLess && betaLess && gammaMore) {
      return this.d.slice() as Array4
    }

    // AD + AC corner
    if (alphaLess && betaMore && gammaMore) {
      const out = this.a.slice() as Array4

      add4(out, this.AD)
      add4(out, this.AC)

      return out
    }

    // AD + AB corner
    if (alphaMore && betaLess && gammaMore) {
      const out = this.a.slice() as Array4

      add4(out, this.AD)
      add4(out, this.AB)

      return out
    }

    // AB + AC corner
    if (alphaMore && betaMore && gammaLess) {
      const out = this.a.slice() as Array4

      add4(out, this.AB)
      add4(out, this.AC)

      return out
    }

    // AB + AD + AC corner
    if (alphaMore && betaMore && gammaMore) {
      const out = this.a.slice() as Array4

      add4(out, this.AB)
      add4(out, this.AC)
      add4(out, this.AD)

      return out
    }

    // AB edge
    if (betaLess && gammaLess) {
      const out = this.a.slice() as Array4
      const AB = this.AB.slice() as Array4

      mulScalar4(AB, alpha)
      add4(out, AB)

      return out
    }

    // AC edge
    if (gammaLess && alphaLess) {
      const out = this.a.slice() as Array4
      const AC = this.AC.slice() as Array4

      mulScalar4(AC, beta)
      add4(out, AC)

      return out
    }

    // AD edge
    if (betaLess && alphaLess) {
      const out = this.a.slice() as Array4
      const AD = this.AD.slice() as Array4

      mulScalar4(AD, gamma)
      add4(out, AD)

      return out
    }

    // AD -> AB edge
    if (betaLess && gammaMore) {
      const out = this.a.slice() as Array4
      const AB = this.AB.slice() as Array4

      mulScalar4(AB, alpha)
      add4(out, this.AD)
      add4(out, AB)

      return out
    }

    // AD -> AC edge
    if (gammaMore && alphaLess) {

      const out = this.a.slice() as Array4
      const AC = this.AC.slice() as Array4

      mulScalar4(AC, beta)
      add4(out, this.AD)
      add4(out, AC)

      return out
    }

    // AB -> AD edge
    if (alphaMore && betaLess) {

      const out = this.a.slice() as Array4
      const AD = this.AD.slice() as Array4

      mulScalar4(AD, gamma)
      add4(out, this.AB)
      add4(out, AD)

      return out
    }

    // AC -> AD edge
    if (betaMore && alphaLess) {

      const out = this.a.slice() as Array4
      const AD = this.AD.slice() as Array4

      mulScalar4(AD, alpha)
      add4(out, this.AC)
      add4(out, AD)

      return out
    }

    // AB -> AC edge
    if (alphaMore && gammaLess) {
      const out = this.a.slice() as Array4
      const AC = this.AC.slice() as Array4

      mulScalar4(AC, beta)
      add4(out, this.AB)
      add4(out, AC)

      return out
    }

    // AC -> AB edge
    if (gammaLess && betaMore) {
      const out = this.a.slice() as Array4
      const AB = this.AB.slice() as Array4

      mulScalar4(AB, alpha)
      add4(out, this.AC)
      add4(out, AB)

      return out
    }

    // AD -> AC -> AB edge
    if (gammaMore && betaMore) {
      const out = this.a.slice() as Array4
      const AB = this.AB.slice() as Array4

      mulScalar4(AB, alpha)
      add4(out, this.AD)
      add4(out, this.AC)
      add4(out, AB)

      return out
    }

    // AD -> AB -> AC edge
    if (alphaMore && gammaMore) {
      const out = this.a.slice() as Array4
      const AC = this.AC.slice() as Array4

      mulScalar4(AC, beta)
      add4(out, this.AD)
      add4(out, this.AB)
      add4(out, AC)

      return out
    }

    // AB -> AC -> AD edge
    if (alphaMore && betaMore) {
      const out = this.a.slice() as Array4
      const AD = this.AD.slice() as Array4

      mulScalar4(AD, gamma)
      add4(out, this.AB)
      add4(out, this.AC)
      add4(out, AD)

      return out
    }

    // ADB plane
    if (betaLess) {
      const out = this.a.slice() as Array4
      const AB = this.AB.slice() as Array4
      const AD = this.AD.slice() as Array4

      mulScalar4(AB, alpha)
      mulScalar4(AD, gamma)
      add4(out, AB)
      add4(out, AD)

      return out
    }

    // ACD plane
    if (alphaLess) {
      const out = this.a.slice() as Array4
      const AC = this.AC.slice() as Array4
      const AD = this.AD.slice() as Array4

      mulScalar4(AC, beta)
      mulScalar4(AD, gamma)
      add4(out, AC)
      add4(out, AD)

      return out
    }

    // ACB plane
    if (gammaLess) {
      const out = this.a.slice() as Array4
      const AB = this.AB.slice() as Array4
      const AC = this.AC.slice() as Array4

      mulScalar4(AB, alpha)
      mulScalar4(AC, beta)
      add4(out, AB)
      add4(out, AC)

      return out
    }

    // AC -> ADB plane
    if (betaMore) {
      const out = this.a.slice() as Array4
      const AB = this.AB.slice() as Array4
      const AD = this.AD.slice() as Array4

      mulScalar4(AB, alpha)
      mulScalar4(AD, gamma)
      add4(out, this.AC)
      add4(out, AB)
      add4(out, AD)

      return out
    }

    // AB -> ACD plane
    if (alphaMore) {
      const out = this.a.slice() as Array4
      const AC = this.AC.slice() as Array4
      const AD = this.AD.slice() as Array4

      mulScalar4(AC, beta)
      mulScalar4(AD, gamma)
      add4(out, this.AB)
      add4(out, AC)
      add4(out, AD)

      return out
    }

    // AD -> ACB plane
    if (gammaMore) {
      const out = this.a.slice() as Array4
      const AB = this.AB.slice() as Array4
      const AC = this.AC.slice() as Array4

      mulScalar4(AB, alpha)
      mulScalar4(AC, beta)
      add4(out, this.AD)
      add4(out, AB)
      add4(out, AC)

      return out
    }

    const out = this.a.slice() as Array4
    const AB = this.AB.slice() as Array4
    const AC = this.AC.slice() as Array4
    const AD = this.AD.slice() as Array4

    mulScalar4(AB, alpha)
    mulScalar4(AC, beta)
    mulScalar4(AD, gamma)
    add4(out, AB)
    add4(out, AC)
    add4(out, AD)

    return out
  }

  containsPoint(point: Array4) {
    const [alpha, beta, gamma] = this.normalToPointMultiples(point)

    return alpha >= 0 && alpha <= 1
      && beta >= 0 && beta <= 1
      && gamma >= 0 && gamma <= 1
  }

  normalToPointMultiples(point: Array4) {
    const tableau = Tableau.from([
      [[this.AB[0], this.AC[0], this.AD[0], -this.normal[0]], [point[0] - this.a[0]]],
      [[this.AB[1], this.AC[1], this.AD[1], -this.normal[1]], [point[1] - this.a[1]]],
      [[this.AB[2], this.AC[2], this.AD[2], -this.normal[2]], [point[2] - this.a[2]]],
      [[this.AB[3], this.AC[3], this.AD[3], -this.normal[3]], [point[3] - this.a[3]]],
    ])

    tableau.solve()

    return tableau.getLHSFirsts() as Array4
  }

  private generateNormal() {
    /*
    | i , j , k , l |
    | b1, b2, b3, b4|
    | c1, c2, c3, c4|
    | d1, d2, d3, d4|
     */

    const Mat1 = [
        [this.AB[1], this.AC[1], this.AD[1]],
        [this.AB[2], this.AC[2], this.AD[2]],
        [this.AB[3], this.AC[3], this.AD[3]]
      ] as Matrix<3, 3>

    const Mat2 = [
        [this.AB[0], this.AC[0], this.AD[0]],
        [this.AB[2], this.AC[2], this.AD[2]],
        [this.AB[3], this.AC[3], this.AD[3]]
      ] as Matrix<3, 3>

    const Mat3 = [
        [this.AB[0], this.AC[0], this.AD[0]],
        [this.AB[1], this.AC[1], this.AD[1]],
        [this.AB[3], this.AC[3], this.AD[3]]
      ] as Matrix<3, 3>

    const Mat4 = [
        [this.AB[0], this.AC[0], this.AD[0]],
        [this.AB[1], this.AC[1], this.AD[1]],
        [this.AB[2], this.AC[2], this.AD[2]]
      ] as Matrix<3, 3>

    return [
      det3(Mat1),
      -det3(Mat2),
      det3(Mat3),
      -det3(Mat4)
    ] as Array4
  }
}