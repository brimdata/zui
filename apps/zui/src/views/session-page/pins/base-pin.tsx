import React from "react"
import {ReactNode} from "react"
import {Dialog, useDialog} from "./dialog"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import Editor from "src/js/state/Editor"
import classNames from "classnames"
import mergeRefs from "src/util/merge-refs"
import usePinDnd from "./use-pin-dnd"
import useCallbackRef from "src/js/components/hooks/useCallbackRef"
import {QueryPin} from "src/js/state/Editor/types"
import buildPin from "src/js/state/Editor/models/build-pin"
import {isEqual} from "lodash"
import styles from "../pins.module.css"
import {showContextMenu} from "src/core/menu/show-context-menu"
import {popupPosition} from "src/core/menu/popup-position"
import {call} from "src/util/call"
import {submitSearch} from "src/domain/session/handlers"
import {editPinMenu} from "src/domain/session/menus/edit-pin.menu"
import {MenuItem} from "src/core/menu"

function BaseForm(props: PinProps<QueryPin>) {
  const dispatch = useDispatch()

  function onSubmit(pin: QueryPin) {
    if (isEqual(pin, props.pin)) return
    dispatch(Editor.updatePin(pin))
    submitSearch()
  }

  function onDelete() {
    dispatch(Editor.deletePin(props.index))
    submitSearch()
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
  onMenu?: (items: MenuItem[]) => void
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
  const className = classNames(
    {[styles.disabled]: props.pin.disabled},
    {[styles.hovering]: isHovering || isHoveringLastItem},
    styles.pin
  )

  function onClick() {
    const menu = editPinMenu(props.index)
    if (props.form) {
      menu.unshift(
        {
          label: "Edit",
          click: () => dispatch(Editor.editPin(props.index)),
        },
        {type: "separator"}
      )
    } else {
      call(props.onMenu, menu)
    }
    showContextMenu(menu, popupPosition(button))
  }

  return (
    <>
      <button
        title={buildPin(props.pin).toZed()}
        onClick={onClick}
        onContextMenu={onClick}
        ref={mergeRefs(forwardedRef, setButton, dndRef)}
        className={className}
        onKeyUp={(e) => {
          e.key === "Backspace" && dispatch(Editor.deletePin(props.index))
        }}
      >
        {props.prefix && <span>{props.prefix} </span>}
        {props.label}
        {true && (
          <div
            className={classNames(styles.dropCursor, {
              [styles.dropCursorRight]: isHoveringLastItem,
            })}
          />
        )}
      </button>

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
