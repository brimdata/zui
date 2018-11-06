/* @flow */

import * as searchBar from "../../actions/searchBar"
import * as packets from "../../actions/packets"
import type {Props} from "./LogCellActions"

type Action = {
  type: "action",
  text: string,
  onClick: Event => void
}

type Seperator = {
  type: "seperator"
}

export type MenuItemData = Seperator | Action

export default ({dispatch, field, space, log}: Props): MenuItemData[] => {
  let menu = [
    {
      type: "action",
      text: "Filter out these values",
      onClick: (e: Event) => {
        e.stopPropagation()
        dispatch(searchBar.appendQueryExclude(field))
        dispatch(searchBar.submitSearchBar())
      }
    },
    {
      type: "action",
      text: "Only show these values",
      onClick: (e: Event) => {
        e.stopPropagation()
        dispatch(searchBar.appendQueryInclude(field))
        dispatch(searchBar.submitSearchBar())
      }
    },
    {
      type: "action",
      text: `Count by ${field.name}`,
      onClick: (e: Event) => {
        e.stopPropagation()
        dispatch(searchBar.appendQueryCountBy(field))
        dispatch(searchBar.submitSearchBar())
      }
    }
  ]

  if (log.isPath("conn") && space.packet_support) {
    menu = menu.concat([
      {
        type: "seperator"
      },
      {
        type: "action",
        text: "Download PCAPS",
        onClick: (_e: Event) => {
          dispatch(packets.fetchPackets(log))
        }
      }
    ])
  }
  return menu
}
