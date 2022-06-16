import React, {HTMLProps} from "react"
import classNames from "classnames"
import CloseButton from "../CloseButton"

type Props = {
  title: string
  removeTab: Function
  active: boolean
  preview: boolean
  isNew: boolean
} & HTMLProps<HTMLDivElement>

const SearchTab = React.forwardRef<HTMLDivElement, Props>(function SearchTab(
  {title, active, removeTab, isNew, preview, ...rest},
  ref
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={classNames("tab", {active, "is-new": isNew, preview})}
    >
      <div className="tab-content">
        <p className="title">{title}</p>
        <CloseButton onClick={removeTab} />
      </div>
    </div>
  )
})

export default SearchTab
