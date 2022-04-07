import classNames from "classnames"
import {MenuItemConstructorOptions} from "electron"
import React from "react"
import useCallbackRef from "src/js/components/hooks/useCallbackRef"
import {showContextMenu} from "src/js/lib/System"
import {Dialog} from "./dialog"
import {QueryPin} from "./reducer"

export function Pin(props: {
  pin: QueryPin
  index: number
  menu: () => MenuItemConstructorOptions[]
  onClick: () => void
  children: any
  isEditing: boolean
  dialog: any
}) {
  const [ref, setRef] = useCallbackRef<HTMLButtonElement>()
  return (
    <>
      <button
        ref={setRef}
        key={props.index}
        onContextMenu={() => showContextMenu(pinMenu())}
        onClick={props.onClick}
        className={classNames("pin-button", {editing: props.isEditing})}
      >
        {props.children}
      </button>
      <Dialog
        open={props.isEditing}
        anchor={ref}
        origin="bottom left"
        top={10}
        left={0}
        width={560}
      >
        {<props.dialog {...props} />}
      </Dialog>
    </>
  )
}

function pinMenu() {
  return [
    {label: "Disable"},
    {label: "Remove"},
    {label: "Edit"},
    {label: "Label"},
    {label: "Copy Value"}
  ]
}
