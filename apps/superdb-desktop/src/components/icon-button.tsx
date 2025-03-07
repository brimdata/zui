import classNames from "classnames"
import React, {
  CSSProperties,
  MouseEvent,
  MouseEventHandler,
  MutableRefObject,
  forwardRef,
} from "react"
import {Icon} from "src/components/icon"
import {MenuItem} from "src/core/menu"
import {handleClick} from "src/core/menu/handle-click"
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
  transition: background var(--hover-duration), transform var(--hover-duration);
  -webkit-app-region: no-drag;

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: var(--emphasis-bg);
    svg {
      transform: scale(1.03);
    }
  }

  &:active:not(:disabled) {
    background: var(--emphasis-bg);
    transform: scale(0.99);
  }

  &.icon-label {
    gap: 6px;
    padding: 0 8px;
    border: 1px solid var(--border-color-more);
    font-weight: 500;
    height: 28px;
  }
`

export const IconButton = forwardRef(function IconButton(
  props: MenuItem & {
    className?: string
    style?: CSSProperties
    onClick?: MouseEventHandler<HTMLButtonElement>
    onMouseDown?: MouseEventHandler<HTMLButtonElement>
    buildMenu?: () => MenuItem[]
  },
  ref: MutableRefObject<HTMLButtonElement>
) {
  // I think this needs to move into some core place
  function onClick(e: MouseEvent<HTMLButtonElement>) {
    if (props.onClick) {
      props.onClick && props.onClick(e)
    } else {
      handleClick(props, e.currentTarget)
    }
  }

  return (
    <BG
      ref={ref}
      className={classNames(props.className, props.display)}
      style={props.style}
      data-tooltip={
        props.display === "icon-label" ? null : props.description ?? props.label
      }
      onClick={onClick}
      onMouseDown={props.onMouseDown}
      disabled={props.enabled === false || props.whenResult === false}
      aria-label={props.label}
      type="button"
    >
      <Icon name={props.iconName} />
      {props?.nestedMenu?.length && <Icon name="chevron_down" size="0.9rem" />}
      {props.display === "icon-label" ? props.label : null}
    </BG>
  )
})
