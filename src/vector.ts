export type TPoints<Length extends number> = [number, ...number[]] & { length: Length }

export class Vec<Length extends number> {
  constructor(public points: TPoints<Length>) {
  }

  static fromScalar<Length extends number>(value: number, length: Length): Vec<Length> {
    return new Vec<Length>(new Array(length).fill(value) as TPoints<Length>)
  }

  protected _add(rhs: Vec<Length>) {
    return this.points.map((point, index) => point + rhs.points[index]) as TPoints<Length>
  }

  add(rhs: Vec<Length>) {
    return new Vec(this._add(rhs))
  }

  protected _sub(rhs: Vec<Length>) {
    return this.points.map((point, index) => point - rhs.points[index]) as TPoints<Length>
  }

  sub(rhs: Vec<Length>) {
    return new Vec(this._sub(rhs))
  }

  protected _mul(rhs: Vec<Length>) {
    return this.points.map((point, index) => point * rhs.points[index]) as TPoints<Length>
  }

  mul(rhs: Vec<Length>) {
    return new Vec(this._mul(rhs))
  }

  protected _div(rhs: Vec<Length>) {
    return this.points.map((point, index) => point / rhs.points[index]) as TPoints<Length>
  }

  protected _pow(power: number) {
    return this.points.map((point) => point ** power) as TPoints<Length>
  }

  pow(power: number) {
    return new Vec(this._pow(power))
  }

  div(rhs: Vec<Length>) {
    return new Vec(this._div(rhs))
  }

  dot(rhs: Vec<Length>) {
    return this._mul(rhs).reduce((n, acc) => n + acc, 0)
  }

  get size() {
    return this.dot(this) ** 0.5
  }

  get sum() {
    return this.points.reduce((n, acc) => n + acc, 0)
  }

  get _unit() {
    const size = this.size

    return this.points.map((point) => point / size) as TPoints<Length>
  }

  get unit() {
    return new Vec<Length>(this._unit)
  }
}

export class Vec3 extends Vec<3> {
  add(rhs: Vec<3>) {
    return new Vec3(this._add(rhs))
  }

  sub(rhs: Vec<3>) {
    return new Vec3(this._sub(rhs))
  }

  mul(rhs: Vec<3>) {
    return new Vec3(this._mul(rhs))
  }

  div(rhs: Vec<3>) {
    return new Vec3(this._div(rhs))
  }

  pow(power: number) {
    return new Vec3(this._pow(power))
  }

  cross(_rhs: Vec<3>) {
    const rhs = new Vec3(_rhs.points)

    return new Vec3([
      this.y * rhs.z - this.z * rhs.y,
      this.z * rhs.x - this.x * rhs.z,
      this.z * rhs.y - this.y * rhs.x
    ])
  }

  get x() {
    return this.points[0]
  }

  set x(val) {
    this.points[0] = val
  }

  get y() {
    return this.points[1]
  }

  set y(val) {
    this.points[1] = val
  }

  get z() {
    return this.points[2]
  }

  set z(val) {
    this.points[2] = val
  }

  get unit() {
    return new Vec3(this._unit)
  }
}


export class Vec4 extends Vec<4> {
  add(rhs: Vec<4>) {
    return new Vec4(this._add(rhs))
  }

  sub(rhs: Vec<4>) {
    return new Vec4(this._sub(rhs))
  }

  mul(rhs: Vec<4>) {
    return new Vec4(this._mul(rhs))
  }

  div(rhs: Vec<4>) {
    return new Vec4(this._div(rhs))
  }

  pow(power: number) {
    return new Vec4(this._pow(power))
  }

  get x() {
    return this.points[0]
  }

  set x(val) {
    this.points[0] = val
  }

  get y() {
    return this.points[1]
  }

  set y(val) {
    this.points[1] = val
  }

  get z() {
    return this.points[2]
  }

  set z(val) {
    this.points[2] = val
  }

  get w() {
    return this.points[3]
  }

  set w(val) {
    this.points[3] = val
  }

  get unit() {
    return new Vec4(this._unit)
  }
}