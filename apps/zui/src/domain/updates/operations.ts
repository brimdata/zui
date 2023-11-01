import {createOperation} from "src/core/operations"
import {updater} from "./updater"
import Updates from "src/js/state/Updates"
import {errorToString} from "src/util/error-to-string"

export const open = createOperation("updates.open", ({main}) => {
  main.windows.activate("update")
})

export const check = createOperation(
  "updates.check",
  async ({main, dispatch}) => {
    try {
      dispatch(Updates.setIsChecking(true))
      const newVersion = await updater.check()
      if (newVersion) {
        dispatch(Updates.setNextVersion(newVersion))
        main.windows.activate("update")
      }
    } catch (e) {
      dispatch(Updates.setError(errorToString(e)))
    } finally {
      dispatch(Updates.setIsChecking(false))
    }
  }
)

export const install = createOperation(
  "updates.install",
  async ({dispatch}) => {
    const onProgress = (n: number) => dispatch(Updates.setDownloadProgress(n))
    try {
      dispatch(Updates.setIsDownloading(true))
      dispatch(Updates.setDownloadProgress(0))
      await updater.install(onProgress)
    } catch (e) {
      dispatch(Updates.setError(errorToString(e)))
    } finally {
      dispatch(Updates.setIsDownloading(false))
    }
  }
)
