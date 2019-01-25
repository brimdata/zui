/* @flow */
import defaultArg from "../lib/defaultArg"
import isEqual from "lodash/isEqual"

export default class NavHistory<T> {
  entries: T[]
  position: number

  constructor(args: $Shape<NavHistory<T>>) {
    this.entries = defaultArg([...args.entries], [])
    this.position = defaultArg(args.position, -1)

    if (this.position < -1 || this.position >= this.entries.length) {
      throw new Error("Position out of bounds")
    }
  }

  push(entry: T) {
    if (!isEqual(entry, this.getCurrentEntry())) {
      this.entries.splice(this.position + 1, this.entries.length, entry)
      this.position = this.entries.length - 1
    }
  }

  goBack() {
    if (this.canGoBack()) {
      this.position -= 1
    }
  }

  goForward() {
    if (this.canGoForward()) {
      this.position += 1
    }
  }

  getEntries() {
    return this.entries
  }

  getCurrentEntry(): T {
    return this.entries[this.position]
  }

  canGoBack() {
    if (this.entries.length > 1) {
      return this.position !== 0
    } else {
      return false
    }
  }

  canGoForward() {
    if (this.entries.length > 1) {
      return this.position < this.entries.length - 1
    } else {
      return false
    }
  }

  toJSON() {
    return {
      entries: this.entries,
      position: this.position
    }
  }
}
