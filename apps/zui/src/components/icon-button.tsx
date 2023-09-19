import classNames from "classnames"
import React, {
  MouseEvent,
  MouseEventHandler,
  MutableRefObject,
  forwardRef,
} from "react"
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
  height: 28px;
  min-width: 32px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 100ms;

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: var(--hover-dark);
  }

  &:active:not(:disabled) {
    background: var(--active-dark);
  }

  &.icon-label {
    gap: 6px;
    padding: 0 8px;
    border: 1px solid var(--border-color-dark);
    font-weight: 500;
    font-size: 14px;
    height: 28px;
  }
`

export const IconButton = forwardRef(function IconButton(
  props: MenuItem & {
    className?: string
    onClick?: MouseEventHandler<HTMLButtonElement>
  },
  ref: MutableRefObject<HTMLButtonElement>
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
      ref={ref}
      className={classNames(props.className, props.type)}
      title={props.description ?? props.label}
      onClick={onClick}
      disabled={props.enabled === false || props.whenResult === false}
      aria-label={props.label}
    >
      <Icon name={props.iconName} size={props.iconSize ?? 16} />
      {props.type === "icon-label" ? props.label : null}
    </BG>
  )
})
