import classNames from "classnames"
import React, {useRef} from "react"
import styled from "styled-components"

const BG = styled.div`
  padding-left: 18px;
  height: 24px;
  font-family: system-ui;
  font-weight: 400;
  font-size: 11px;
  line-height: 24px;
  color: var(--aqua);
  display: flex;
  align-items: center;
  overflow: hidden;
  cursor: default !important;
  user-select: none;
  outline: none;

  &:hover:not(.isSelected) {
    background: rgba(0, 0, 0, 0.03);
  }

  &:active:not(.isSelected) {
    background: rgba(0, 0, 0, 0.08);
  }

  &.isSelected {
    background: var(--havelock);
    color: white;
  }
`

const Name = styled.p`
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  user-select: none;
  flex: 1;
`

const Input = styled.input`
  font-size: 11px;
  font-family: system-ui;
  font-weight: 400;
  font-size: 11px;
  line-height: 19px;
  color: var(--aqua);
  padding: 0 1px;
  border: 1px solid var(--havelock);
  height: 19px;
  outline: none;
  border-radius: 2px;
  margin: 0 2px 0 -2px;
  margin-right: 2px;
  width: 100%;
`

function Show({item}) {
  return <Name>{item.name}</Name>
}

function Edit({item}) {
  const input = useRef()
  // useLayoutEffect(() => input.current.select(), [])
  //   useOutsideClick(input, () => ctx.onRename(item, input.current.value))
  //   const onEnter = (e) =>
  // e.key === "Enter" && ctx.onRename(item, input.current.value)
  //   const onEscape = (e) => e.key === "Escape" && ctx.onRename(item, item.name)

  return (
    <Input
      ref={input}
      // onKeyPress={onEnter}
      // onKeyDown={onEscape}
      type="text"
      autoFocus
      defaultValue={item.name}
    />
  )
}

export default function Item({item, innerRef, itemProps, isSelected}) {
  const isEditing = false // for later
  return (
    <BG {...itemProps} ref={innerRef} className={classNames({isSelected})}>
      {isEditing ? <Edit item={item} /> : <Show item={item} />}
    </BG>
  )
}
