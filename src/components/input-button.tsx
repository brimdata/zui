import classNames from "classnames"
import React, {ReactNode} from "react"
import Icon, {IconName} from "src/app/core/icon-temp"
import styled from "styled-components"

const Button = styled.button`
  display: inline-block;
  background: white;
  border: 1px solid #c0c0c0;
  // box-shadow: 0 1px 2px rgb(0 0 0 / 0.14);
  border-radius: 6px;
  padding-left: 16px;
  padding-right: 16px;
  height: 28px;
  white-space: nowrap;
  user-select: none;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  gap: 6px;

  &.has-icon.has-children {
    padding-right: 14px;
  }

  &::placeholder {
    font-style: italic;
  }

  &:active {
    background: hsl(0 0% 97%);
  }
`

export function InputButton(
  props: {
    icon?: IconName
    iconSize?: number
    children?: ReactNode
    className?: string
  } & JSX.IntrinsicElements["button"]
) {
  const {icon, children, className, iconSize, ...buttonProps} = props

  return (
    <Button
      className={classNames(className, {
        "has-icon": !!icon,
        "has-children": !!children,
      })}
      {...(buttonProps as any)}
    >
      {icon && <Icon name={icon} size={iconSize ?? 16} />}
      {children}
    </Button>
  )
}
