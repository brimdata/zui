export interface SectionData {
  id: string
  size?: number
  min?: number
  max?: number
  isOpen?: boolean
  closedSize?: number
}

export default class Section {
  static parse({id, size, min, max, isOpen, closedSize}: SectionData) {
    return new Section(id, size, min, max, isOpen, closedSize)
  }

  constructor(
    public id: string,
    public size: number = 0,
    public min: number = 0,
    public max: number = Infinity,
    public isOpen: boolean = true,
    public closedSize: number = min
  ) {
    this.size = this.clamp(size)
  }

  toggle() {
    if (this.isOpen) {
      this.isOpen = false
      return this.size - this.closedSize
    } else {
      this.isOpen = true
      return this.closedSize - this.size
    }
  }

  resize(delta: number) {
    if (!this.isOpen) return delta
    const newSize = this.clamp(this.size + delta)
    const remains = this.size + delta - newSize
    this.size = newSize
    return remains
  }

  getStyle() {
    return {
      height: this.getSize()
    }
  }

  getSize() {
    return this.isOpen ? this.size : this.closedSize
  }

  getShrinkSpace() {
    if (this.isOpen) return this.size - this.min
    else return 0
  }

  getGrowSpace() {
    if (this.isOpen) return this.max - this.size
    else return 0
  }

  serialize() {
    return {
      id: this.id,
      size: this.size,
      min: this.min,
      max: this.max,
      isOpen: this.isOpen,
      closedSize: this.closedSize
    }
  }

  private clamp(n: number) {
    return Math.min(this.max, Math.max(this.min, n))
  }
}
