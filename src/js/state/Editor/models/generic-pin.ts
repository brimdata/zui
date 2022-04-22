import {GenericQueryPin} from "../types"

export default class GenericPin {
  constructor(private pin: GenericQueryPin) {}

  toZed() {
    return this.pin.value
  }
}
