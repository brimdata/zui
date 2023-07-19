export class PoolName {
  constructor(public name: string, public delimiter: string) {}

  get parts() {
    if (this.delimiter === "") return [this.name]
    return this.name.split(this.delimiter)
  }

  get group() {
    const parts = this.parts.map((p) => p.trim())
    return parts.slice(0, parts.length - 1)
  }

  get basename() {
    const parts = this.parts.map((p) => p.trim())
    return parts[parts.length - 1]
  }

  isIn(group: string[]) {
    return group.every((dir, index) => dir.trim() === this.group[index])
  }
}
