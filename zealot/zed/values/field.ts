import {ZedValue} from "./types"

export class Field {
  constructor(public name: string, public value: ZedValue) {}

  /**
   * Alias for value
   */
  get data() {
    return this.value
  }
}
