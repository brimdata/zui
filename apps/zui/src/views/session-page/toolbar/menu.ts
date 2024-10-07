import {MenuItem} from "src/core/menu"

export function createMenu() {
  return [
    {
      label: "Update Query",
      command: "session.updateQuery",
      iconName: "check",
      when: "session.hasModifiedQuery",
    },
    {
      label: "Detach from Query",
      command: "session.resetQuery",
      iconName: "close_circle",
      when: "session.hasQuery",
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
  ] as MenuItem[]
}
