import classNames from "classnames"
import {MutableRefObject, useRef} from "react"
import {useSelector} from "react-redux"
import {StateObject, useStateObject} from "src/core/state-object"
import {ViewHandler} from "src/core/view-handler"
import tab from "src/js/models/tab"
import Appearance from "src/js/state/Appearance"
import Tabs from "src/js/state/Tabs"
import {getTabModels} from "src/js/state/Tabs/get-tab-models"
import {
  SortableList,
  SortableListArgs,
} from "src/modules/sortable-list-algorithm"
import {getGap, getRect} from "./utils"
import {move} from "src/modules/sortable-list-algorithm/utils"

type XY = {x: number; y: number}

export const initialState = {
  isDropping: false,
}

export class TabBarHandler extends ViewHandler {
  tabs: ReturnType<typeof tab>[]
  activeId: string
  sidebarOpen: boolean
  secondarySidebarOpen: boolean
  sortableState: StateObject<SortableListArgs>
  sortableList: SortableList
  listRef: MutableRefObject<HTMLElement>
  state: StateObject<typeof initialState>

  constructor() {
    super()
    this.activeId = useSelector(Tabs.getActive)
    this.sidebarOpen = useSelector(Appearance.sidebarIsOpen)
    this.secondarySidebarOpen = useSelector(Appearance.secondarySidebarIsOpen)
    this.tabs = useSelector(getTabModels)
    this.sortableState = useStateObject(SortableList.initialState())
    this.sortableList = new SortableList(this.sortableState)
    this.listRef = useRef<HTMLElement>()
    this.state = useStateObject(initialState)
  }

  isActive(id: string) {
    return this.activeId === id
  }

  activate(id: string) {
    this.dispatch(Tabs.activate(id))
  }

  create() {
    this.dispatch(Tabs.createQuerySession())
  }

  destroy(e: any, id: string) {
    e.stopPropagation()
    return this.dispatch(Tabs.remove(id))
  }

  get showMacPlaceholder() {
    return global.env.isMac && !this.sidebarOpen
  }

  get showSidebarToggle() {
    return !this.sidebarOpen
  }

  get showSecondarySidebarToggle() {
    return !this.secondarySidebarOpen
  }

  get tabBarClassNames() {
    return classNames("tab-bar", {
      "flush-left": !this.showSidebarToggle,
      "is-sorting": this.sortableList.isSorting,
    })
  }

  tabItemClassNames(index: number) {
    const item = this.sortableList.at(index)
    const isSource = item?.isSource
    const isSorting = this.sortableList.isSorting
    return classNames({
      "tab-item": true,
      "opacity-0": isSorting && isSource,
      "transform-shrink": isSource,
      "cursor-grabbing": isSource,
      "pointer-events-none": isSorting && !isSource,
      "no-transition": !isSorting,
      "move-back": item?.moveBack,
      "move-forward": item?.moveForward,
    })
  }

  onDragStart(offset: XY, index: number, element: HTMLElement) {
    const list = this.listRef.current
    this.sortableState.set({
      src: index,
      listRect: getRect(list),
      dragRect: getRect(element),
      items: {
        gap: getGap(list),
        height: getRect(element).height,
        width: getRect(element).width,
        count: this.tabs.length,
      },
      startingOffset: offset,
      offset,
    })
  }

  onDragMove(offset: XY) {
    this.sortableState.merge({offset})
  }

  onDragEnd() {
    this.state.setItem("isDropping", true)
    const indices = this.tabs.map((t, index) => index)
    const newOrder = move(
      indices,
      this.sortableState.src,
      this.sortableList.dst
    )
    setTimeout(() => {
      this.sortableState.reset()
      this.state.reset()
      requestAnimationFrame(() => {
        this.dispatch(Tabs.order(newOrder))
      })
    }, 300) /* this is the time it takes for the transition to settle */
  }

  get srcTab() {
    return this.tabs[this.sortableState.src]
  }

  get dragPreviewClassNames() {
    return classNames({
      "tab-item": true,
      preview: true,
      dropping: this.state.isDropping,
    })
  }

  get dragPreviewDimens() {
    if (this.state.isDropping) {
      return {
        ...this.sortableList.previewDimens,
        x: this.sortableList.dstItem.startPoint,
      }
    } else {
      return this.sortableList.previewDimens
    }
  }
}
