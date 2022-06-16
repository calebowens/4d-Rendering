import { dotN, ArrayN } from './typedArray'

export type Matrix<Width extends number, Height extends number> = [ArrayN<Width>, ...ArrayN<Width>[]] & { length: Height }

export function mulMatrix<Width extends number, Height extends number, RHSWidth extends number>
(lhs: Matrix<Width, Height>, rhs: Matrix<RHSWidth, Width>): Matrix<RHSWidth, Height> {
  const height = lhs[0].length
  const rhsWidth = rhs.length

  const output = []
  for (let i = 0; i !== rhsWidth; ++i) {
    output.push(Array(height).fill(0))
  }

  const lhsTranspose = transpose(lhs)


  for (let x = 0; x < height; ++x) {
    for (let y = 0; y < rhsWidth; ++y) {
      // @ts-ignore
      output[y][x] = dotN(lhsTranspose[x], rhs[y])
    }
  }

  return output as Matrix<RHSWidth, Height>
}

export function transpose<Width extends number, Height extends number>
  (lhs: Matrix<Width, Height>): Matrix<Height, Width> {
  const height = lhs[0].length
  const width = lhs.length

  const output = []
  for (let i = 0; i !== width; ++i) {
    output.push(Array(height).fill(0))
  }

  for (let x = 0; x < width; ++x) {
    for (let y = 0; y < height; ++y) {
      output[y][x] = lhs[x][y]
    }
  }
  
  return output as Matrix<Height, Width>
}

export function inverse(mat: Matrix<2, 2>): Matrix<2, 2> {
  const det = det2(mat)

  return [
    [mat[1][1] / det, -mat[0][1] / det],
    [-mat[1][0] / det, mat[0][0] / det]
  ] as Matrix<2, 2>
}

export function det2(mat: Matrix<2, 2>) {
  return mat[0][0] * mat[1][1] - mat[1][0] * mat[0][1]
}

export function det3(mat: Matrix<3, 3>) {
  const one = [
    [mat[0][1], mat[0][2]],
    [mat[1][1], mat[1][2]]
  ] as Matrix<2, 2>

  const two = [
    [mat[0][1], mat[0][2]],
    [mat[2][1], mat[2][2]]
  ] as Matrix<2, 2>

  const three = [
    [mat[1][1], mat[1][2]],
    [mat[2][1], mat[2][2]]
  ] as Matrix<2, 2>

  return det2(one) - det2(two) + det2(three)
}