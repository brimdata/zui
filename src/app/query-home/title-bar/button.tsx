import classNames from "classnames"
import React, {ButtonHTMLAttributes} from "react"
import Icon, {IconName} from "src/app/core/icon-temp"
import styled from "styled-components"

const Btn = styled.button`
  background: var(--button-background);
  border: none;
  height: 22px;
  padding: 0 10px 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  gap: 6px;
  white-space: nowrap;

  &:hover {
    background: var(--button-background-hover);
  }
  &:active {
    background: var(--button-background-active);
  }

  &.primary {
    background: var(--primary-color);
    color: white;
    svg {
      fill: white;
    }
    &:hover {
      background: var(--primary-color-dark);
    }
    &:active {
      background: var(--primary-color-darker);
    }
  }

  &:disabled {
    svg {
      opacity: 0.3;
    }
  }
`

const Text = styled.span`
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
`

type Props = {
  children?: string
  icon?: IconName
  iconSize?: number
  primary?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  icon,
  iconSize,
  primary,
  children,
  className,
  ...rest
}: Props) {
  return (
    <Btn className={classNames(className, {primary: primary})} {...rest}>
      {icon && <Icon name={icon} size={iconSize ?? 12} />}
      {children && <Text>{children}</Text>}
    </Btn>
  )
}
