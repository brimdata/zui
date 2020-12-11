import Section, {SectionData} from "./Section"

export type ControllerData = {
  size: number
  sections: SectionData[]
}

export default class Controller {
  static parse({size, sections}: ControllerData) {
    return new Controller(size, sections.map(Section.parse))
  }

  constructor(readonly size: number, readonly sections: Section[]) {
    const actual = this.sum((s) => s.getSize())
    this.distribute(size - actual)
  }

  toggle(index: number) {
    let delta = this.at(index).toggle()
    for (let i = this.sections.length - 1; i >= 0; i--) {
      if (i === index) continue
      delta = this.at(i).resize(delta)
    }
  }

  drag(index: number, delta: number) {
    const d = this.clamp(index, delta)
    this.resizeAbove(index - 1, d)
    this.resizeBelow(index, -d)
  }

  at(index: number) {
    return this.sections[index]
  }

  map(fn: (c: Section, i: number) => any) {
    return this.sections.map(fn)
  }

  getCursor(index: number) {
    const canGrow = !(this.getMaxGrow(index) === 0)
    const canShrink = !(this.getMaxShrink(index) === 0)
    if (canGrow && canShrink) return "row-resize"
    if (canGrow) return "n-resize"
    if (canShrink) return "s-resize"
    return ""
  }

  serialize() {
    return {
      size: this.size,
      sections: this.map((c) => c.serialize())
    }
  }

  private distribute(extra: number) {
    let left = Math.round(extra)
    let prev
    const unitOfChange = left > 0 ? 1 : -1
    while (prev !== left /* unable to distribute any more */) {
      prev = left
      for (let child of this.sections) {
        if (left === 0) break
        if (child.resize(unitOfChange) === 0) left += -unitOfChange
      }
    }
  }

  private resizeAbove(index: number, delta: number) {
    for (let i = index; i >= 0; i--) {
      delta = this.at(i).resize(delta)
    }
  }

  private resizeBelow(index: number, delta: number) {
    for (let i = index; i < this.sections.length; ++i) {
      delta = this.at(i).resize(delta)
    }
  }

  private getMaxShrink(index: number) {
    return Math.min(
      sum(this.below(index), (c: Section) => c.getGrowSpace()),
      sum(this.above(index - 1), (c: Section) => c.getShrinkSpace())
    )
  }

  private getMaxGrow(index: number) {
    return Math.min(
      sum(this.below(index), (c: Section) => c.getShrinkSpace()),
      sum(this.above(index - 1), (c: Section) => c.getGrowSpace())
    )
  }

  private clamp(index: number, delta: number) {
    if (delta > 0) {
      return Math.min(delta, this.getMaxShrink(index))
    } else if (delta < 0) {
      return Math.max(delta, -this.getMaxGrow(index))
    } else {
      return 0
    }
  }

  private below(index: number) {
    return this.sections.filter((_, i) => i < index)
  }

  private above(index: number) {
    return this.sections.filter((_, i) => i > index)
  }

  private sum(fn: (child: Section) => number) {
    return sum(this.sections, fn)
  }
}

const sum = (array: any[], fn: (child: Section) => number) =>
  array.reduce((sum, child) => sum + fn(child), 0)
