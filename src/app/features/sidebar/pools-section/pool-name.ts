export class PoolName {
  constructor(public name: string, public delimeter: string) {}

  get parts() {
    return this.name.split(this.delimeter)
  }

  get group() {
    const parts = this.parts
    return parts.slice(0, parts.length - 1).map((s) => s.trim())
  }

  get basename() {
    const parts = this.parts
    return parts[parts.length - 1].trim()
  }

  isIn(group: string[]) {
    return group.every((dir, index) => dir.trim() === this.group[index].trim())
  }
}
