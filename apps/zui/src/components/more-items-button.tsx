import React, {forwardRef} from "react"
import {BuiltMenu, MenuItem} from "src/core/menu"
import {IconButton} from "./icon-button"

export const MoreItemsButton = forwardRef<any, {items: MenuItem[]}>(
  function MoreItemsButton(props, ref) {
    return (
      <IconButton
        ref={ref}
        iconName="double-chevron-right"
        iconSize={10}
        onClick={(e) => {
          new BuiltMenu({id: "more-items"}, props.items).showUnder(
            e.currentTarget
          )
        }}
      />
    )
  }
)
