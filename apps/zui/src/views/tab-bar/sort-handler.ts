import {MutableRefObject} from "react"
import {StateObject, useStateObject} from "src/core/state-object"
import {ViewHandler} from "src/core/view-handler"
import {
  SortableList,
  SortableListArgs,
} from "src/modules/sortable-list-algorithm"
import {getGap, getSize} from "./utils"
import classNames from "classnames"

export class SortHandler extends ViewHandler {
  ref: MutableRefObject<any>
  props: object
  state: StateObject<SortableListArgs>
  list: SortableList

  constructor(public itemCount: number) {
    super()
    this.state = useStateObject<SortableListArgs>({
      src: null,
      offset: 0,
      offsetAtStart: 0,
      itemGap: 0,
      itemSize: 0,
      itemCount,
    })
    this.list = new SortableList(this.state)
  }

  onDragStart(element: HTMLElement, index: number) {
    this.state.merge({
      src: index,
      itemSize: getSize(element),
      itemGap: getGap(element.parentElement),
    })
  }

  onDropEnter(e) {
    this.state.merge({offsetAtStart: e.x})
  }

  onDropMove(e) {
    this.state.merge({offset: e.x})
  }

  onDrop(e) {
    this.state.merge({src: null})
  }

  classNames(index: number) {
    return classNames({
      "move-back": this.list.items[index].moveBack,
      "move-forward": this.list.items[index].moveForward,
    })
  }
}
