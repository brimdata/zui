import React, {HTMLProps} from "react"
import classNames from "classnames"
import Icon, {IconName} from "src/app/core/icon-temp"
import styled from "styled-components"

type Props = {
  title: string
  removeTab: Function
  active: boolean
  preview: boolean
  isNew: boolean
  icon: IconName
} & HTMLProps<HTMLAnchorElement>

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-right: 8px;
  border-radius: 6px;
  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
  &:active {
    background: rgba(0, 0, 0, 0.12);
  }
`

const SearchTab = React.forwardRef<HTMLAnchorElement, Props>(function SearchTab(
  {icon, title, active, removeTab, isNew, preview, ...rest},
  ref
) {
  return (
    <a
      {...rest}
      ref={ref}
      className={classNames("tab", {active, "is-new": isNew, preview})}
    >
      <div className="tab-content">
        <Icon className="icon" name={icon || "zui"} size={13} />
        <p className="title">{title}</p>
        <CloseButton onClick={removeTab as any}>
          <Icon name="close" />
        </CloseButton>
      </div>
    </a>
  )
})

export default SearchTab
