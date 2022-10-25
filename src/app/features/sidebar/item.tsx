import classNames from "classnames"
import {isNumber, isUndefined} from "lodash"
import React, {
  HTMLAttributes,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  Ref,
} from "react"
import {NodeState} from "react-arborist"
import Icon from "src/app/core/icon-temp"
import ProgressIndicator from "src/js/components/ProgressIndicator"
import styled, {CSSProperties} from "styled-components"

const Container = styled.div`
  height: 28px;
  display: flex;
  align-items: center;
  cursor: default;
  user-select: none;
  outline: none;
  white-space: nowrap;
  padding: 0 10px;

  &.isOverFolder {
    background-color: hsla(0 0% 0% / 0.06);
  }

  &.isDragging:not(.isSelected) {
    background-color: inherit;
  }
`

const Name = styled.p`
  flex: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 0 8px;
`

const BG = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 6px;

  &:hover:not(.dragging) {
    background: rgb(0 0 0 / 0.03);
  }

  &:active:not(.dragging) {
    background: rgb(0 0 0 / 0.05);
  }

  &.droppable {
    background: rgb(0 0 0 / 0.1);
  }

  [aria-role="tree-item"]:focus-visible & {
    background-color: var(--primary-color-light);
  }

  &[aria-selected="true"] {
    border-radius: 0;
    outline: none;
    background-color: var(--primary-color);
    color: white;
    svg {
      fill: white;
      opacity: 1;
    }
    &:hover {
      background-color: var(--primary-color);
    }
    &.selected-start {
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
    }
    &.selected-end {
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
    }
  }
`

const Input = styled.input`
  padding: 0 4px;
  margin: 0 2px 0 2px;
  border: 2px solid var(--primary-color);
  height: 24px;
  border-radius: 3px;
  outline: none;
  flex: 1;
  min-width: 0;
`

const ItemIconBG = styled.div<{isFolder: boolean}>`
  margin-left: ${(p) => (p.isFolder ? 0 : 16)}px;
  svg {
    width: 14px;
    height: 14px;
    opacity: 0.5;
    fill: var(--foreground-color);
  }
`

const ToggleLink = styled.a`
  display: flex;
  justify-content: center;
  width: 16px;
  svg {
    height: 14px;
    width: 14px;
  }
`

const ProgressBG = styled.div`
  .progress-track {
    background-color: rgba(0, 0, 0, 0.15);
  }
  .progress-fill {
    background-color: white;
  }
  flex: 0.5;
  max-width: 50px;
  margin: 0 10px;
`

function ItemIcon(props: ItemProps) {
  if (!props.icon) return null
  return <ItemIconBG isFolder={props.isFolder}>{props.icon}</ItemIconBG>
}

function Toggle(props: ItemProps) {
  if (!props.isFolder) return null
  return (
    <ToggleLink
      onClick={(e) => {
        e.stopPropagation()
        props.onToggle()
      }}
    >
      <Icon name={`chevron-${props.state.isOpen ? "down" : "right"}`} />
    </ToggleLink>
  )
}

function getClassNames(props: ItemProps) {
  const oneSelection =
    isUndefined(props.state?.isSelectedStart) &&
    isUndefined(props.state?.isSelectedEnd) &&
    props.state?.isSelected

  return classNames({
    "selected-start": oneSelection || props.state?.isSelectedStart,
    "selected-end": oneSelection || props.state?.isSelectedEnd,
    droppable: props.state?.willReceiveDrop,
    dragging: props.state?.isDragging,
    "is-focused": props.state?.isFocused,
  })
}

const Rename = (props: ItemProps) => {
  return (
    <Input
      type="text"
      autoFocus
      defaultValue={props.inputValue ?? props.text}
      onKeyDown={(e) => {
        if (e.key === "Enter") props.onSubmit(e.currentTarget.value)
        if (e.key === "Escape") props.onReset()
      }}
      onFocus={(e) => e.currentTarget.select()}
      onBlur={() => props.onReset()}
    />
  )
}

function Content(props: ItemProps) {
  if (props.state?.isEditing) {
    return <Rename {...props} />
  } else {
    return <Name>{props.text}</Name>
  }
}

function Progress(props: ItemProps) {
  if (!isNumber(props.progress)) return null
  return (
    <ProgressBG>
      <ProgressIndicator percent={props.progress} />
    </ProgressBG>
  )
}

type ItemProps = {
  text: string
  style?: CSSProperties
  innerStyle?: CSSProperties
  icon?: ReactNode
  progress?: number
  onClick?: MouseEventHandler
  onDoubleClick?: MouseEventHandler
  onContextMenu?: MouseEventHandler
  onSubmit?: (text: string) => void
  onReset?: () => void
  onToggle?: () => void
  inputValue?: string
  onKeyPress?: KeyboardEventHandler
  state?: NodeState
  innerRef?: Ref<HTMLDivElement>
  isFolder?: boolean
  aria?: HTMLAttributes<any>
}

export function Item(props: ItemProps) {
  return (
    <Container
      style={props.style}
      ref={props.innerRef}
      title={props.text}
      {...props.aria}
    >
      <BG
        aria-selected={props.state?.isSelected}
        className={getClassNames(props)}
        style={props.innerStyle}
        onClick={props.onClick}
        onContextMenu={props.onContextMenu}
        onDoubleClick={props.onDoubleClick}
        onKeyPress={props.onKeyPress}
      >
        <Toggle {...props} />
        <ItemIcon {...props} />
        <Content {...props} />
        <Progress {...props} />
      </BG>
    </Container>
  )
}
