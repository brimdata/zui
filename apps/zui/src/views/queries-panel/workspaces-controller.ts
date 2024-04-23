import {invoke} from "src/core/invoke"
import {toast} from "src/core/toast"
import {showMenu} from "src/core/menu"
import {Active} from "src/models/active"
import {Workspace} from "src/models/workspace"

export class WorkspacesController {
  showMenu() {
    const workspaces = Workspace.all.map((workspace) => {
      return {
        label: workspace.name,
        click: () => (Active.workspace = workspace),
      }
    })
    const remove = {
      label: "Remove Workspace",
      click: () => {
        Active.workspace.destroy()
        Active.workspace = null
        toast("Workspace removed.")
      },
    }
    const add = {
      label: "Add Workspace...",
      async click() {
        const {canceled, filePaths} = await invoke("window.showOpenDialog", {
          properties: ["openDirectory"],
        })
        if (!canceled && filePaths[0]) {
          Active.workspace = Workspace.create({path: filePaths[0]})
          toast("Workspace added.")
        }
      },
    }

    showMenu([
      add,
      {type: "separator"},
      ...workspaces,
      {type: "separator"},
      remove,
    ])
  }
}
