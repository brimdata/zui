import {createMenu} from "./create-menu"
import * as pins from "src/app/commands/pins"

export const newPinMenu = createMenu("newPinMenu", ({api}) => {
  return [
    {
      label: "Pin Editor Value",
      enabled: !!api.editor.value.trim(),
      command: pins.createFromEditor,
    },
    {
      label: "New 'Generic' Pin",
      command: pins.createGeneric,
    },
    {
      label: "New 'From' Pin",
      command: pins.createFrom,
    },
    {label: "New 'Time Range' Pin", command: pins.createTimeRange},
  ]
})
