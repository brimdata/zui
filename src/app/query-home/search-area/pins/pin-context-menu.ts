import {MenuItemConstructorOptions} from "electron/main"
import {showContextMenu} from "src/js/lib/System"
import Editor from "src/js/state/Editor"

export default function pinContextMenu(index: number) {
  return (dispatch, getState) => {
    const pins = Editor.getPins(getState())
    const pin = pins[index]

    showContextMenu([
      {
        label: "Edit",
        click: () => dispatch(Editor.editPin(index))
      },
      {
        label: "Disable",
        visible: !pin.disabled,
        click: () => dispatch(Editor.disablePin(index))
      },
      {
        label: "Enable",
        visible: !!pin.disabled,
        click: () => dispatch(Editor.enablePin(index))
      },
      {type: "separator"},
      {
        label: "Delete",
        click: () => dispatch(Editor.deletePin(index))
      }
    ] as MenuItemConstructorOptions[])
  }
}
