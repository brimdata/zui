import {
  createAndLoadFiles,
  loadFiles as poolsLoadFiles,
} from "src/app/commands/pools"
import {createHandler} from "src/core/handlers"
import Current from "src/js/state/Current"
import LoadDataForm from "src/js/state/LoadDataForm"
import Pools from "src/js/state/Pools"

export const previewLoadFiles = createHandler(
  async (
    {dispatch, invoke, select},
    opts: {files: string[]; poolId?: string}
  ) => {
    const files = await invoke("loads.getFileTypes", opts.files)

    // This is wrong
    if (files.length === 1 && files[0].type === "pcap") {
      if (opts.poolId) {
        poolsLoadFiles.run(opts.poolId, opts.files)
      } else {
        createAndLoadFiles.run(opts.files)
      }
    } else {
      const lakeId = select(Current.getLakeId)
      const pool = select(Pools.get(lakeId, opts.poolId))
      dispatch(LoadDataForm.setPoolId(pool ? pool.id : null))
      dispatch(LoadDataForm.setFiles(opts.files))
      dispatch(LoadDataForm.setShow(true))
    }
  }
)
