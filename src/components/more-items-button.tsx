import React from "react"
import {BuiltMenu, MenuItem} from "src/core/menu"
import {IconButton} from "./icon-button"

export function MoreItemsButton(props: {items: MenuItem[]}) {
  return (
    <IconButton
      iconName="double-chevron-right"
      iconSize={10}
      onClick={(htmlEvent) => {
        new BuiltMenu({id: "more-items"}, props.items).showUnder(
          htmlEvent.currentTarget
        )
      }}
    />
  )
}
