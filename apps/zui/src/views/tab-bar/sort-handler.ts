import {StateObject, useStateObject} from "src/core/state-object"
import {ViewHandler} from "src/core/view-handler"
import {SortableList} from "src/modules/sortable-list-algorithm"
import {getGap, getSize, getX} from "./utils"
import classNames from "classnames"
import {move, upTo} from "src/modules/sortable-list-algorithm/utils"
import Tabs from "src/js/state/Tabs"

const initialState = {
  canDrop: false,
  src: null as number,
  offset: 0,
  offsetAtStart: 0,
  offsetOfParent: 0,
  itemGap: 0,
  itemSize: 0,
  itemCount: 0,
}

export class SortHandler extends ViewHandler {
  state: StateObject<typeof initialState>
  list: SortableList

  constructor(public itemCount: number) {
    super()
    this.state = useStateObject(initialState)
    this.list = new SortableList(this.listArgs)
  }

  get listArgs() {
    return {
      src: this.state.src,
      offset: this.state.offset - this.state.offsetOfParent,
      offsetAtStart: this.state.offsetAtStart - this.state.offsetOfParent,
      itemGap: this.state.itemGap,
      itemSize: this.state.itemSize,
      itemCount: this.itemCount,
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

  onDragEnd() {
    this.state.reset()
  }

  onDrop() {
    const indices = upTo(this.itemCount)
    const newOrder = move(indices, this.state.src, this.list.dst)
    this.state.reset()
    this.dispatch(Tabs.order(newOrder))
  }

  onDropEnter() {
    console.log("onDropEnter")
    this.state.setItem("canDrop", true)
  }

  onDropExit() {
    console.log("onDropExit")
    this.state.setItem("canDrop", false)
  }

  classNames(index: number) {
    const item = this.list.at(index)
    const isSource = item?.isSource
    const isSorting = this.list.isSorting
    return classNames({
      "transform-shrink": isSource,
      "cursor-grabbing": isSource,
      "pointer-events-none": isSorting && !isSource,
      "no-transition": !isSorting,
      "move-back": this.state.canDrop && item?.moveBack,
      "move-forward": this.state.canDrop && item?.moveForward,
    })
  }
}
