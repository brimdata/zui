import {createHandler} from "src/core/handlers"
import Current from "src/js/state/Current"
import LoadDataForm from "src/js/state/LoadDataForm"
import Pools from "src/js/state/Pools"
import Modal from "src/js/state/Modal"

export const previewLoadFiles = createHandler(
  "loads.previewLoadFiles",
  async ({dispatch, select}, opts: {files: string[]; poolId?: string}) => {
    const lakeId = select(Current.getLakeId)
    const pool = select(Pools.get(lakeId, opts.poolId))
    const poolId = pool ? pool.id : null

    if (select(LoadDataForm.getShow)) {
      // The preview load is already opened
      dispatch(LoadDataForm.addFiles(opts.files))
    } else {
      dispatch(LoadDataForm.setFiles(opts.files))
      dispatch(LoadDataForm.setPoolId(poolId))
      dispatch(Modal.show("preview-load"))
    }
  }
)
