import {StateObject, useStateObject} from "src/core/state-object"
import {ViewHandler} from "src/core/view-handler"
import {SortableList} from "src/modules/sortable-list-algorithm"
import {getGap, getSize, getX} from "./utils"
import classNames from "classnames"

export class SortHandler extends ViewHandler {
  props: object
  state: StateObject<any>
  list: SortableList

  constructor(public itemCount: number) {
    super()
    this.state = useStateObject({
      src: null,
      offset: 0,
      offsetAtStart: 0,
      offsetOfParent: 0,
      itemGap: 0,
      itemSize: 0,
      itemCount,
    })
    this.list = new SortableList(this.listArgs)
  }

  get listArgs() {
    return {
      src: this.state.src,
      offset: this.state.offset - this.state.offsetOfParent,
      offsetAtStart: this.state.offsetAtStart - this.state.offsetOfParent,
      itemGap: this.state.itemGap,
      itemSize: this.state.itemSize,
      itemCount: this.state.itemCount,
    }
  }

  onDragStart(
    parent: HTMLElement,
    item: HTMLElement,
    offset: number,
    index: number
  ) {
    this.state.merge({
      src: index,
      itemSize: getSize(item),
      itemGap: getGap(parent),
      offsetAtStart: offset,
      offsetOfParent: getX(parent),
    })
  }

  onDragMove(offset) {
    this.state.merge({offset})
  }

  onDrop(e) {
    this.state.reset()
  }

  classNames(index: number) {
    return classNames({
      "move-back": this.list.items[index].moveBack,
      "move-forward": this.list.items[index].moveForward,
    })
  }
}
