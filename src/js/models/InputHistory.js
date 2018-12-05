export default class InputHistory {
  constructor() {
    this.entries = []
    this.position = 0
  }

  push(newVal) {
    if (newVal !== this.entries[this.entries.length - 1]) {
      this.position = this.entries.length
      this.entries.push(newVal)
    }
  }

  getEntries() {
    return this.entries
  }

  getCurrentEntry() {
    return this.entries[this.position]
  }

  goBack() {
    if (this.position != 0) {
      this.position -= 1
    }
  }

  goForward() {
    if (this.position < this.entries.length - 1) {
      this.position += 1
    }
  }
}
