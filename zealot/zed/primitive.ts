export class ZedPrimitive {
  public typeName?: string // the logical type name
  public type: string // the actual type
  public value: string | null

  constructor(args: {type: string; value: string | null; typeName?: string}) {
    this.type = args.type
    this.value = args.value
    this.typeName = args.typeName
  }

  isUnset() {
    return this.value === null
  }

  toDate() {
    if (this.type !== "time") {
      throw new Error(`Cannot make type: ${this.type} into a Date`)
    }
    return new Date(+this.value * 1000)
  }

  toFloat() {
    if (this.isUnset()) return 0

    try {
      return parseFloat(this.value)
    } catch {
      throw new Error(`Cannot make type: ${this.type} into a Float`)
    }
  }

  toInt() {
    if (this.isUnset()) throw new Error("value is unset")
    const int = parseInt(this.value)
    if (isNaN(int)) {
      throw new Error(`Cannot make type: ${this.type} into an Integer`)
    }
    return int
  }

  toString(): string {
    return this.value || ""
  }

  serialize() {
    return {
      kind: "primitive",
      type: this.type,
      value: this.value,
      typeName: this.typeName
    }
  }
}
