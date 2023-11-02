import {createOperation} from "src/core/operations"
import {updater} from "./updater"
import Updates from "src/js/state/Updates"
import {errorToString} from "src/util/error-to-string"
import {info} from "src/core/log"

export const open = createOperation("updates.open", ({main}) => {
  main.windows.activate("update")
})

export const check = createOperation(
  "updates.check",
  async ({main, dispatch}) => {
    try {
      info("Checking for Updates...")
      dispatch(Updates.setIsChecking(true))
      const newVersion = await updater.check()
      if (newVersion) {
        info("New Version Found: " + newVersion)
        dispatch(Updates.setNextVersion(newVersion))
        main.windows.activate("update")
      }
    } catch (e) {
      info("Error Checking for Update: " + errorToString(e))
      dispatch(Updates.setError(errorToString(e)))
    } finally {
      dispatch(Updates.setIsChecking(false))
    }
  }
)

export const install = createOperation(
  "updates.install",
  async ({dispatch}) => {
    info("Installing Update")
    const onProgress = (n: number) => dispatch(Updates.setDownloadProgress(n))
    try {
      dispatch(Updates.setIsDownloading(true))
      dispatch(Updates.setDownloadProgress(0))
      await updater.install(onProgress)
    } catch (e) {
      info("Error Installing")
      dispatch(Updates.setError(errorToString(e)))
    } finally {
      dispatch(Updates.setIsDownloading(false))
    }
  }
)
