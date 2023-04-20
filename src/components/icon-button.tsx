import React from "react"
import Icon from "src/app/core/icon-temp"
import {MenuItem} from "src/core/menu"
import {invokeCommand} from "src/js/electron/ops"
import styled from "styled-components"

const BG = styled.button`
  background: none;
  border: none;
  border-radius: 6px;
  user-select: none;
  height: 24px;
  width: 32px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

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
`

export function IconButton(props: MenuItem & {className?: string}) {
  return (
    <BG
      className={props.className}
      title={props.description ?? props.label}
      onClick={() => invokeCommand(props.command, props.args)}
      disabled={props.enabled === false}
      aria-label={props.label}
    >
      <Icon name={props.iconName} size={props.iconSize ?? 16} />
    </BG>
  )
}
