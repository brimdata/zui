import {createMenu} from "src/core/menu"

export const sessionToolbarMenu = createMenu(
  (_, args: {isModified: boolean; isSaved: boolean}) => {
    return [
      {
        label: "Update Query",
        command: "namedQueries.update",
        iconName: "check",
        visible: args.isModified,
      },
      {
        label: "Detach from Query",
        command: "session.resetQuery",
        iconName: "close_circle",
        visible: args.isSaved,
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
  }
)
