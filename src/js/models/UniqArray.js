type CompareFn = (*, *) => boolean

export default class UniqArray {
  compareFn: CompareFn
  array: *[]

  constructor(compareFn: CompareFn = (a, b) => a === b) {
    this.compareFn = compareFn
    this.array = []
  }

  push(item: *) {
    if (!this.exists(item)) this.array.push(item)
  }

  exists(item: *) {
    return !!this.array.find(i => this.compareFn(i, item))
  }

  toArray() {
    return this.array
  }
}
