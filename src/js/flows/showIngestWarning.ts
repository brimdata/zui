import * as remote from "@electron/remote"

export default function showIngestWarning(pools: string[]) {
  return remote.dialog
    .showMessageBox({
      type: "warning",
      title: "Confirm Close Window",
      message: "Are you sure you want to close while loading?",
      detail: `This will delete the partial generated data for: ${pools.join(
        ", "
      )}`,
      buttons: ["OK", "Cancel"],
    })
    .then(({response}) => {
      if (response === 0) return
      else throw new Error("Canceled Unload")
    })
}
