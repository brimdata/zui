import {ZedData} from "./index"

export class ZedMap {
  keyType: string
  valueType: string
  typeName?: string
  value: Map<ZedData, ZedData>

  constructor(args: {
    keyType: string
    valueType: string
    typeName?: string
    value: Map<ZedData, ZedData>
  }) {
    this.keyType = args.keyType
    this.valueType = args.valueType
    this.typeName = args.typeName
    this.value = args.value
  }

  isUnset() {
    return this.value === null
  }

  serialize() {
    return {
      kind: "map",
      keyType: this.keyType,
      valueType: this.valueType,
      typeName: this.typeName,
      value: Array.from(this.value.entries()).map(([key, value]) => [
        key.serialize(),
        value.serialize()
      ])
    }
  }
}
