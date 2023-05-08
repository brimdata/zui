import React, {MouseEvent, MouseEventHandler} from "react"
import {BoundCommand} from "src/app/commands/command"
import Icon from "src/app/core/icon-temp"
import {invoke} from "src/core/invoke"
import {MenuItem} from "src/core/menu"
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

export function IconButton(
  props: MenuItem & {
    className?: string
    onClick?: MouseEventHandler<HTMLButtonElement>
  }
) {
  function onClick(e: MouseEvent<HTMLButtonElement>) {
    if (props.onClick) {
      props.onClick && props.onClick(e)
    } else if (typeof props.command === "string") {
      invoke("invokeCommandOp", props.command, props.args)
    } else if (props.command instanceof BoundCommand) {
      props.command.run()
    } else if (props.click) {
      props.click()
    }
  }
  return (
    <BG
      className={props.className}
      title={props.description ?? props.label}
      onClick={onClick}
      disabled={props.enabled === false || props.whenResult === false}
      aria-label={props.label}
    >
      <Icon name={props.iconName} size={props.iconSize ?? 16} />
    </BG>
  )
}
