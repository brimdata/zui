export default class History {
  constructor(entries = [], position = 0) {
    this.entries = entries
    this.position = position
  }

  clear() {
    this.entries = []
    this.position = 0
  }

  save(entry) {
    this.entries.push(entry)
    this.position = 0
  }

  getMostRecent() {
    if (!this.entries.length) return null
    return this.entries[this.entries.length - 1]
  }

  getCurrent() {
    if (!this.entries.length) return null
    const index = this.entries.length - 1 - this.position
    return this.entries[index]
  }

  getPrev() {
    if (this.position + 1 == this.entries.length) {
      return null
    } else {
      this.position += 1
      return this.getCurrent()
    }
  }

  getNext() {
    if (this.position === 0) {
      return null
    } else {
      this.position -= 1
      return this.getCurrent()
    }
  }

  toArray() {
    return this.entries
  }
}
