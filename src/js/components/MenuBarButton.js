/* @flow */
import React from "react"
import classNames from "classnames"

import DropdownArrow from "../icons/DropdownArrow"

type Props = {
  children: *,
  dropdown?: boolean,
  className?: string
}

// $FlowFixMe
const MenuBarButton = React.forwardRef(function MenuBarButton(
  {className, children, dropdown, ...props}: Props,
  ref
) {
  return (
    <button
      ref={ref}
      className={classNames(className, "toolbar-button")}
      {...props}
    >
      <span className="text">{children}</span>
      {dropdown && <DropdownArrow />}
    </button>
  )
})

export default MenuBarButton
