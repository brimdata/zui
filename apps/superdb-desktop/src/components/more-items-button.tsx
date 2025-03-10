import React, {forwardRef} from "react"
import {MenuItem, showMenu} from "src/core/menu"
import {IconButton} from "./icon-button"

export const MoreItemsButton = forwardRef<any, {items: MenuItem[]}>(
  function MoreItemsButton(props, ref) {
    return (
      <IconButton
        ref={ref}
        iconName="double_chevron_right"
        iconSize={10}
        onClick={(e) => showMenu(props.items, e.currentTarget)}
      />
    )
  }
)
