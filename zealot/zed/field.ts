import {ZedData} from "./index"
import {deserialize} from "./json"

export class ZedField {
  name: string
  data: ZedData

  static deserialize(data): ZedField {
    return deserialize(data)
  }

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
