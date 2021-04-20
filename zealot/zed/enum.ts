export class ZedEnum {
  typeName?: string
  symbols: string[]
  value: string

  constructor(args: {typeName?: string; symbols: string[]; value: string}) {
    this.symbols = args.symbols
    this.value = args.value
    this.typeName = args.typeName
  }

  isUnset() {
    return this.value === null
  }

  serialize() {
    return {
      kind: "enum",
      symbols: this.symbols,
      value: this.value,
      typeName: this.typeName
    }
  }
}
