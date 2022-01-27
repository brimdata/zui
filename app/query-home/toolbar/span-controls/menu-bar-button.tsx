import * as React from "react"
import classNames from "classnames"

import ClockIcon from "src/js/icons/ClockIcon"
import DropdownArrow from "src/js/icons/DropdownArrow"

type Props = {
  children: React.ReactNode
  dropdown?: boolean
  className?: string
  icon?: React.ReactNode
} & React.HTMLProps<HTMLButtonElement>

const MenuBarButton = React.forwardRef<HTMLButtonElement, Props>(
  function MenuBarButton(
    {className, children, dropdown, icon, ...props}: Props,
    ref
  ) {
    return (
      <button
        {...props}
        type="button"
        ref={ref}
        className={classNames(className, "toolbar-button")}
      >
        {!!icon && (
          <span className="icon">
            <ClockIcon />
          </span>
        )}

        <span className="text">{children}</span>
        {dropdown && <DropdownArrow />}
      </button>
    )
  }
)

export default MenuBarButton
