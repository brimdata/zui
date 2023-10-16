import {
  createAndLoadFiles,
  loadFiles as poolsLoadFiles,
} from "src/app/commands/pools"
import {createHandler} from "src/core/handlers"
import LoadDataForm from "src/js/state/LoadDataForm"

export const previewLoadFiles = createHandler(
  async ({dispatch, invoke}, opts: {files: string[]; poolId?: string}) => {
    const files = await invoke("loads.getFileTypes", opts.files)

    if (files.length === 1 && files[0].type === "pcap") {
      if (opts.poolId) {
        poolsLoadFiles.run(opts.poolId, opts.files)
      } else {
        createAndLoadFiles.run(opts.files)
      }
    } else {
      dispatch(LoadDataForm.setPoolId(opts.poolId))
      dispatch(LoadDataForm.setFiles(opts.files))
      dispatch(LoadDataForm.setShow(true))
    }
  }
)
