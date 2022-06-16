export type Array4 = [number, ...number[]] & { length: 4 }
export type Array3 = [number, ...number[]] & { length: 3 }
export type ArrayN<Length extends number> = [number, ...number[]] & { length: Length }


export function add4(lhs: Array4, rhs: Array4) {
  for (let i = 0; i !== 4; ++i) {
    lhs[i] = lhs[i] + rhs[i]
  }
}

export function sub4(lhs: Array4, rhs: Array4) {
  for (let i = 0; i !== 4; ++i) {
    lhs[i] = lhs[i] - rhs[i]
  }
}

export function mul4(lhs: Array4, rhs: Array4) {
  for (let i = 0; i !== 4; ++i) {
    lhs[i] = lhs[i] * rhs[i]
  }
}

export function mulScalar4(lhs: Array4, scalar: number) {
  for (let i = 0; i !== 4; ++i) {
    lhs[i] = lhs[i] * scalar
  }
}

export function div4(lhs: Array4, rhs: Array4) {
  for (let i = 0; i !== 4; ++i) {
    lhs[i] = lhs[i] / rhs[i]
  }
}

export function size4(lhs: Array4) {
  let sum = 0

  for (let i = 0; i !== 4; ++i) {
    sum += lhs[i] ** 2
  }

  return sum ** 0.5
}

export function unit4(lhs: Array4) {
  const size = size4(lhs)

  mulScalar4(lhs, 1 / size)
}

export function add3(lhs: Array3, rhs: Array3) {
  for (let i = 0; i !== 3; ++i) {
    lhs[i] = lhs[i] + rhs[i]
  }
}

export function sub3(lhs: Array3, rhs: Array3) {
  for (let i = 0; i !== 3; ++i) {
    lhs[i] = lhs[i] - rhs[i]
  }
}

export function mul3(lhs: Array3, rhs: Array3) {
  for (let i = 0; i !== 3; ++i) {
    lhs[i] = lhs[i] * rhs[i]
  }
}

export function div3(lhs: Array3, rhs: Array3) {
  for (let i = 0; i !== 3; ++i) {
    lhs[i] = lhs[i] / rhs[i]
  }
}

export function mulScalar3(lhs: Array4, scalar: number) {
  for (let i = 0; i !== 3; ++i) {
    lhs[i] = lhs[i] * scalar
  }
}

export function dotN<N extends number>(lhs: ArrayN<N>, rhs: ArrayN<N>) {
  let sum = 0

  for (let i = 0; i !== lhs.length; ++i) {
    sum += lhs[i] * rhs[i]
  }

  return sum
}