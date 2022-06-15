import { TPoints, Vec } from './vector'

export type Columns<Width extends number, Height extends number> = Vec<Height>[] & { length: Width }

export class Matrix<Width extends number, Height extends number> {
  constructor(public columns: Columns<Width, Height>) {
  }

  mul<RhsWidth extends number>(rhs: Matrix<RhsWidth, Width>): Matrix<RhsWidth, Height> {

    const height = this.columns[0].points.length
    const rhsWidth = rhs.columns.length

    const output = new Array(rhsWidth)
      .fill(0)
      .map(() =>
        new Vec<Height>(
          new Array(height)
            .fill(0) as TPoints<Height>
        )
      ) as Columns<RhsWidth, Height>

    const thisT = this.transpose

    for (let x = 0; x < height; ++x) {
      for (let y = 0; y < rhsWidth; ++y) {
        output[y].points[x] = thisT.columns[x].dot(rhs.columns[y])
      }
    }

    return new Matrix<RhsWidth, Height>(output)
  }

  get transpose(): Matrix<Height, Width> {
    const height = this.columns[0].points.length
    const width = this.columns.length

    const output = new Array(height)
      .fill(0)
      .map(() =>
        new Vec<Width>(
          new Array(width)
            .fill(0) as TPoints<Width>
        )
      ) as Columns<Height, Width>

    for (let x = 0; x < width; ++x) {
      for (let y = 0; y < height; ++y) {
        output[y].points[x] = this.columns[x].points[y]
      }
    }

    return new Matrix<Height, Width>(output)
  }
}

export function inverse(mat: Matrix<2, 2>) {
  const det = det2(mat)

  return new Matrix<2, 2>([
    new Vec([mat.columns[1].points[1] / det, -mat.columns[0].points[1] / det]),
    new Vec([-mat.columns[1].points[0] / det, mat.columns[0].points[0] / det])
  ] as Columns<2, 2>)
}

export function det2(mat: Matrix<2, 2>) {
  return mat.columns[0].points[0] * mat.columns[1].points[1] - mat.columns[1].points[0] * mat.columns[0].points[1]
}

export function det3(mat: Matrix<3, 3>) {
  const one = new Matrix<2, 2>([
    new Vec<2>([mat.columns[0].points[1], mat.columns[0].points[2]]),
    new Vec<2>([mat.columns[1].points[1], mat.columns[1].points[2]])
  ] as Columns<2, 2>)

  const two = new Matrix<2, 2>([
    new Vec<2>([mat.columns[0].points[1], mat.columns[0].points[2]]),
    new Vec<2>([mat.columns[2].points[1], mat.columns[2].points[2]])
  ] as Columns<2, 2>)

  const three = new Matrix<2, 2>([
    new Vec<2>([mat.columns[1].points[1], mat.columns[1].points[2]]),
    new Vec<2>([mat.columns[2].points[1], mat.columns[2].points[2]])
  ] as Columns<2, 2>)

  return det2(one) - det2(two) + det2(three)
}