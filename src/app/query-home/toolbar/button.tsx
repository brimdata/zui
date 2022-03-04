import * as React from "react"

import Icon from "src/app/core/icon"
import styled from "styled-components"

type Props = {
  text?: string
  icon?: React.ReactNode
  dropdown?: boolean
  disabled?: boolean
  className?: string
  isPrimary?: boolean
  onClick: () => void
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

const StyledButton = styled.button<{isPrimary: boolean; disabled: boolean}>`
  background: var(--control-background);
  &:active:not(:disabled) {
    background: linear-gradient(#fefefe, 0.5px, #f3f3f3 2px);
  }
  border: none;
  border-radius: 4px;
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

  ${({isPrimary}) =>
    isPrimary &&
    `
  background: linear-gradient(#4b91e2, #3a87df);
  .text {
    color: white;
  }
  &:active:not(:disabled) {
    background: var(--azure);
  } 
  `}
  &:hover:not(:disabled) {
    background: var(--control-hover);
  }
  &:active:not(:disabled) {
    background: var(--control-active);
  }
`

const ToolbarButton = ({
  text,
  icon,
  disabled,
  dropdown,
  isPrimary,
  onClick
}: Props) => {
  return (
    <StyledButton isPrimary={isPrimary} disabled={disabled} onClick={onClick}>
      {!!icon && <StyledIcon>{icon}</StyledIcon>}
      {!!text && <Text>{text}</Text>}
      {!!dropdown && <DropdownIcon />}
    </StyledButton>
  )
}

export default ToolbarButton
