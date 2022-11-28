import classNames from "classnames"
import React from "react"
import Icon, {IconName} from "src/app/core/icon-temp"
import styled, {StyledComponent} from "styled-components"

const Button = styled.button`
  display: inline-block;
  background: white;
  border: 1px solid #c0c0c0;
  box-shadow: 0 1px 4px rgb(0 0 0 / 0.14);
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

  &.has-icon {
    padding-right: 16px;
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
    children: string
    className?: string
  } & JSX.IntrinsicElements["button"]
) {
  const {icon, children, className, ...buttonProps} = props
  return (
    <Button
      className={classNames(className, {"has-icon": !!icon})}
      {...(buttonProps as any)}
    >
      {icon && <Icon name={icon} size={16} />}
      {children}
    </Button>
  )
}
