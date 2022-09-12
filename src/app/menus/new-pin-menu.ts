import {createMenu} from "./create-menu"
import * as pins from "src/app/commands/pins"

export const newPinMenu = createMenu("newPinMenu", ({api}) => {
  return [
    {
      label: "New 'From' Pin",
      command: pins.createFrom,
    },
    {label: "New 'Time Range' Pin", command: pins.createTimeRange},
    {
      label: "New 'Generic' Pin",
      command: pins.createGeneric,
    },
    {type: "separator"},
    {
      label: "Pin Editor Value",
      enabled: !!api.editor.value.trim(),
      command: pins.createFromEditor,
    },
  ]
})
