import classNames from "classnames"
import {isNumber, isUndefined} from "lodash"
import React, {
  MouseEventHandler,
  ReactNode,
  useLayoutEffect,
  useRef
} from "react"
import Icon from "src/app/core/icon-temp"
import useOutsideClick from "src/js/components/hooks/useOutsideClick"
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

  &:hover {
    background: var(--sidebar-item-hover);
  }

  &:active {
    background: var(--sidebar-item-active);
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
    <ToggleLink>
      <Icon name={`chevron-${props.isOpen ? "down" : "right"}`} />
    </ToggleLink>
  )
}

function getClassNames(props: ItemProps) {
  const oneSelection =
    isUndefined(props.isSelectedStart) &&
    isUndefined(props.isSelectedEnd) &&
    props.isSelected

  return classNames({
    "selected-start": oneSelection || props.isSelectedStart,
    "selected-end": oneSelection || props.isSelectedEnd
  })
}

const Rename = ({defaultValue, onSubmit}) => {
  const input = useRef(null)
  useLayoutEffect(() => input.current && input.current.select(), [])
  useOutsideClick(input, () => onSubmit(input.current.value))
  const onKey = (e) => {
    if (e.key === "Enter") onSubmit(input.current.value)
    else if (e.key === "Escape") onSubmit(defaultValue)
  }

  return (
    <Input
      ref={input}
      onKeyDown={onKey}
      type="text"
      autoFocus
      defaultValue={defaultValue}
    />
  )
}

function Content(props: ItemProps) {
  if (props.isEditing) {
    return <Rename defaultValue={props.text} onSubmit={props.onSubmit} />
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
  icon?: ReactNode
  progress?: number
  onClick?: MouseEventHandler
  onContextMenu?: MouseEventHandler
  onSubmit?: (text: string) => void
  style?: CSSProperties
  indentStyle?: CSSProperties
  isSelected?: boolean
  isSelectedStart?: boolean
  isSelectedEnd?: boolean
  isFolder?: boolean
  isOpen?: boolean
  isEditing?: boolean
}

export function Item(props: ItemProps) {
  return (
    <Container tabIndex={0} style={props.style}>
      <BG
        aria-selected={props.isSelected}
        className={getClassNames(props)}
        onClick={props.onClick}
        onContextMenu={props.onContextMenu}
        style={props.indentStyle}
      >
        <Toggle {...props} />
        <ItemIcon {...props} />
        <Content {...props} />
        <Progress {...props} />
      </BG>
    </Container>
  )
}
