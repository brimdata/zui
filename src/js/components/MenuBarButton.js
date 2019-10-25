/* @flow */
import React from "react"
import classNames from "classnames"

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
      className={classNames(className, "menu-bar-button")}
      {...props}
    >
      {children}
      {dropdown && <Arrow />}
    </button>
  )
})

export default MenuBarButton

function Arrow() {
  return (
    <svg
      className="dropdown-arrow"
      width="9px"
      height="9px"
      viewBox="0 0 9 9"
      version="1.1"
    >
      <g
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline
          stroke="#31353D"
          points="1 3 4.28395062 6.73745006 7.56790123 3"
        />
      </g>
    </svg>
  )
}
