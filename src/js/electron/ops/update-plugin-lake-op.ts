import {lake} from "src/zui"
import {createOperation} from "../../../core/operations"

export const updatePluginLakeOp = createOperation(
  "updatePluginLakeOp",
  async ({main}, state: {lakeId: string}) => {
    lake.client = await main.createClient(state.lakeId)
  }
)

export type UpdatePluginLakeOp = typeof updatePluginLakeOp
