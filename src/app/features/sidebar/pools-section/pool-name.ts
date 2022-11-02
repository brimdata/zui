export class PoolName {
  constructor(public name: string, public delimeter: string) {}

  get parts() {
    return this.name.split(this.delimeter).map((t) => t.trim())
  }

  get group() {
    const parts = this.parts
    return parts.slice(0, parts.length - 1)
  }

  get basename() {
    const parts = this.parts
    return parts[parts.length - 1]
  }

  isIn(group: string[]) {
    return group.every((dir, index) => dir === this.group[index])
  }
}
