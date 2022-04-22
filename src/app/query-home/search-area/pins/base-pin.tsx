import React, {useEffect, useRef} from "react"
import {cssVar, darken, transparentize} from "polished"
import {ReactNode} from "react"
import styled from "styled-components"
import Icon from "src/app/core/icon-temp"
import {Dialog} from "./dialog"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import Editor from "src/js/state/Editor"
import pinContextMenu from "./pin-context-menu"
import classNames from "classnames"
import mergeRefs from "src/app/core/utils/merge-refs"

const primary = cssVar("--primary-color") as string
const buttonColor = transparentize(0.8, primary)
const buttonHoverColor = transparentize(0.75, primary)
const buttonActiveColor = transparentize(0.7, primary)
const labelColor = darken(0.4, primary)
const prefixColor = darken(0.3, primary)

const Button = styled.button`
  font-family: var(--mono-font);
  position: relative;
  margin-right: 4px;
  margin-bottom: 4px;
  max-width: 100%;
  height: 20px;
  white-space: nowrap;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: ${labelColor};
  background: ${buttonColor};
  border: none;
  border-radius: 8px;
  box-shadow: 0;
  border: 1px solid transparent;

  &:hover {
    background: ${buttonHoverColor};
  }
  &:active {
    background: ${buttonActiveColor};
  }

  &.disabled {
    text-decoration: line-through;
  }
`

const Prefix = styled.span`
  opacity: 0.5;
  margin-right: 8px;
  text-transform: uppercase;
  font-size: 11px;
  color: ${prefixColor};
  font-weight: bold;
  flex-shrink: 0;
`

const Label = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 15px;
`

const Dropdown = styled(Icon).attrs({name: "chevron-down"})`
  flex: 0 0 13px;
  flex-basis: 13px;
  margin-left: 4px;
  svg {
    width: 13px;
    height: 13px;
  }
`

export type PinProps = {
  index: number
  label: ReactNode
  prefix?: string
  showMenu?: () => void
  form?: ReactNode
  disabled?: boolean
}

/**
 * If you pass a form to this component, it will render it
 * in a dialog when editing. If you pass a showMenu function
 * to it, it will call it when editing.
 */
export const BasePin = React.forwardRef(function BasePin(
  props: PinProps,
  forwardedRef
) {
  const ref = useRef()
  const dispatch = useDispatch()
  const isEditing = useSelector(Editor.getPinEditIndex) === props.index
  const onClick = () => dispatch(Editor.editPin(props.index))
  const onContextMenu = () => dispatch(pinContextMenu(props.index))
  const className = classNames({disabled: props.disabled})

  useEffect(() => {
    if (props.showMenu && isEditing) props.showMenu()
  }, [isEditing, props.showMenu])

  return (
    <>
      <Button
        onClick={onClick}
        onContextMenu={onContextMenu}
        ref={mergeRefs(forwardedRef, ref)}
        className={className}
      >
        {props.prefix && <Prefix>{props.prefix}</Prefix>}
        <Label>{props.label}</Label>
        <Dropdown />
      </Button>
      {props.form && (
        <Dialog
          open={isEditing}
          anchor={ref.current}
          origin="bottom left"
          top={10}
          left={0}
          width={360}
        >
          {props.form}
        </Dialog>
      )}
    </>
  )
})
