import {NodeApi} from "react-arborist"
import {Group} from "src/js/state/Queries/types"
import {createCommand} from "./command"
import {invoke} from "src/core/invoke"

export const exportQueryGroup = createCommand(
  "exportQueryGroup",
  async ({api}, node: NodeApi<Group>) => {
    const {canceled, filePath} = await invoke("showSaveDialogOp", {
      title: `Save Queries Folder as JSON`,
      buttonLabel: "Export",
      defaultPath: `${node.data.name}.json`,
      properties: ["createDirectory"],
      showsTagField: false,
    })
    if (canceled) return
    try {
      await invoke("exportQueries", node.id, filePath)
      api.toast.success(`Exported query group to ${filePath}`)
    } catch (e) {
      api.toast.error(e?.toString())
    }
  }
)
