import classNames from "classnames"
import {useSelector} from "react-redux"
import {StateObject, useStateObject} from "src/core/state-object"
import {ViewHandler} from "src/core/view-handler"
import tab from "src/js/models/tab"
import Appearance from "src/js/state/Appearance"
import Tabs from "src/js/state/Tabs"
import {
  SortableList,
  SortableListArgs,
} from "src/modules/sortable-list-algorithm"

type XY = {x: number; y: number}

export class TabBarHandler extends ViewHandler {
  tabs: ReturnType<typeof tab>[]
  activeId: string
  sidebarOpen: boolean
  secondarySidebarOpen: boolean
  sortableState: StateObject<SortableListArgs>
  sortableList: SortableList

  constructor() {
    super()
    this.activeId = useSelector(Tabs.getActive)
    this.sidebarOpen = useSelector(Appearance.sidebarIsOpen)
    this.secondarySidebarOpen = useSelector(Appearance.secondarySidebarIsOpen)
    this.tabs = useSelector(Tabs.getTabModels)
    this.sortableState = useStateObject(SortableList.initialState())
    this.sortableList = new SortableList(this.sortableState)
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

  onDragStart(offset: XY, index: number, element: HTMLElement) {}

  onDragMove(offset: XY) {}

  onDragEnd() {}
}
