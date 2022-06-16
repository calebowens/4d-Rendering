type Tuple<T, Length extends number> = [T, ...T[]] & { length: Length }

/**
 * Returns a new array containing the indices where the predicate is true.
 *
 * @param array The target array
 * @param predicate The filter function
 */
function findAllIndices<T>(array: T[], predicate: (value: T, index: number, array: T[]) => boolean): number[] {
  return array.map((value, index) => predicate(value, index, array) ? index : undefined)
    .filter(((value) => value !== undefined)) as number[]
}

// Credit: https://stackoverflow.com/a/37580979
function* permute<T>(permutation: T[]) {
  yield permutation.slice()

  const length = permutation.length
  let c = new Array(length).fill(0)
  let i = 1

  while (i < length) {
    if (c[i] < i) {
      let k = i % 2 && c[i]
      let p = permutation[i]
      permutation[i] = permutation[k]
      permutation[k] = p
      ++c[i]
      i = 1
      yield permutation.slice()
    } else {
      c[i] = 0
      ++i
    }
  }
}


export class Tableau<LHSWidth extends number, RHSWidth extends number> {
  constructor(private rows: Tuple<Row<LHSWidth, RHSWidth>, LHSWidth>) {
    this.orderRows()
  }

  /**
   * Constructs a tableau from nested arrays
   *
   * @param input
   */
  static from<LHSWidth extends number, RHSWidth extends number>(
    input: Tuple<[Tuple<number, LHSWidth>, Tuple<number, RHSWidth>], LHSWidth>
  ) {
    return new Tableau<LHSWidth, RHSWidth>(
      input.map(([lhs, rhs]) =>
        new Row(
          lhs,
          rhs
        )
      ) as Tuple<Row<LHSWidth, RHSWidth>, LHSWidth>
    )
  }


  /**
   * Solves the set of equations
   */
  solve() {
    this.gauss()

    // this.checkValidity()

    this.jordan()
  }


  /**
   * Gets the left-hand side of the tableau
   */
  getLHS(): Tuple<Tuple<number, RHSWidth>, LHSWidth> {
    return this.rows.map(
      (row) => row.rhs
    ) as Tuple<Tuple<number, RHSWidth>, LHSWidth>
  }

  /**
   * Gets the first elements of the left-hand side of the tableau.
   */
  getLHSFirsts(): Tuple<number, LHSWidth> {
    const out = []

    for (let i = 0; i !== this.rows.length; ++i) {
      out.push(this.rhsGet(i, 0))
    }

    return out as Tuple<number, LHSWidth>
  }

  /**
   * Prints out the Tableau
   */
  inspect() {
    console.log(this.rows.map((row) => [row.lhs, row.rhs]))
  }

  private gauss() {
    for (let i = 0; i < this.rows.length; ++i) {
      this.rows[i].divideBy(this.lhsGet(i, i))

      for (let j = this.rows.length - 1; j > i; --j) {
        this.rows[j].subtractMultiple(
          this.rows[i],
          this.lhsGet(j, i)
        )

        /*
        if (this.lhsGet(j, j) === 0) {
          this.orderRows()
        }
         */
      }
    }
  }

  private checkValidity() {
    for (let i = 0; i < this.rows.length; ++i) {
      if (this.lhsGet(i, i) === 0) {
        throw "LHS is singular and unsolvable"
      }
    }
  }

  private jordan() {
    for (let i = this.rows.length - 1; i >= 0; --i) {
      for (let j = 0; j < i; ++j) {
        this.rows[j].subtractMultiple(
          this.rows[i],
          this.lhsGet(j, i)
        )
      }
    }
  }

  private lhsGet(x: number, y: number) {
    return this.rows[x].lhs[y]
  }

  private rhsGet(x: number, y: number) {
    return this.rows[x].rhs[y]
  }

  /**
   * The LHS matrix needs to have the y=-x entries be non-zero
   * @private
   */
  private orderRows() {
    for (let permutation of permute(this.rows)) {
      let validPermutation = true

      for (let i = 0; i < this.rows.length; ++i) {
        if (!permutation[i].validIndices.includes(i)) {
          validPermutation = false
        }
      }

      if (validPermutation) {
        this.rows = permutation as Tuple<Row<LHSWidth, RHSWidth>, LHSWidth>

        return
      }
    }

    throw "Unable to order LHS to solve system"
  }

  private get lhsWidth(): LHSWidth {
    return this.rows[0].lhs.length
  }

  private get rhsWidth(): RHSWidth {
    return this.rows[0].rhs.length
  }

  private get height(): LHSWidth {
    return this.rows.length
  }
}

/**
 * Is used to build the rows of a Tableau
 */
export class Row<LHSWidth extends number, RHSWidth extends number> {
  validIndices: number[]

  constructor(public lhs: Tuple<number, LHSWidth>, public rhs: Tuple<number, RHSWidth>) {
    this.validIndices = findAllIndices(this.lhs, (value) => value !== 0)
  }

  subtractMultiple(row: Row<LHSWidth, RHSWidth>, multiple: number) {
    for (let i = 0; i !== row.lhs.length; ++i) {
      this.lhs[i] -= row.lhs[i] * multiple
    }

    for (let i = 0; i !== row.rhs.length; ++i) {
      this.rhs[i] -= row.rhs[i] * multiple
    }
  }

  divideBy(multiple: number) {
    for (let i = 0; i !== this.lhs.length; ++i) {
      this.lhs[i] /= multiple
    }

    for (let i = 0; i !== this.rhs.length; ++i) {
      this.rhs[i] /= multiple
    }
  }
}