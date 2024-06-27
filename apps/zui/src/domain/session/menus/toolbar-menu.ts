import {createMenu} from "src/core/menu"
import {ActiveQuery} from "src/models/active-query"

export const sessionToolbarMenu = createMenu((_, query: ActiveQuery) => {
  return [
    {
      label: "Update Query",
      command: "namedQueries.update",
      iconName: "check",
      visible: query.isModified(),
    },
    {
      label: "Detach from Query",
      command: "session.resetQuery",
      iconName: "close_circle",
      visible: query.isSaved(),
    },
    {
      label: "Save as New Query",
      command: "session.saveAsNewQuery",
      iconName: "add",
    },
    {
      label: "New Pin",
      iconName: "pin",
      nestedMenu: [
        {
          label: "New 'From' Pin",
          command: "session.createFromPin",
        },
        {
          label: "New 'Time Range' Pin",
          command: "session.createTimeRangePin",
        },
        {
          label: "New Zed Snippet Pin",
          command: "session.createPin",
        },
        {type: "separator"},
        {
          label: "Pin Editor Value",
          command: "session.createPinFromEditor",
        },
      ],
    },
    {
      id: "export-results",
      label: "Export Results",
      iconName: "export",
      command: "results.showExportDialog",
    },
    {
      label: "Run Query",
      iconName: "run",
      command: "session.runQuery",
    },
  ]
})
