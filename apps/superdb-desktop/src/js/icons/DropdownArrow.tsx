import React from "react"

export default function DropdownArrow(props: any) {
  // clean this up
  const {show: _show, isVisible: _isVis, ...rest} = props
  return (
    <svg width="9px" height="9px" viewBox="0 0 9 9" version="1.1" {...rest}>
      <g
        strokeWidth="1.5"
        fill="none"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="1 3 4.28395062 6.73745006 7.56790123 3" />
      </g>
    </svg>
  )
}
