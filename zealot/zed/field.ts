import {ZedData} from "./index"

export class ZedField {
  name: string
  data: ZedData

  constructor({name, data}: {name: string; data: ZedData}) {
    this.name = name
    this.data = data
  }

  serialize() {
    return {
      kind: "field",
      name: this.name,
      data: this.data.serialize()
    }
  }
}
