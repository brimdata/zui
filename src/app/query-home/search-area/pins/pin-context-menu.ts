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
      {type: "separator"},
      {
        label: "Disable",
        enabled: !pin.disabled,
        click: () => dispatch(Editor.disablePin(index))
      },
      {
        label: "Disable Others",
        enabled: pins.some((p) => !p.disabled),
        click: () => dispatch(Editor.disableOtherPins(index))
      },
      {type: "separator"},
      {
        label: "Enable",
        enabled: !!pin.disabled,
        click: () => dispatch(Editor.enablePin(index))
      },
      {
        label: "Enable Others",
        enabled: pins.some((p) => p.disabled),
        click: () => dispatch(Editor.enableOtherPins(index))
      },
      {type: "separator"},
      {
        label: "Delete",
        click: () => dispatch(Editor.deletePin(index))
      },
      {
        label: "Delete to the Right",
        click: () => dispatch(Editor.deletePinsToTheRight(index))
      },
      {
        label: "Delete All",
        click: () => dispatch(Editor.deleteAllPins())
      }
    ] as MenuItemConstructorOptions[])
  }
}
