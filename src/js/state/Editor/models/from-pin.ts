import {FromQueryPin} from "../types"

export default class FromPin {
  constructor(private pin: FromQueryPin) {}

  empty() {
    return this.pin.value.trim() === ""
  }

  toZed() {
    return `from '${this.pin.value}'`
  }
}
