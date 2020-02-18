/* @flow */
import React from "react"
import classNames from "classnames"

import CloseButton from "../CloseButton"
import RampLeft from "../../icons/ramp-left.svg"
import RampRight from "../../icons/ramp-right.svg"

type Props = {
  title: string,
  removeTab: Function,
  active: boolean,
  isNew: boolean
}

const SearchTab = React.forwardRef<Props, HTMLDivElement>(function SearchTab(
  {title, active, removeTab, isNew, ...rest},
  ref
) {
  return (
    <div
      ref={ref}
      {...rest}
      className={classNames("tab", {active, "is-new": isNew})}
    >
      <div className="tab-content">
        <p className="title">{title}</p>
        <CloseButton onClick={removeTab} />
      </div>
      <RampRight />
      <RampLeft />
    </div>
  )
})

export default SearchTab
