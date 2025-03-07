import classNames from "classnames"
import {isNumber, isUndefined} from "lodash"
import React, {
  HTMLAttributes,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  Ref,
  useRef,
} from "react"
import {NodeState} from "react-arborist"
import {Icon} from "src/components/icon"
import ProgressIndicator from "src/js/components/ProgressIndicator"
import styled, {CSSProperties} from "styled-components"

export const TREE_ITEM_HEIGHT = 32

const Container = styled.div`
  height: ${TREE_ITEM_HEIGHT}px;
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
    background: var(--emphasis-bg-less);
  }

  &:active:not(.dragging) {
    background: var(--emphasis-bg);
    box-shadow: var(--sidebar-item-active-shadow);
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
    box-shadow: var(--shadow-s);
    background: var(--selected-bg);

    svg {
      opacity: 1;
    }
    &:hover {
      background-color: var(--selected-bg);
    }
    &:active {
      background-color: var(--selected-bg-active);
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
  background-color: var(--form-bg-color);
`

const ItemIconBG = styled.div<{isFolder: boolean}>`
  margin-left: ${(p) => (p.isFolder ? 0 : 16)}px;
  display: flex;
  svg {
    opacity: 0.5;
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
      <Icon name={`chevron_${props.state.isOpen ? "down" : "right"}`} />
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
  const defaultValue = props.inputValue ?? props.text
  const submitting = useRef(false)

  function handleSubmit(value: string) {
    if (submitting.current) return
    value === defaultValue ? props.onReset() : props.onSubmit(value)
    submitting.current = true
  }

  return (
    <Input
      autoFocus
      type="text"
      defaultValue={defaultValue}
      onFocus={(e) => e.currentTarget.select()}
      onBlur={(e) => handleSubmit(e.currentTarget.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.stopPropagation()
          handleSubmit(e.currentTarget.value)
        }
        if (e.key === "Escape") props.onReset()
      }}
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

export const ItemText = styled.p``
