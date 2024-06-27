import {createHandler} from "src/core/handlers"
import Current from "src/js/state/Current"
import LoadDataForm from "src/js/state/LoadDataForm"
import Pools from "src/js/state/Pools"
import {quickLoadFiles} from "./quick-load-files"
import Modal from "src/js/state/Modal"

export const previewLoadFiles = createHandler(
  "loads.previewLoadFiles",
  async (
    {dispatch, invoke, select},
    opts: {files: string[]; poolId?: string}
  ) => {
    const files = await invoke("loads.getFileTypes", opts.files)
    const lakeId = select(Current.getLakeId)
    const pool = select(Pools.get(lakeId, opts.poolId))
    const poolId = pool ? pool.id : null

    if (files.length === 1 && files[0].type === "pcap") {
      quickLoadFiles({files: files.map((f) => f.path), poolId})
    } else {
      if (select(LoadDataForm.getShow)) {
        // The preview load is already opened
        dispatch(LoadDataForm.addFiles(opts.files))
      } else {
        dispatch(LoadDataForm.setFiles(opts.files))
        dispatch(LoadDataForm.setPoolId(poolId))
        dispatch(Modal.show("preview-load"))
      }
    }
  }
)
