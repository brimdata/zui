import {SortableList} from "./sortable-list"

export class SortableItem {
  constructor(public index: number, public list: SortableList) {}

  get startPoint() {
    return this.list.startPoint + this.index * this.size + this.index * this.gap
  }

  get endPoint() {
    return this.startPoint + this.size
  }

  get centerPoint() {
    return this.startPoint + this.size / 2
  }

  get enterPoint() {
    return this.startPoint - this.paddingStart
  }

  get exitPoint() {
    return this.endPoint + this.paddingEnd
  }

  get paddingEnd() {
    return this.isLast ? 0 : this.halfGap
  }

  get paddingStart() {
    return this.isFirst ? 0 : this.halfGap
  }

  get isFirst() {
    return this.index == 0
  }

  get isLast() {
    return this.index === this.list.args.items.count - 1
  }

  get size() {
    return this.list.args.items.width
  }

  get gap() {
    return this.list.args.items.gap
  }

  get halfGap() {
    return this.gap / 2
  }

  get moveForward() {
    if (!this.list.isSorting) return false
    return this.index >= this.list.dst && this.index < this.list.args.src
  }

  get moveBack() {
    if (!this.list.isSorting) return false
    return this.index > this.list.args.src && this.index <= this.list.dst
  }

  get isSource() {
    return this.list.srcItem?.index === this.index
  }

  containsPoint(px: number) {
    if (this.isFirst) {
      return px <= this.exitPoint
    } else if (this.isLast) {
      return px > this.enterPoint
    } else {
      return px > this.enterPoint && px <= this.exitPoint
    }
  }
}
