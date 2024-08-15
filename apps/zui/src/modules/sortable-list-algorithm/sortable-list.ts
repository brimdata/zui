import {SortableItem} from "./sortable-item"
import {SortableListArgs} from "./types"
import {upTo} from "./utils"

export class SortableList {
  public items: SortableItem[]

  constructor(public args: SortableListArgs) {
    this.items = upTo(args.itemCount).map(
      (index) => new SortableItem(index, this)
    )
  }

  at(index: number) {
    return this.items[index]
  }

  get isSorting() {
    return this.args.src != null
  }

  get dst() {
    return this.items.findIndex((item) => item.containsPoint(this.pivot))
  }

  get pivot() {
    return this.args.offset + this.distanceToPivot
  }

  get distanceToPivot() {
    return this.srcItem.centerPoint - this.args.offsetAtStart
  }

  get srcItem() {
    return this.items[this.args.src]
  }
}
