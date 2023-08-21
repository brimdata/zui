import * as zed from "@brimdata/zed-js"
import {MakeControllers} from "src/zui-kit/types/utils"
import {ValueMouseEventHandler, ViewConfig} from "../value-view/types"
import {ListViewApi} from "./list-view-api"

export type ListViewState = {
  valueExpanded: Record<string, boolean>
  valueExpandedDefault: boolean
  valuePage: Record<string, number>
}

export type ListViewControllers = MakeControllers<ListViewState>

export type ListViewArgs = {
  values: zed.Value[]
  shapes?: zed.Type[]
  viewConfig?: ViewConfig
  valueProps?: {
    onClick?: ValueMouseEventHandler
    onContextMenu?: ValueMouseEventHandler
  }
  onScroll?: (props: {top: number; left: number}, list: ListViewApi) => void
} & ListViewControllers
