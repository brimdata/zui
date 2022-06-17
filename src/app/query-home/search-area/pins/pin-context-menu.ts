import {MenuItemConstructorOptions} from "electron/main"
import {showContextMenu} from "src/js/lib/System"
import Editor from "src/js/state/Editor"
import submitSearch from "../../flows/submit-search"

export default function pinContextMenu(index: number) {
  return (dispatch, getState) => {
    const pins = Editor.getPins(getState())
    const pin = pins[index]

    showContextMenu([
      {
        label: "Edit",
        click: () => dispatch(Editor.editPin(index)),
      },
      {type: "separator"},
      {
        label: "Disable",
        enabled: !pin.disabled,
        click: () => {
          dispatch(Editor.disablePin(index))
          dispatch(submitSearch())
        },
      },
      {
        label: "Disable Others",
        enabled: pins.some((p) => !p.disabled),
        click: () => {
          dispatch(Editor.disableOtherPins(index))
          dispatch(submitSearch())
        },
      },
      {type: "separator"},
      {
        label: "Enable",
        enabled: !!pin.disabled,
        click: () => {
          dispatch(Editor.enablePin(index))
          dispatch(submitSearch())
        },
      },
      {
        label: "Enable Others",
        enabled: pins.some((p) => p.disabled),
        click: () => {
          dispatch(Editor.enableOtherPins(index))
          dispatch(submitSearch())
        },
      },
      {type: "separator"},
      {
        label: "Delete",
        click: () => {
          dispatch(Editor.deletePin(index))
          dispatch(submitSearch())
        },
      },
      {
        label: "Delete to the Right",
        click: () => {
          dispatch(Editor.deletePinsToTheRight(index))
          dispatch(submitSearch())
        },
      },
      {
        label: "Delete All",
        click: () => {
          dispatch(Editor.deleteAllPins())
          dispatch(submitSearch())
        },
      },
    ] as MenuItemConstructorOptions[])
  }
}
