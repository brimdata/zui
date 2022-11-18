import React, {useEffect} from "react"
import {cssVar, darken, transparentize} from "polished"
import {ReactNode} from "react"
import styled from "styled-components"
import Icon from "src/app/core/icon-temp"
import {Dialog, useDialog} from "./dialog"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import Editor from "src/js/state/Editor"
import pinContextMenu from "./pin-context-menu"
import classNames from "classnames"
import mergeRefs from "src/app/core/utils/merge-refs"
import usePinDnd from "./use-pin-dnd"
import useCallbackRef from "src/js/components/hooks/useCallbackRef"
import {QueryPin} from "src/js/state/Editor/types"
import buildPin from "src/js/state/Editor/models/build-pin"
import {isEqual} from "lodash"
import submitSearch from "../../flows/submit-search"

const primary = cssVar("--primary-color") as string
const buttonColor = transparentize(0.8, primary)
const buttonHoverColor = transparentize(0.75, primary)
const buttonActiveColor = transparentize(0.7, primary)
const labelColor = darken(0.4, primary)
const prefixColor = darken(0.3, primary)

export const Button = styled.button`
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
    opacity: 0.5;
  }
`

export const Prefix = styled.span`
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

const DropCursor = styled.div`
  position: absolute;
  left: -4px;
  top: -4px;
  width: 2px;
  height: calc(100% + 8px);
  border-radius: 1px;
  background: var(--primary-color);
`

const DropCursorRight = styled(DropCursor)`
  left: initial;
  right: -4px;
`

function BaseForm(props: PinProps<QueryPin>) {
  const dispatch = useDispatch()

  function onSubmit(pin: QueryPin) {
    if (isEqual(pin, props.pin)) return
    dispatch(Editor.updatePin(pin))
    dispatch(submitSearch())
  }

  function onDelete() {
    dispatch(Editor.deletePin(props.index))
    dispatch(submitSearch())
  }

  function onReset() {
    dispatch(Editor.cancelPinEdit())
  }

  useDialog({onCancel: onReset, onClose: onReset})

  return (
    <props.form
      pin={props.pin}
      onSubmit={onSubmit}
      onReset={onReset}
      onDelete={onDelete}
    />
  )
}

export type PinProps<T extends QueryPin> = {
  index: number
  label: ReactNode
  pin: QueryPin
  prefix?: string
  showMenu?: () => void
  form?: React.FC<PinFormProps<T>>
}

export type PinFormProps<Pin extends QueryPin = QueryPin> = {
  pin: Pin
  onSubmit: (pin: Pin) => void
  onReset: () => void
  onDelete: () => void
}

/**
 * If you pass a form to this component, it will render it
 * in a dialog when editing. If you pass a showMenu function
 * to it, it will call it when editing.
 */
export const BasePin = React.forwardRef(function BasePin(
  props: PinProps<QueryPin>,
  forwardedRef
) {
  const [button, setButton] = useCallbackRef()
  const dndRef = usePinDnd(props.index)
  const pinCount = useSelector(Editor.getPinCount)
  const hoverIndex = useSelector(Editor.getPinHoverIndex)
  const lastPin = props.index + 1 === pinCount
  const isHovering = hoverIndex === props.index
  const isHoveringLastItem = lastPin && hoverIndex === pinCount
  const dispatch = useDispatch()
  const isEditing = useSelector(Editor.getPinEditIndex) === props.index
  const onClick = () => dispatch(Editor.editPin(props.index))
  const onContextMenu = () => dispatch(pinContextMenu(props.index))
  const className = classNames({disabled: props.pin.disabled})

  useEffect(() => {
    if (props.showMenu && isEditing) props.showMenu()
  }, [isEditing, props.showMenu])

  return (
    <>
      <Button
        title={buildPin(props.pin).toZed()}
        onClick={onClick}
        onContextMenu={onContextMenu}
        ref={mergeRefs(forwardedRef, setButton, dndRef)}
        className={className}
        onKeyUp={(e) => {
          if (e.key === "Backspace") {
            dispatch(Editor.deletePin(props.index))
          }
        }}
      >
        {props.prefix && <Prefix>{props.prefix}</Prefix>}
        <Label>{props.label}</Label>
        <Dropdown />
        {isHovering && <DropCursor />}
        {isHoveringLastItem && <DropCursorRight />}
      </Button>
      {props.form && (
        <Dialog
          open={isEditing}
          anchor={button}
          origin="bottom left"
          top={10}
          left={0}
          width={360}
        >
          <BaseForm {...props} />
        </Dialog>
      )}
    </>
  )
})
