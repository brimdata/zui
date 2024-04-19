import {invoke} from "src/core/invoke"
import {showMenu} from "src/core/menu"
import {Active} from "src/models/active"
import {Workspace} from "src/models/workspace"

export class WorkspacesController {
  showMenu() {
    showMenu([
      {
        label: "Add Workspace...",
        async click() {
          const {canceled, filePaths} = await invoke("window.showOpenDialog", {
            properties: ["openDirectory"],
          })
          if (!canceled && filePaths[0]) {
            Active.workspace = Workspace.create({path: filePaths[0]})
          }
        },
      },
      {
        type: "separator",
      },
      {
        label: "Remove Workspace",
        click: () => {},
      },
    ])
  }
}
