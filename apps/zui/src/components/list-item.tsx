import classNames from "classnames"
import React from "react"
import {ReactNode} from "react-markdown"
import Icon, {IconName} from "src/app/core/icon-temp"
import {BuiltMenu} from "src/core/menu"
import {IconButton} from "./icon-button"

export function ListItem(props: {
  className?: string
  indent?: number
  children?: ReactNode
  canToggle?: boolean
  onToggle?: () => void
  onClick?: () => void
  iconName?: IconName
  iconSize?: number
  innerRef?: React.Ref<any>
  isOpen?: boolean
  isSelected?: boolean
  isDragging?: boolean
  isOverFolder?: boolean
  menu?: BuiltMenu
}) {
  const indentation = 16
  let left = (props.indent ?? 0) * indentation
  if (!props.canToggle) left += 16
  return (
    <div
      ref={props.innerRef}
      className={classNames("list-item", props.className, {
        "list-item--open": props.isOpen,
        "list-item--can-toggle": props.canToggle,
        "list-item--has-click": !!props.onClick,
        "list-item--selected": props.isSelected,
        "list-item--dragging": props.isDragging,
        "list-item--over-folder": props.isOverFolder,
      })}
    >
      <div className="list-item__background" style={{paddingLeft: left}}>
        {props.canToggle && (
          <IconButton
            className={classNames("list-item__toggle", {
              "list-item__toggle--open": props.isOpen,
            })}
            click={() => props.onToggle()}
            iconName="chevron-right"
            iconSize={14}
          />
        )}
        {props.iconName && (
          <Icon
            className="list-item__icon"
            name={props.iconName}
            size={props.iconSize ?? 14}
          />
        )}
        <div className="list-item__content">{props.children}</div>
        <menu className="list-item__menu">
          {props.menu.items.map((item, i) => {
            if (!item.visible) return null
            return (
              <IconButton key={i} className="list-item__menu-item" {...item} />
            )
          })}
        </menu>
      </div>
    </div>
  )
}
