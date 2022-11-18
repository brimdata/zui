import {NodeApi} from "react-arborist"
import {exportQueryGroupOp} from "src/js/electron/ops/export-query-group-op"
import {showSaveDialogOp} from "src/js/electron/ops/show-save-dialog-op"
import {Group} from "src/js/state/Queries/types"
import {createCommand} from "./command"

export const exportQueryGroup = createCommand(
  "exportQueryGroup",
  async ({api}, node: NodeApi<Group>) => {
    const {canceled, filePath} = await showSaveDialogOp.invoke({
      title: `Save Queries Folder as JSON`,
      buttonLabel: "Export",
      defaultPath: `${node.data.name}.json`,
      properties: ["createDirectory"],
      showsTagField: false,
    })
    if (canceled) return
    try {
      await exportQueryGroupOp.invoke(node.id, filePath)
      api.toast.success(`Exported query group to ${filePath}`)
    } catch (e) {
      api.toast.error(e?.toString())
    }
  }
)
