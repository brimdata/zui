import {ZedData} from "./index"

export class ZedUnion {
  types: string[]
  value: ZedData
  typeName?: string

  constructor(args: {types: string[]; value: ZedData; typeName?: string}) {
    this.types = args.types
    this.value = args.value
    this.typeName = args.typeName
  }

  serialize() {
    return {
      kind: "union",
      types: this.types,
      typeName: this.typeName,
      value: this.value.serialize()
    }
  }
}
