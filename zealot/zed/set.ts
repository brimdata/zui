import {ZedData} from "./index"

export class ZedSet {
  type: string
  items: ZedData[]
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
      kind: "set",
      type: this.type,
      typeName: this.typeName,
      items: this.items.map((item) => item.serialize())
    }
  }
}
