import {ZedData} from "./index"

export class ZedArray {
  type: string
  items: ZedData[] | null
  typeName?: string

  constructor(args: {type: string; typeName?: string; items: ZedData[]}) {
    this.type = args.type
    this.typeName = args.typeName
    this.items = args.items
  }

  isUnset() {
    return this.items === null
  }

  serialize() {
    return {
      kind: "array",
      type: this.type,
      typeName: this.typeName,
      items: this.isUnset() ? null : this.items.map((item) => item.serialize())
    }
  }
}
