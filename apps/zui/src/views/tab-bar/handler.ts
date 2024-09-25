import classNames from "classnames"
import {MutableRefObject, useRef} from "react"
import {useSelector} from "react-redux"
import {StateObject, useStateObject} from "src/core/state-object"
import {ViewHandler} from "src/core/view-handler"
import Appearance from "src/js/state/Appearance"
import Tabs from "src/js/state/Tabs"
import {
  SortableList,
  SortableListArgs,
} from "src/modules/sortable-list-algorithm"
import {getGap, getRect} from "./utils"
import {move} from "src/modules/sortable-list-algorithm/utils"
import {BrowserTab} from "src/models/browser-tab"
import {getTabDisplayProps} from "src/js/state/Tabs/get-display-props"
import {QuerySession} from "src/models/query-session"

type XY = {x: number; y: number}
export const initialState = {
  isDropping: false,
}

export class TabBarHandler extends ViewHandler {
  tabs: {id: string; title: string}[]
  activeId: string
  previewId: string
  sidebarOpen: boolean
  secondarySidebarOpen: boolean
  sortableState: StateObject<SortableListArgs>
  sortableList: SortableList
  listRef: MutableRefObject<HTMLElement>
  state: StateObject<typeof initialState>

  constructor() {
    super()
    this.activeId = useSelector(Tabs.getActive)
    this.previewId = useSelector(Tabs.getPreview)
    this.sidebarOpen = useSelector(Appearance.sidebarIsOpen)
    this.secondarySidebarOpen = useSelector(Appearance.secondarySidebarIsOpen)
    this.tabs = useSelector(getTabDisplayProps)
    this.sortableState = useStateObject(SortableList.initialState())
    this.sortableList = new SortableList(this.sortableState)
    this.listRef = useRef<HTMLElement>()
    this.state = useStateObject(initialState)
  }

  isActive(id: string) {
    return this.activeId === id
  }

  isPreview(id: string) {
    return this.previewId === id
  }

  activate(id: string) {
    this.dispatch(Tabs.activate(id))
  }

  create() {
    const session = QuerySession.createWithTab()
    session.activate()
    session.navigate({value: "", pins: []})
  }

  destroy(e: any, id: string) {
    e.stopPropagation()
    BrowserTab.find(id)?.destroy()
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
      "no-transition": !isSorting || this.state.isDropping,
      "move-back": item?.moveBack,
      "move-forward": item?.moveForward,
      "tab-item-preview": this.isPreview(this.tabs[index]?.id),
    })
  }

  onDragStart(offset: XY, index: number, element: HTMLElement) {
    this.dispatch(Appearance.setIsSortingTabs(true))
    this.state.setItem("isDropping", false)
    clearTimeout(this.dropTimeout)

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
    if (offset.x === 0 && offset.y === 0) return
    this.sortableState.merge({offset})
  }

  dropTimeout: any
  onDragEnd() {
    this.dispatch(Appearance.setIsSortingTabs(false))
    this.state.setItem("isDropping", true)
    const indices = this.tabs.map((t, index) => index)
    const newOrder = move(
      indices,
      this.sortableState.src,
      this.sortableList.dst
    )
    this.dropTimeout = setTimeout(() => {
      this.state.reset()
      this.sortableState.reset()
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
        x: (this.sortableList.dstItem || this.sortableList.srcItem)?.startPoint,
      }
    } else {
      return this.sortableList.previewDimens
    }
  }
}
