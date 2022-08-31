import classNames from "classnames"
import * as React from "react"

import Icon from "src/app/core/icon-temp"
import styled from "styled-components"

type Props = {
  text?: string
  icon?: React.ReactNode
  dropdown?: boolean
  disabled?: boolean
  className?: string
  isPrimary?: boolean
  onClick: React.MouseEventHandler
}

const DropdownIcon = styled(Icon).attrs({name: "chevron-down"})`
  width: 9px;
  height: 9px;
  display: flex;
  justify-contents: center;
  align-items: center;
  margin: 0 4px;
`

const StyledIcon = styled.span`
  display: flex;
  margin: 0 4px;

  svg {
    fill: black;
    height: 16px;
    width: 16px;
  }
`
const Text = styled.span`
  ${(p) => p.theme.typography.labelSmall}
  white-space: nowrap;
  color: rgba(0, 0, 0, 0.6);
  display: flex;
  line-height: 16px;
  height: 16px;
  padding: 0 4px;
  white-space: nowrap;
`

const StyledButton = styled.button`
  background: var(--button-background);
  &:active:not(:disabled) {
    background: linear-gradient(#fefefe, 0.5px, #f3f3f3 2px);
  }
  border: none;
  border-radius: 6px;
  user-select: none;
  min-width: 48px;
  -webkit-app-region: no-drag;
  height: 22px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  & > * {
    pointer-events: none;
  }

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: var(--button-background-hover);
  }
  &:active:not(:disabled) {
    background: var(--button-background-active);
  }

  &.primary {
    background: linear-gradient(#4b91e2, #3a87df);
    ${Text} {
      color: white;
    }
    &:hover:not(:disabled) {
      background: var(--primary-color);
    }
    &:hover:not(:disabled) {
      background: var(--primary-color-dark);
    }
    &:active:not(:disabled) {
      background: var(--primary-color-darker);
    }
  }
`

const ToolbarButton = ({
  text,
  icon,
  disabled,
  dropdown,
  isPrimary,
  onClick,
  ...rest
}: Props) => {
  return (
    <StyledButton
      className={classNames({primary: isPrimary})}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {!!icon && <StyledIcon>{icon}</StyledIcon>}
      {!!text && <Text>{text}</Text>}
      {!!dropdown && <DropdownIcon />}
    </StyledButton>
  )
}

export default ToolbarButton
