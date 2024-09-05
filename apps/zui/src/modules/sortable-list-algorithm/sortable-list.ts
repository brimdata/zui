import {SortableItem} from "./sortable-item"
import {SortableListArgs} from "./types"
import {clamp, upTo} from "./utils"

export class SortableList {
  public items: SortableItem[]

  constructor(public args: SortableListArgs) {
    this.items = upTo(args.items.count).map(
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
    return this.args.offset.x + this.distanceToPivot
  }

  get distanceToPivot() {
    return this.srcItem.centerPoint - this.args.startingOffset.x
  }

  get srcItem() {
    return this.at(this.args.src)
  }

  get dstItem() {
    return this.at(this.dst)
  }

  get startPoint() {
    return this.args.listRect.x
  }

  get endPoint() {
    return this.startPoint + this.args.listRect.width
  }

  get previewDimens() {
    const x =
      this.srcItem.startPoint - this.args.startingOffset.x + this.args.offset.x
    return {
      x: clamp(this.startPoint, x, this.endPoint - this.args.items.width),
      y: this.args.dragRect.y,
      width: this.args.items.width,
      height: this.args.items.height,
    }
  }

  static initialState() {
    return {
      src: null,
      items: {
        height: 0,
        width: 0,
        count: 0,
        gap: 0,
      },
      dragRect: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      listRect: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      startingOffset: {
        x: 0,
        y: 0,
      },
      offset: {
        x: 0,
        y: 0,
      },
    }
  }
}
