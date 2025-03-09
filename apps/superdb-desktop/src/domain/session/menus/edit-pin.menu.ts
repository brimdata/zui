import Editor from "src/js/state/Editor"
import * as handlers from "../handlers/pins"
import {createMenu} from "src/core/menu"

export const editPinMenu = createMenu(({select}, index: number) => {
  const pins = select(Editor.getPins)
  const pin = pins[index]
  return [
    {
      label: "Disable",
      enabled: !pin.disabled,
      click: () => handlers.disablePin(index),
    },
    {
      label: "Disable Others",
      enabled: pins.some((p) => !p.disabled),
      click: () => handlers.disableOthers(index),
    },
    {type: "separator"},
    {
      label: "Enable",
      enabled: !!pin.disabled,
      click: () => handlers.enablePin(index),
    },
    {
      label: "Enable Others",
      enabled: pins.some((p) => p.disabled),
      click: () => handlers.enableOthers(index),
    },
    {type: "separator"},
    {
      label: "Delete",
      click: () => handlers.deletePin(index),
    },
    {
      label: "Delete to the Right",
      click: () => handlers.deleteToTheRight(index),
    },
    {
      label: "Delete All",
      click: () => handlers.deleteAll(),
    },
  ]
})
