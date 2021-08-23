export default class CmdHistory {
  constructor(
    private array: string[] = [],
    private index: number = 0,
    private limit: number
  ) {}

  push(cmd: string) {
    if (this.array.length === this.limit) this.array.shift()
    this.array.push(cmd)
    this.index = this.array.length - 1
  }

  back() {
    if (this.index > 0) this.index -= 1
    return this.current()
  }

  forward() {
    if (this.index < this.array.length - 1) this.index += 1
    return this.current()
  }

  all() {
    return this.array
  }

  empty() {
    return this.array.length === 0
  }

  private current() {
    if (this.empty()) return null
    return this.array[this.index]
  }
}
