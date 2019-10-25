/* @flow */
import React from "react"
import classNames from "classnames"

type Props = {
  children: *,
  className?: string
}

// $FlowFixMe
const MenuBarButton = React.forwardRef(function MenuBarButton(
  {className, children, ...props}: Props,
  ref
) {
  return (
    <button
      ref={ref}
      className={classNames(className, "menu-bar-button")}
      {...props}
    >
      {children}
    </button>
  )
})

export default MenuBarButton
