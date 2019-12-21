/* @flow */
import React from "react"
import classNames from "classnames"

import CloseButton from "./CloseButton"
import RampLeft from "../icons/ramp-left.svg"
import RampRight from "../icons/ramp-right.svg"

type Props = {
  title: string,
  className: string,
  removeTab: Function
}

const SearchTab = React.forwardRef<Props, HTMLDivElement>(function SearchTab(
  {title, className, removeTab, ...rest},
  ref
) {
  return (
    <div ref={ref} {...rest} className={classNames("tab", className)}>
      <p className="title">{title}</p>
      <CloseButton onClick={removeTab} />
      <RampRight />
      <RampLeft />
    </div>
  )
})

export default SearchTab
