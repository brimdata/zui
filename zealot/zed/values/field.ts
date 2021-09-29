import {ZedValue} from "./types"

export class Field {
  constructor(
    public name: string,
    public value: ZedValue,
    public parents: string[] = []
  ) {}

  /**
   * Alias for value
   */
  get data() {
    return this.value
  }

  get path() {
    return [...this.parents, this.name]
  }
}
