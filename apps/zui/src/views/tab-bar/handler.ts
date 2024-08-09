import {useSelector} from "react-redux"
import useLakeId from "src/app/router/hooks/use-lake-id"
import {ViewHandler} from "src/core/view-handler"
import {useQueryIdNameMap} from "src/js/components/TabBar/use-query-id-name-map"
import tab from "src/js/models/tab"
import Appearance from "src/js/state/Appearance"
import Lakes from "src/js/state/Lakes"
import Pools from "src/js/state/Pools"
import Tabs from "src/js/state/Tabs"

export class TabBarHandler extends ViewHandler {
  tabs: ReturnType<typeof tab>[]
  activeId: string
  sidebarOpen: boolean
  secondarySidebarOpen: boolean

  constructor() {
    super()
    this.activeId = useSelector(Tabs.getActive)
    this.sidebarOpen = useSelector(Appearance.sidebarIsOpen)
    this.secondarySidebarOpen = useSelector(Appearance.secondarySidebarIsOpen)
    const ids = useSelector(Tabs.getIds)
    const pools = useSelector(Pools.raw)
    const lakes = useSelector(Lakes.raw)
    const lakeId = useLakeId()
    const queryIdNameMap = useQueryIdNameMap()
    this.tabs = ids.map((id) => tab(id, lakes, pools, queryIdNameMap, lakeId))
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
}
