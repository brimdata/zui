import {FromQueryPin} from "../types"

export default class FromPin {
  constructor(private pin: FromQueryPin) {}

  toZed() {
    return "from " + this.pin.value
  }
}
