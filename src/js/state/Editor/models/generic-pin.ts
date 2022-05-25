import {GenericQueryPin} from "../types"

export default class GenericPin {
  constructor(private pin: GenericQueryPin) {}

  empty() {
    return this.pin.value.trim() === ""
  }

  toZed() {
    return this.pin.value
  }
}
