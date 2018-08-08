export default class UniqArray {
  constructor(array = []) {
    this.array = array
  }

  push(item) {
    if (this.array.indexOf(item) === -1) this.array.push(item)
  }

  toArray() {
    return this.array
  }
}
