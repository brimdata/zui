import {createMenu} from "src/core/menu"
import * as pins from "src/app/commands/pins"

export const newPinMenu = createMenu("newPinMenu", ({api}) => {
  return [
    {
      label: "New 'From' Pin",
      command: pins.createFrom.bind(),
    },
    {label: "New 'Time Range' Pin", command: pins.createTimeRange.bind()},
    {
      label: "New Zed Snippet Pin",
      command: pins.createGeneric.bind(),
    },
    {type: "separator"},
    {
      label: "Pin Editor Value",
      enabled: !!api.editor.value.trim(),
      command: pins.createFromEditor.bind(),
    },
  ]
})
