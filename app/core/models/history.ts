import {isEqual} from "lodash"

export default class History<Entry> {
  static parse<T>({entries, position}) {
    return new History<T>(entries, position)
  }

  constructor(private array: Entry[] = [], private index: number = 0) {}

  push(entry: Entry) {
    if (!isEqual(entry, this.current())) {
      this.array.splice(this.index + 1, this.array.length, entry)
      this.index = this.array.length - 1
    }
  }

  update(updates: Partial<Entry>) {
    const current = this.current()
    if (typeof current == "object") {
      this.array[this.index] = {...current, ...updates}
    }
  }

  replace(entry: Entry) {
    this.array[this.index] = entry
  }

  entries(): Entry[] {
    return this.array
  }

  current(): Entry | undefined {
    return this.array[this.index]
  }

  canGoBack() {
    return this.index > 0
  }

  back() {
    if (this.canGoBack()) {
      this.index -= 1
    }
  }

  canGoForward() {
    return this.index < this.array.length - 1
  }

  forward() {
    if (this.canGoForward()) {
      this.index += 1
    }
  }

  serialize() {
    return {
      entries: [...this.array],
      position: this.index
    }
  }
}
